import { crawlLink } from "./crawler";
import { queue } from "./queue";
export async function crawlAllLinks() {
  for (let i = 0; i < queue.length; i++) {
    try {
      await crawlLink(queue[i].url);
    } catch (error) {
      console.error(`Error Occured in Crawling ${queue[i].url}`);
    }
  }
}
