export const removeLastComma = str => {
  return (
    str.substring(0, str.lastIndexOf(",")) +
    str.substring(str.lastIndexOf(",") + 2)
  );
};
