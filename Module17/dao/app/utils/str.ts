//Generate a function that returns a string's first 6 and last 4 characters

export function f4l4(str: string): string {
  const first = str.slice(0, 6);
  const last = str.slice(-4);
  return first + "..." + last;
}
