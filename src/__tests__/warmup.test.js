import { test, expect, it, describe } from "vitest";

describe.skip("warmup", () => {
  it("should be true", () => {
    expect(true).toBe(true);
  });

  it("should create a new instance of the element", () => {
    const element = document.createElement("div");
    expect(element).not.toBeNull();
  });

  it("should trigger a click event", () => {
    return new Promise((resolve, reject) => {
      const element = document.createElement("div");
      element.addEventListener("click", () => {
        console.log("click event");

        try {
          expect(false).toBe(true);
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      element.click();
    });
  });

  it("should trigger an input event", async () => {
    const element = document.createElement("input");
    return new Promise((resolve, reject) => {
      element.addEventListener("input", () => {
        console.log("input event");

        try {
          expect(element.value).toBe("Hii");
          resolve();
        } catch (error) {
          reject(error);
        }
      });
      element.dispatchEvent(new InputEvent("input", { data: "Hii" }));
    });
  });

  it("simple async test", async () => {
    const element = document.createElement("input");
    const eventPromise = new Promise((resolve) => {
      element.addEventListener("input", () => {
        console.log("input event");

        resolve(element.value);
      });
    });

    element.value = "Hello";
    element.dispatchEvent(new Event("input"));
    const result = await eventPromise;
    expect(result).toBe("Hello");
  });
});
