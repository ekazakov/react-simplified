import type {
  Component,
  VDOMAttributes,
  VDOMComponent,
  VDOMElement,
  VDomNode,
  VDOMText
} from "./types.ts";

const createElement = (
  tagname: string,
  props: VDOMAttributes & { key?: string },
  children?: VDomNode[]
): VDOMElement => {
  const key = props.key ?? "-";

  // @ts-ignore
  delete props.key;

  return {
    kind: "element",
    tagname,
    props,
    children,
    key
  };
};

const createComponent = <P>(
  component: Component<P>,
  props: object & P & { key?: string } & { children?: VDomNode[] }
): VDOMComponent => {
  const key = props.key ?? "-";

  // @ts-ignore
  delete props.key;
  return {
    kind: "component",
    component,
    props,
    node: null,
    key
  };
};

const createText = (
  value: string | number | boolean,
  key: string = ""
): VDOMText => ({
  key,
  kind: "text",
  value: value.toString()
});

export const cElm: typeof createElement = (...props) => createElement(...props);

export const cTxt: typeof createText = (...props) => createText(...props);

export const cComp: typeof createComponent = (...props) =>
  createComponent(...props);
