import { expect, it, describe, beforeEach } from "vitest";
import { cElm, cTxt, renderDOM, resetGlobals } from "../index";

describe("render", () => {
  beforeEach(async () => {
    resetGlobals();
  });

  it("should render a component", () => {
    const rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
    // console.log(x.toString());
    renderDOM("root", cElm("div", { id: "test" }, [cTxt("Hello, World!")]));
    // console.log(document.getElementById("root").innerHTML);
    expect(rootElement.innerHTML).toBe(`<div id="test">Hello, World!</div>`);
  });
});
