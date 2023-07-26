export const f6l4 = (str) => {
  if (!str) return "";
  const first6 = str.slice(0, 6);
  const last4 = str.slice(-4);
  return `${first6}...${last4}`;
};
