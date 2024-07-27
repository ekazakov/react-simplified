// https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d

import "./style.css";
import { cElm, cTxt } from "./virtual-dom.ts";
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

// testDiffing();

const counterTest = () => {
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

counterTest();
