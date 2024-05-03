/**
 * @author Paurush Sinha
 * This crawler can crawl all the internet if provided enough resources.
 */

import { Database } from "./methods/mysql";
import { addUrlToQueue } from "./methods/queue";
import { crawlAllLinks } from "./methods/queueIteraor";

export const db = new Database();
// Adds an URL in Queue which acts as an starting point for the crawler.
addUrlToQueue("https://www.wikipedia.org/");

// Start crawling the links in the queue.
crawlAllLinks();
