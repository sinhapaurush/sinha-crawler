export function sanitize(text: string) {
  const regex = /[^a-zA-Z0-9\s]/g;
  // @ts-ignore replaceAll is supported in Node 8 <
  text = text.replaceAll(regex, " ");
  return text;
}
