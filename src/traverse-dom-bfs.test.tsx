import { traverseDomBfs } from "./traverse-dom-bfs";

describe("traverse-dom-bfs", () => {
  const one = document.createElement("div");
  one.id = "1";

  const two = document.createElement("div");
  two.id = "2";

  const three = document.createElement("div");
  three.id = "3";

  const four = document.createElement("div");
  four.id = "4";
  one.appendChild(four);

  document.body.appendChild(one);
  document.body.appendChild(two);
  document.body.appendChild(three);
  document.body.id = "0";

  it("traverses the dom in breadth first search order", () => {
    const ids: string[] = [];
    traverseDomBfs(document.body, (node) => {
      ids.push(node.id);
    });

    expect(ids).toEqual(["0", "1", "2", "3", "4"]);
  });

  it("stops when callback returns true", () => {
    const ids: string[] = [];
    traverseDomBfs(document.body, (node) => {
      ids.push(node.id);
      if (node.id === "2") {
        return true;
      }
    });

    expect(ids).toEqual(["0", "1", "2"]);
  });
});
