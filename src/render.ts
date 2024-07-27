// https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d

import type { ChildUpdater, VDomNode, VDomNodeUpdater } from "./types";
import { createDiff } from "./diff.ts";

let globalRoot: VDomNode | null = null;


export const renderDOM = (htmlId: string, rootNode: VDomNode) => {
  const elem = document.getElementById(htmlId);
  if (elem == null) {
    throw new Error("Container elem not found");
  }

  // elem.innerHTML = "";
  // elem.appendChild(renderElement(rootNode));

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
    elem.replaceWith(renderElement(diff.node));
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
      node.node = node.component(node.props);
      return renderElement(node.node);
    }

    return renderElement(node.node);
  }

  throw new Error(`Unknown node kind: ${(node as any)?.kind}`);
};
