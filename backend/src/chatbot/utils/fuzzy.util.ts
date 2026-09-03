export function levenshteinDistance(a: string, b: string): number {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1;
      matrix[i][j] = Math.min(matrix[i - 1][j] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j - 1] + cost);
    }
  }
  return matrix[b.length][a.length];
}

export function fuzzyContains(text: string, keyword: string): boolean {
  if (text.includes(keyword)) return true;
  const threshold = keyword.length <= 4 ? 1 : 2;
  return text.split(/\s+/).some(
    token => token.length >= 3 && levenshteinDistance(token, keyword) <= threshold,
  );
}
