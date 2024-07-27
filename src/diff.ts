import _ from "lodash";

import type {
  AttributesUpdater,
  ChildUpdater,
  InsertOperation,
  RemoveOperation,
  ReplaceOperation,
  SkipOperation,
  UpdateOperation,
  VDOMAttributes,
  VDomNode,
  VDomNodeUpdater
} from "./types.ts";

export const createDiff = (
  oldNode: VDomNode,
  newNode: VDomNode
): VDomNodeUpdater => {
  // diff text nodes
  if (
    oldNode.kind === "text" &&
    newNode.kind === "text" &&
    newNode.value === oldNode.value
  ) {
    return skip();
  }

  if (oldNode.kind === "text" || newNode.kind === "text")
    return replace(newNode);

  if (
    oldNode.kind == "component" &&
    newNode.kind == "component" &&
    oldNode.component == newNode.component
  ) {
    if (!oldNode.node) {
      console.error(`Old node is not mounted:`, oldNode);
      throw new Error(`Old node is not mounted`);
    }

    if (_.isEqual(oldNode.props, newNode.props)) return skip();

    const node = newNode.component(newNode.props);
    newNode.node = node;
    return createDiff(oldNode.node, node);
  }

  // removing a component
  if (
    (oldNode.kind === "component" && newNode.kind !== "component") ||
    (oldNode.kind === "component" &&
      newNode.kind === "component" &&
      oldNode.component !== newNode.component)
  ) {
    oldNode.node = null;
    if (newNode.kind === "component") {
      const node = newNode.component(newNode.props);
      newNode.node = node;
      return replace(node);
    }

    return replace(newNode);
  }

  // replace with different component
  if (newNode.kind == "component") {
    const node = newNode.component(newNode.props);
    newNode.node = node;
    return { kind: "replace", node };
  }

  if (oldNode.kind === "component") {
    throw new Error("Unexpectedly old node is a component");
  }

  // If the tagname of a node is changed we have to replace it completly
  if (newNode.tagname !== oldNode.tagname) {
    return replace(newNode);
  }

  const attUpdater: AttributesUpdater = {
    remove: diffDeletdProps(newNode.props ?? {}, oldNode.props ?? {}),
    set: diffUpdateProps(newNode.props ?? {}, oldNode.props ?? {})
  };

  const childrenUpdater = childrenDiff(
    oldNode.children ?? [],
    newNode.children ?? []
  );

  return update(attUpdater, childrenUpdater);
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
    child
  ]);
  const remainingNew: Remaining[] = newChildren.map((child) => [
    child.key,
    child
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

    operations.push(createDiff(oldNode, newNode));
    // find next update
    firstUpdateKey = getNextUpdateKey(remainingOld, remainingNew);
  }

  // remove all remaing old childs after the last update
  removeUntilKey(operations, remainingOld, null);

  // insert all remaing new childs after the last update
  insertUntilKey(operations, remainingNew, null);

  return operations;
};

const skip = (): SkipOperation => ({ kind: "skip" });

const remove = (): RemoveOperation => ({ kind: "remove" });

const replace = (node: VDomNode): ReplaceOperation => ({
  kind: "replace",
  node
});

const insert = (node: VDomNode): InsertOperation => ({
  kind: "insert",
  node
});

const update = (
  attributes: AttributesUpdater,
  children: ChildUpdater[]
): UpdateOperation => ({
  kind: "update",
  attributes,
  children
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
        [key]: newProps[key]
      }),
      {} as VDOMAttributes
    );
};
