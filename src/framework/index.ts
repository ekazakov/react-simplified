import { setGlobalContext } from "./global-context";
import { resetGlobalRootAndNodesMap } from "./render.ts";
import { resetHooks } from "./hooks.ts";
export { useState, useEffect } from "./hooks.ts";
export { renderDOM } from "./render.ts";
export { cComp, cElm, cTxt } from "./virtual-dom.ts";

export const resetGlobals = () => {
  resetGlobalRootAndNodesMap();
  setGlobalContext(null);
  resetHooks();
};
