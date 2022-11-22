export const shorten = (hash: string, head?: number, tail?: number) => {
  const n = hash.length;
  return hash.slice(0, head || 10) + "…" + hash.slice(n - (tail || 6));
};
