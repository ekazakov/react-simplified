import { getGlobalContext } from "./global-context.ts";
import { updateComponent } from "./render.ts";

let _states: any[] = [];

export const useState = (initialState: number) => {
  const context = getGlobalContext();
  const index = context.hookPointer;
  context.hookPointer++;
  _states[index] = _states[index] ?? initialState;

  const setState = (newState: number) => {
    _states[index] = newState;
    updateComponent(context);
  };

  return [_states[index], setState] as const;
};
