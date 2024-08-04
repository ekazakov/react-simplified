// https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d

import type {
  ChildUpdater,
  VDOMComponent,
  VDomNode,
  VDomNodeUpdater
} from "./types";
import { createDiff } from "./diff.ts";
import { setGlobalContext } from "./global-context.ts";
import { _effects } from "./hooks.ts";

let globalRoot: VDomNode | null = null;

export const nodesMap = new Map<VDomNode, HTMLElement | Text>();

export const resetGlobalRootAndNodesMap = () => {
  globalRoot = null;
  nodesMap.clear();
};

export const renderDOM = (htmlId: string, rootNode: any) => {
  const elem = document.getElementById(htmlId);
  if (elem == null) {
    throw new Error("Container elem not found");
  }

  if (globalRoot != null) {
    applyUpdate(
      elem.firstElementChild! as HTMLElement,
      createDiff(globalRoot, rootNode)
    );
  } else {
    elem.innerHTML = "";
    elem.appendChild(renderElement(rootNode));
  }

  globalRoot = rootNode;
};

export const applyUpdate = (
  elem: HTMLElement | Text,
  diff: VDomNodeUpdater
): HTMLElement | Text => {
  if (diff.kind === "skip") return elem;

  if (diff.kind === "replace") {
    const newElem = renderElement(diff.node);
    elem.replaceWith(newElem);
    nodesMap.set(diff.node, newElem);
    return elem;
  }

  if ("wholeText" in elem) throw new Error("invalid update for Text node");

  for (const att in diff.attributes.remove) {
    elem.removeAttribute(att);
  }

  for (const att in diff.attributes.set) {
    (elem as any)[att] = diff.attributes.set[att];
  }

  applyChildrenDiff(elem, diff.children);

  return elem;
};

const applyChildrenDiff = (elem: HTMLElement, operations: ChildUpdater[]) => {
  let offset = 0;

  for (let i = 0; i < operations.length; i++) {
    const childUpdater = operations[i];

    if (childUpdater.kind == "skip") continue;

    if (childUpdater.kind == "insert") {
      if (elem.childNodes[i + offset - 1])
        elem.childNodes[i + offset - 1].after(renderElement(childUpdater.node));
      else elem.appendChild(renderElement(childUpdater.node));
      continue;
    }

    const childElem = elem.childNodes[i + offset];

    if (childUpdater.kind == "remove") {
      childElem.remove();
      offset -= 1;
      continue;
    }

    applyUpdate(childElem as HTMLElement, childUpdater);
  }
};

export const renderElement = (node: VDomNode): HTMLElement | Text => {
  if (node.kind === "text") {
    return document.createTextNode(node.value);
  }

  if (node.kind === "element") {
    const elem = document.createElement(node.tagname);
    for (const attr in node.props || {}) {
      (elem as any)[attr] = node.props?.[attr];
    }

    node.children?.forEach((child) => {
      elem.appendChild(renderElement(child));
    });

    return elem;
  }

  if (node.kind === "component") {
    if (!node.node) {
      callComponent(node);
      const elem = renderElement(node.node!);
      nodesMap.set(node, elem);
      return elem;
    }

    const elem = renderElement(node.node);
    nodesMap.set(node, elem);
    return elem;
  }

  throw new Error(`Unknown node kind: ${(node as any)?.kind}`);
};

export const callComponent = (node: VDOMComponent) => {
  setGlobalContext({ currentNode: node, hookPointer: 0 });
  node.node = node.component(node.props);
  const { deps = [], prevDeps, callback } = _effects.get(node) ?? {};
  const depsChanged = !deps.every((d: any, i: number) => d === prevDeps[i]);

  if (callback && (depsChanged || !prevDeps)) {
    callback();
  }

  setGlobalContext(null);
  return node.node;
};

export const updateComponent = (context: any) => {
  const componentNode = context?.currentNode;
  const elem = nodesMap.get(componentNode);

  const diff = createDiff(
    context?.currentNode.node,
    callComponent(componentNode)
  );

  applyUpdate(elem as HTMLElement, diff);
};
