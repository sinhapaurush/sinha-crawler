/**
 * @author Paurush Sinha
 * This crawler can crawl all the internet if provided enough resources.
 */

import { addUrlToQueue } from "./methods/queue";
import { crawlAllLinks } from "./methods/queueIteraor";

// Adds an URL in Queue which acts as an starting point for the crawler.
addUrlToQueue("https://www.google.com");
// Start crawling the links in the queue.
crawlAllLinks();
