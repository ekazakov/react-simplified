import { cElm, cTxt } from "../framework/virtual-dom.ts";
import { createDiff } from "../framework/diff.ts";

export const testDiffing = () => {
  const node1_1 = cElm("article", { className: "main", key: "article-1" }, []);
  const node2_1 = cElm("article", { className: "main", key: "article-1" }, []);

  const node1_2 = cElm(
    "article",
    { className: "main", bar: "x", key: "article-1" },
    []
  );
  const node2_2 = cElm(
    "article",
    { className: "main2", foo: "x", key: "article-1" },
    []
  );

  const node1_3 = cElm(
    "article",
    { className: "main", bar: "x", key: "article-1" },
    []
  );
  const node2_3 = cElm(
    "div",
    { className: "main", foo: "x", key: "article-1" },
    []
  );

  const node1_4 = cElm("article", { className: "main", key: "article-1" }, []);
  const node2_4 = cElm("article", { className: "main", key: "article-1" }, [
    cTxt("Hello React")
  ]);

  const node1_5 = cElm("article", { className: "main", key: "article-1" }, [
    cTxt("Hello React")
  ]);
  const node2_5 = cElm("article", { className: "main", key: "article-1" }, []);

  const node1_6 = cElm("article", { className: "main", key: "article-1" }, [
    cTxt("Hello React")
  ]);
  const node2_6 = cElm("article", { className: "main", key: "article-1" }, [
    cTxt("Hello React")
  ]);

  const node1_7 = cElm("article", { className: "main", key: "article-1" }, [
    cTxt("Hello React")
  ]);
  const node2_7 = cElm("article", { className: "main", key: "article-1" }, [
    cTxt("Hello Vue")
  ]);

  console.log("diff1", createDiff(node1_1, node2_1));
  console.log("diff2", createDiff(node1_2, node2_2));
  console.log("diff3", createDiff(node1_3, node2_3));
  console.log("diff4", createDiff(node1_4, node2_4));
  console.log("diff5", createDiff(node1_5, node2_5));
  console.log("diff6", createDiff(node1_6, node2_6));
  console.log("diff7", createDiff(node1_7, node2_7));
};
