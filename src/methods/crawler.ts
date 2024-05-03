import { JSDOM } from "jsdom";
import { cleanText } from "./clean";
import { CrawledData } from "../types/crawler";
import convertToAbsoluteLink from "./link";
import { searchInQueue } from "./queue";
import { QueueNode } from "../types/queue";
import { queue } from "./queue";
import { calculateScore } from "./score";

/**
 * Crawls page
 * @param url Accepts an Absolute URL
 * @author Paurush Sinha
 */
export async function crawlLink(url: string) {
  const response = await fetch(url);
  const page = await response.text();

  // CHECKING IF THE PAGE RETURNED ERROR 404
  if (response.status !== 200) return;
  
  const dom = new JSDOM(page);
  const doc = dom.window.document;

  // Removing JS from DOM
  const scripts: NodeListOf<HTMLScriptElement> = doc.querySelectorAll("script");
  scripts.forEach((script: HTMLScriptElement) => script.remove());

  // REMOVING CSS FROM DOM
  const styles: NodeListOf<HTMLStyleElement> = doc.querySelectorAll("style");
  styles.forEach((style: HTMLStyleElement) => style.remove());

  // GETTING TITLE
  const title: string = doc.querySelector("title")?.innerHTML ?? "";

  // GETTING KEYWORDS
  const keywords: string =
    doc.querySelector("meta[name='keywords']")?.getAttribute("content") ?? "";

  //   GETTING DESCRIPTION
  const description: string =
    doc.querySelector("meta[name='description']")?.getAttribute("content") ??
    "";

  //   GETTING H1
  const h1: string = cleanText(doc.querySelector("h1")?.textContent ?? "");

  // GETTING OTHER LEVELS OF HEADING
  const headings: NodeListOf<HTMLHeadingElement> =
    doc.querySelectorAll("h2, h3, h4, h5, h6");

  //   STORING OTHER HEADING textContent IN ONE VARIABLE alHeadings
  let allHeadings: string = "";
  headings.forEach((heading) => {
    const cleanHeading = cleanText(heading.textContent ?? "");
    allHeadings = `${allHeadings} ${cleanHeading}`;
    heading.remove();
  });

  // GETTING ALL OTHER TEXT CONTENT IN BODY
  const textContent: string =
    cleanText(doc.querySelector("body")?.textContent ?? "") ?? "";

  //   CALCULATING PAGE SCORE
  const score: number = calculateScore(
    title,
    textContent,
    h1,
    allHeadings,
    keywords,
    description
  );

  // MAKING PAGE DATA OBJECT
  const pageData: CrawledData = {
    title: title,
    content: textContent,
    heading: h1,
    hlevels: allHeadings,
    url: url,
    keywords: keywords,
    description: description,
    score: score,
  };
  console.log(pageData.title, pageData.url);

  const allAnchors: NodeListOf<HTMLAnchorElement> = doc.querySelectorAll("a");

  allAnchors.forEach((anchor: HTMLAnchorElement) => {
    const href: string = anchor.getAttribute("href") ?? "";
    const isNofollow: boolean =
      anchor.getAttribute("rel")?.includes("nofollow") ?? false;

    if (href.trim() !== "" && !href.startsWith("#")) {
      const absLink: string = convertToAbsoluteLink(href, url);
      const indexInQueue: number = searchInQueue(absLink);
      if (indexInQueue !== -1) {
        queue[indexInQueue].addScore += isNofollow ? 0.5 : 1;
      } else {
        const newElement: QueueNode = {
          url: absLink,
          addScore: isNofollow ? 0.5 : 1,
        };
        if (newElement.url.startsWith("http")) queue.push(newElement);
      }
    }
  });
}
