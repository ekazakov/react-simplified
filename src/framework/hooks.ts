import { getGlobalContext } from "./global-context.ts";
import { updateComponent } from "./render.ts";
import { VDomNode } from "./types.ts";

export let _states: any[] = [];
export let _effects = new Map<VDomNode, any>();

export const resetHooks = () => {
  _states = [];
  _effects = new Map<VDomNode, any>();
};

export const useState = (initialState: number) => {
  const context = getGlobalContext();
  const index = context.hookPointer;
  context.hookPointer++;
  _states[index] = _states[index] ?? initialState;

  // console.log("index:", index, "useState", _states[index]);
  const setState = (newState: number) => {
    _states[index] = newState;
    updateComponent(context);
  };

  return [_states[index], setState] as const;
};

export const useEffect = (callback: () => void, deps: any[]) => {
  const context = getGlobalContext();
  const node = context.currentNode;

  _effects.set(node, {
    callback,
    deps,
    prevDeps: _effects.get(node)?.deps
  });
};
