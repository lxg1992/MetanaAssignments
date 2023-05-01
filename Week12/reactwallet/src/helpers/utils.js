export const f4l4 = (str) => {
  return (
    str.substring(0, 4) + "......" + str.substring(str.length - 4, str.length)
  );
};

// Function to capitalize the first letter of a string
export const firstCap = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};
