import { cElm, cTxt } from "../virtual-dom.ts";
import { renderDOM } from "../render.ts";

export const counterElementTest = () => {
  let counter = 0;
  const increment = () => {
    counter++;
    render();
  };
  const decrement = () => {
    counter--;
    render();
  };

  const render = () => {
    const node = cElm("div", { key: "counter" }, [
      cElm("div", { key: "counter-label" }, [
        cTxt(`Counter`),
        cElm("span", { key: "counter-value" }, [cTxt(counter)])
      ]),
      cElm("button", { key: "increment", onclick: increment }, [
        cTxt("Increment")
      ]),
      cElm("button", { key: "decrement", onclick: decrement }, [
        cTxt("Decrement")
      ])
    ]);
    renderDOM("app", node);
  };

  render();
};
