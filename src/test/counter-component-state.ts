import { cComp, cElm, cTxt } from "../virtual-dom.ts";
import { renderDOM } from "../render.ts";
import { useState } from "../hooks.ts";

export const counterComponentStateTest = () => {
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
    return cElm("div", {}, [
      cElm("h1", { key: "h1-1" }, [cTxt("Counter 1")]),
      cComp(Counter, { key: "counter-1" }),
      cElm("h1", { key: "h1-2" }, [cTxt("Counter 2")]),
      cComp(Counter, { key: "counter-2" })
    ]);
  };

  renderDOM("app", cComp(App, {}));
};
