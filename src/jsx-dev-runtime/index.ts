import { cComp, cElm, cTxt } from "../framework";

const processChildren: any = (children: (object | string)[]) => {
  // console.log("children", children);
  return children.map((child) =>
    typeof child === "object" ? child : cTxt(child)
  );
};

export const jsxDEV = (type: any, config: any) => {
  const { children, ...props } = config;
  const childrenProps = [].concat(children).filter((child) => child !== undefined);

  if (typeof type === "function") {
    return cComp(type, {
      ...props,
      children: processChildren(childrenProps)
    });
  }

  return cElm(type, props, processChildren(childrenProps));
};

export const jsxsDEV = jsxDEV;
