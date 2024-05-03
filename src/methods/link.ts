export default function convertToAbsoluteLink(
  url: string,
  base: string
): string {
  let toProcessUrl: string = url.trim();
  if (
    toProcessUrl.startsWith("https://") ||
    toProcessUrl.startsWith("http://")
  ) {
    return toProcessUrl;
  }
  if (toProcessUrl.startsWith("//")) {
    toProcessUrl = `https:${toProcessUrl}`;
    return toProcessUrl;
  }
  if (toProcessUrl.startsWith("/")) {
    const baseURL: string = new URL(base).origin;
    toProcessUrl = `${baseURL}${toProcessUrl}`;
    return toProcessUrl;
  }
  if (toProcessUrl.startsWith("./")) {
    toProcessUrl = toProcessUrl.slice(2);
    const baseObj: URL = new URL(base);
    const pathArr: string[] = baseObj.pathname.split("/");
    if (!base.endsWith("/")) {
      pathArr.pop();
    }
    pathArr.pop();
    pathArr.push(toProcessUrl);
    const newPath: string = pathArr.join("/");
    toProcessUrl = `${baseObj.origin}${
      base.endsWith("/") ? "" : "/"
    }${newPath}`;
    return toProcessUrl;
  }
  if (toProcessUrl.startsWith("..")) {
    const baseObj: URL = new URL(base);
    const path: string[] = baseObj.pathname.split("/");
    let relatCount: number = toProcessUrl.split("..").length - 1;
    let isValid: boolean = true;
    for (let i = 0; i < relatCount; i++) {
      const popped: any = path.pop();
      if (popped === undefined) {
        isValid = false;
      }
    }
    const newPath: string = path.join("/");
    toProcessUrl = isValid ? `${baseObj.origin}${newPath}` : "";
    return toProcessUrl;
  }
  return "";
}
