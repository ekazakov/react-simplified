import { beforeEach, describe, expect, it } from "vitest";
import { renderDOM, resetGlobals, useState } from "../index";

export const trimHtml = (html: string) => {
  return html.replace(/([\n\t])/g, "").replace(/>\s+</g, "><");
};

export const waitForEvent = (element: Element, eventName: string) => {
  return new Promise<void>((resolve) => {
    element.addEventListener(eventName, () => {
      resolve();
    });
  });
};

describe("render", () => {
  beforeEach(async () => {
    resetGlobals();
  });

  let rootElement: HTMLElement = null!;

  beforeEach(() => {
    document.body.innerHTML = "";
    rootElement = document.createElement("div");
    rootElement.id = "root";
    document.body.appendChild(rootElement);
  });

  it("should render an element", () => {
    renderDOM("root", <div id="test">Hello, World!</div>);
    expect(rootElement.innerHTML).toBe(`<div id="test">Hello, World!</div>`);
  });

  it("should render an element with children", () => {
    renderDOM(
      "root",
      <div id="test">
        <article className="main">
          <h1 className="article-header">Hello, World!</h1>
          <p>OMG! It's amazing!</p>
        </article>
      </div>
    );

    expect(rootElement.innerHTML).toBe(
      trimHtml(`<div id="test">
        <article class="main">
          <h1 class="article-header">Hello, World!</h1>
          <p>OMG! It's amazing!</p>
        </article>
      </div>`)
    );
  });

  it("should render a Component", () => {
    const ChildTestComponent = ({ children }: any) => {
      return (
        <div>
          <h2>{children}</h2>
        </div>
      );
    };

    const TestComponent = () => {
      return (
        <div>
          <h1>Component</h1>
          <ChildTestComponent>Child Component</ChildTestComponent>
        </div>
      );
    };

    renderDOM("root", <TestComponent />);
    expect(rootElement.innerHTML).toBe(
      trimHtml(`<div>
        <h1>Component</h1>
        <div>
           <h2>Child Component</h2>
        </div>
      </div>`)
    );
  });

  it("should rerender on state update", async () => {
    const Counter = ({ initialCount }) => {
      const [counter, setCounter] = useState(initialCount);
      return (
        <div className="counter">
          <div key="value">Counter: {counter}</div>
          <button
            id="increment"
            key="increment"
            // @ts-ignore
            onclick={() => setCounter(counter + 1)}
          >
            Increment
          </button>
          <button
            id="decrement"
            key="decrement"
            // @ts-ignore
            onclick={() => setCounter(counter - 1)}
          >
            Decrement
          </button>
        </div>
      );
    };

    renderDOM("root", <Counter initialCount={2} />);

    expect(rootElement.innerHTML).toBe(
      trimHtml(`<div class="counter">
        <div>Counter: 2</div>
        <button id="increment">Increment</button>
        <button id="decrement">Decrement</button>
      </div>`)
    );

    const incrementButton = rootElement.querySelector("#increment")!;
    const clickPromise = waitForEvent(incrementButton, "click");
    incrementButton.dispatchEvent(new MouseEvent("click"));

    await clickPromise;
    expect(rootElement.innerHTML).toBe(
      trimHtml(`<div class="counter">
        <div>Counter: 3</div>
        <button id="increment">Increment</button>
        <button id="decrement">Decrement</button>
      </div>`)
    );
  });
});
