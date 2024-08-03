// https://itnext.io/creating-our-own-react-from-scratch-82dd6356676d

import "./style.css";

const App = () => <p>!</p>;

const foo = () => (
  <div>
    <App x={1} />
    <div>Foo</div>
  </div>
);

foo();
// import { counterComponentStateTest } from "./test/counter-component-state.ts";

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

// counterComponentTest();
// testDiffing();
// counterElementTest();
// counterComponentStateTest()
