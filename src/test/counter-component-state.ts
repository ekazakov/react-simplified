import { cComp, cElm, cTxt } from "../virtual-dom.ts";
import { renderDOM, updateComponent } from "../render.ts";
import { getGlobalContext } from "../global-context.ts";

export const counterComponentStateTest = () => {
  let _state = 0;

  const useState = (initialState: number) => {
    _state = _state ?? initialState;
    const context = getGlobalContext();
    const setState = (newState: number) => {
      _state = newState;
      updateComponent(context);
    };

    return [_state, setState] as const;
  };

  const Counter = () => {
    const [counter, setCounter] = useState(0);

    const increment = () => {
      setCounter(counter + 1);
    };

    const decrement = () => {
      setCounter(counter - 1);
    };

    return cElm("div", { className: "counter" }, [
      cElm("div", {}, [cTxt(`Counter: ${counter}`)]),
      cElm("button", { key: "increment", onclick: increment }, [
        cTxt("Increment")
      ]),
      cElm("button", { key: "decrement", onclick: decrement }, [
        cTxt("Decrement")
      ])
    ]);
  };

  const App = () => {

    return cElm("div", {}, [cComp(Counter, {})]);
  };

  renderDOM("app", cComp(App, {}));
};
