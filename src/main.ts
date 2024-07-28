// https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d

import "./style.css";
import { counterElementTest } from "./test/counter-element.ts";

import { cComp, cElm, cTxt } from "./virtual-dom.ts";
import { renderDOM } from "./render.ts";

// const App = () => {
//   return cElm("article", { className: "main", key: "article-1" }, [
//     cElm("h1", { className: "article-header", key: "h1-1" }, [
//       cTxt("Hello React")
//     ]),
//     cElm("p", { className: "article-content", key: "p-1" }, [
//       cTxt("OMG! It's amaising!")
//     ])
//   ]);
// };

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

counterComponentTest();
// testDiffing();
// counterElementTest();
