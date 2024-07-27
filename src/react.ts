// https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d

import type {
  VDOMAttributes,
  VDOMElement,
  VDomNode,
  VDOMText,
  VDomNodeUpdater,
  ChildUpdater,
  AttributesUpdater,
  SkipOperation,
  ReplaceOperation,
  RemoveOperation,
  InsertOperation,
  UpdateOperation,
  VDOMComponent,
  Component,
} from './types';
import _ from 'lodash';

let globalRoot: VDomNode = null!;

export const React = {
  renderDOM: (htmlId: string, rootNode: VDomNode): HTMLElement => {
    globalRoot = rootNode;

    const elem = document.getElementById(htmlId);
    if (elem == null) {
      throw new Error('Container elem not found');
    }

    const parent = elem.parentElement!;

    elem.replaceWith(React.renderElement(rootNode));

    return parent.children[0] as HTMLElement;
  },

  renderElement: (node: VDomNode): HTMLElement => {
    console.log('renderElement with node:', node);
    return document.createElement('div');
  },

  createElement: (
    tagname: string,
    props: VDOMAttributes & { key: string },
    children?: VDomNode[]
  ): VDOMElement => {
    const key = props.key;

    // @ts-ignore
    delete props.key;

    return {
      kind: 'element',
      tagname,
      props,
      children,
      key,
    };
  },

  createComponent: <P>(
    component: Component<P>,
    props: object & { key: string } & { children?: VDomNode[] }
  ): VDOMComponent => {
    const key = props.key;

    // @ts-ignore
    delete props.key;
    return {
      kind: 'component',
      component,
      props,
      key,
    };
  },

  createText: (
    value: string | number | boolean,
    key: string = ''
  ): VDOMText => ({
    key,
    kind: 'text',
    value: value.toString(),
  }),

  createDiff: (oldNode: VDomNode, newNode: VDomNode): VDomNodeUpdater => {
    // diff text nodes
    if (
      oldNode.kind === 'text' &&
      newNode.kind === 'text' &&
      newNode.value === oldNode.value
    ) {
      return skip();
    }

    if (oldNode.kind === 'text' || newNode.kind === 'text')
      return replace(newNode);

    if (
      oldNode.kind == 'component' &&
      newNode.kind == 'component' &&
      oldNode.component == newNode.component
      // oldNode.instance
    ) {
      // newNode.instance = oldNode.instance;
      if (_.isEqual(oldNode.props, newNode.props)) return skip();
      // return newNode.instance.setProps(newNode.props);
      return null;
    }

    if (oldNode.kind == 'component') {
      // oldNode.instance.unmount();
      // oldNode.instance = null;
      return replace(newNode);
    }

    // replace with different component
    if (newNode.kind == 'component') {
      // newNode.instance = new newNode.component();
      // return {
      //   kind: 'replace',
      //   newNode: newNode.instance.initProps(newNode.props),
      //   callback: (e) => newNode.instance.notifyMounted(e),
      // };
      return {
        kind: 'replace',
        newNode: component(newNode.props),
      };
    }

    // If the tagname of a node is changed we have to replace it completly
    if (newNode.tagname !== oldNode.tagname) {
      replace(newNode);
    }

    const attUpdater: AttributesUpdater = {
      remove: diffDeletdProps(newNode.props ?? {}, oldNode.props ?? {}),
      set: diffUpdateProps(newNode.props ?? {}, oldNode.props ?? {}),
    };

    const childrenUpdater = childrenDiff(
      newNode.children ?? [],
      oldNode.children ?? []
    );

    return update(attUpdater, childrenUpdater);
  },
};

type Remaining = [string | number, VDomNode];

const getNextUpdateKey = (
  remainingOld: Remaining[],
  remainingNew: Remaining[]
) => {
  const newKeys = remainingNew.map(([key]) => key);
  const [firstUpdateKey] = remainingOld.find(([key]) =>
    newKeys.includes(key)
  ) ?? [null];

  return firstUpdateKey;
};

const removeUntilKey = (
  operations: ChildUpdater[],
  items: Remaining[],
  key: string | number | null
) => {
  while (items[0] && items[0][0] !== key) {
    items.shift();
    operations.push(remove());
  }
};

const insertUntilKey = (
  operations: ChildUpdater[],
  items: Remaining[],
  key: string | number | null
) => {
  while (items[0] && items[0][0] !== key) {
    operations.push(insert(items[0][1]));
    items.shift();
  }
};

const childrenDiff = (
  oldChildren: VDomNode[],
  newChildren: VDomNode[]
): ChildUpdater[] => {
  const remainingOld: Remaining[] = oldChildren.map((child) => [
    child.key,
    child,
  ]);
  const remainingNew: Remaining[] = newChildren.map((child) => [
    child.key,
    child,
  ]);

  const operations: ChildUpdater[] = [];

  // find the first element that got updated

  let firstUpdateKey = getNextUpdateKey(remainingOld, remainingNew);

  while (firstUpdateKey != null) {
    // first remove all old childs before the update
    removeUntilKey(operations, remainingOld, firstUpdateKey);
    // insert all new children before the update
    insertUntilKey(operations, remainingNew, firstUpdateKey);
    // generate diff for updated node
    const oldNode = remainingOld.shift()![1];
    const newNode = remainingNew.shift()![1];

    operations.push(React.createDiff(oldNode, newNode));
    // find next update
    firstUpdateKey = getNextUpdateKey(remainingOld, remainingNew);
  }

  // remove all remaing old childs after the last update
  removeUntilKey(operations, remainingOld, null);

  // insert all remaing new childs after the last update
  insertUntilKey(operations, remainingNew, null);

  return operations;
};

const skip = (): SkipOperation => ({ kind: 'skip' });

const remove = (): RemoveOperation => ({ kind: 'remove' });

const replace = (node: VDomNode): ReplaceOperation => ({
  kind: 'replace',
  node,
});

const insert = (node: VDomNode): InsertOperation => ({
  kind: 'insert',
  node,
});

const update = (
  attributes: AttributesUpdater,
  children: ChildUpdater[]
): UpdateOperation => ({
  kind: 'update',
  attributes,
  children,
});

export const diffDeletdProps = (
  newProps: VDOMAttributes,
  oldProps: VDOMAttributes
) => {
  const oldKeys = Object.keys(oldProps);
  const newKeys = Object.keys(newProps);
  return oldKeys.filter((key) => !newKeys.includes(key));
};

export const diffUpdateProps = (
  newProps: VDOMAttributes,
  oldProps: VDOMAttributes
): VDOMAttributes => {
  const newKeys = Object.keys(newProps);

  return newKeys
    .filter((key) => newProps[key] !== oldProps[key])
    .reduce(
      (acc, key) => ({
        ...acc,
        [key]: newProps[key],
      }),
      {} as VDOMAttributes
    );
};

export const cElm: typeof React.createElement = (...props) =>
  React.createElement(...props);

export const cTxt: typeof React.createText = (...props) =>
  React.createText(...props);

export const cComp: typeof React.createComponent = (...props) =>
  React.createComponent(...props);
