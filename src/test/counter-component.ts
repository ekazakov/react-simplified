import { cComp, cElm, cTxt } from "../framework/virtual-dom.ts";
import { renderDOM } from "../framework/render.ts";

export const counterComponentTest = () => {
  let counter = 0;

  const increment = () => {
    counter++;
    render(counter);
  };

  const decrement = () => {
    counter--;
    render(counter);
  };

  const Value = ({ value }: { value: number }) => {
    return cElm("span", {}, [cTxt(value)]);
  };

  const Counter = ({ value }: { value: number }) => {
    return cElm("div", {}, [
      cElm("div", {}, [
        cTxt(`Counter: `),
        cComp(Value, { key: "counter-value", value })
      ]),
      cElm("button", { key: "increment", onclick: increment }, [
        cTxt("Increment")
      ]),
      cElm("button", { key: "decrement", onclick: decrement }, [
        cTxt("Decrement")
      ])
    ]);
  };

  const render = (value: number) => {
    renderDOM("app", cComp(Counter, { key: "app", value }));
  };

  render(counter);
};
