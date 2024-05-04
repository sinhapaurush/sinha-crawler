import convertToAbsoluteLink from "./link";

type IconData = {
  status: boolean;
  path: string;
};
async function checkExistence(path: string, base: string): Promise<IconData> {
  if (path === "") {
    return {
      path: "",
      status: false,
    };
  }
  const finalPath = convertToAbsoluteLink(path, base);
  const iconExists = await fetch(finalPath);
  if (iconExists.status == 200) {
    return {
      status: true,
      path: finalPath,
    };
  } else {
    return {
      status: false,
      path: "",
    };
  }
}

async function checkMetaTagForFavicon(
  rel: string,
  base: string,
  doc: Document
): Promise<IconData> {
  const iconMeta = doc.querySelector(rel)?.getAttribute("href") ?? "";
  const iconMetaExistence = await checkExistence(iconMeta, base);
  return iconMetaExistence;
}

export default async function getFaviconURL(
  doc: Document,
  base: string
): Promise<string> {
  const rootIconExists = await checkExistence("/favicon.ico", base);
  if (rootIconExists.status) {
    return rootIconExists.path;
  }
  const shortcutIconMeta: IconData = await checkMetaTagForFavicon(
    "link[rel='shortcut icon']",
    base,
    doc
  );
  if (shortcutIconMeta.status) {
    return shortcutIconMeta.path;
  }

  const iconMeta: IconData = await checkMetaTagForFavicon(
    "link[rel='icon']",
    base,
    doc
  );
  if (iconMeta.status) {
    return iconMeta.path;
  }
  const favIconMeta: IconData = await checkMetaTagForFavicon(
    "link[rel='favicon']",
    base,
    doc
  );
  if (favIconMeta.status) {
    return favIconMeta.path;
  }

  return "none";
}
