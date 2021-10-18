// https://www.softnami.com/posts_pr/traversing_the_html_dom_using_depth_and_breath_first_search.html
export const traverseDomBfs = (
  node: HTMLElement,
  cb: (node: HTMLElement) => boolean | null | undefined | void
): HTMLElement | null => {
  const queue = [node];

  while (queue.length !== 0) {
    const currentNode = queue.shift()!;

    if (cb(currentNode)) {
      return currentNode;
    }

    if (currentNode?.children?.length) {
      // @ts-ignore
      for (const child of currentNode?.children) {
        queue.push(child);
      }
    }
  }

  return null;
};
