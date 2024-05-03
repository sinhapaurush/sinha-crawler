export function cleanText(text: string): string {
  // @ts-ignore replaceAll is supported in Node >= 8
  const cleanedText: string = text
    // @ts-ignore replaceAll is supported in Node >= 8
    .replaceAll("\n", " ")
    .replaceAll("\t", " ")
    .replaceAll("  ", " ");
  return cleanedText.trim();
}
