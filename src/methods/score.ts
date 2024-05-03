export function calculateScore(
  title: string,
  textContent: string,
  h1: string,
  allHeadings: string,
  keywords: string,
  description: string
): number {
  let score = 0;
  if (title.trim() !== "") {
    score++;
  }
  if (textContent.trim() !== "") {
    score += 0.5;
  } else {
    score--;
  }
  if (h1.trim() !== "") {
    score += 0.5;
  } else {
    score--;
  }
  if (allHeadings.length > 60) {
    score += 3;
  } else if (allHeadings.length > 35) {
    score += 2;
  } else if (allHeadings.length > 10) {
    score += 1;
  } else {
    score += 0.5;
  }
  if (keywords.trim() !== "") {
    score += 0.5;
  }
  if (description.trim() !== "") {
    score += 0.5;
  }
  return score;
}
