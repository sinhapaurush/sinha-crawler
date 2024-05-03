import { QueueNode } from "../types/queue";
export const queue: QueueNode[] = [];
export function searchInQueue(url: string): number {
  let index = 0;
  let rVal = -1;
  queue.forEach((item) => {
    if (item.url === url) {
      rVal = index;
    }
    index++;
  });
  return rVal;
}
/**
 * Pushes new URL to queue
 * @param url Url to Insert into Crawl Queue
 * @returns Element added to Queue
 * @author Paurush Sinha
 */
export function addUrlToQueue(url: string): QueueNode {
  const queueElement: QueueNode = {
    url: url,
    addScore: 0,
  };
  queue.push(queueElement);
  return queueElement;
}
