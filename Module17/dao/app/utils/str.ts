//Generate a function that returns a string's first 6 and last 4 characters

export function f4l4(str: string): string {
  const first = str.slice(0, 6);
  const last = str.slice(-4);
  return first + "..." + last;
}

export function titleCase(str: string): string {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
}
