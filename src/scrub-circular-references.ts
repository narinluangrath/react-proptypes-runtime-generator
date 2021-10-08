import traverse from "traverse";

export function scrubCircularReferences(obj: object) {
  // eslint-disable-next-line array-callback-return
  return traverse(obj).map(function (x) {
    if (this.circular) {
      this.remove();
    }
  });
}
