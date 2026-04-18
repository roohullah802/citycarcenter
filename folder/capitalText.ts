export const capitalText = (str: string) => {
  return str
    .split(" ")
    .map((itm) => itm.charAt(0).toUpperCase() + itm.slice(1))
    .join(" ");
};
