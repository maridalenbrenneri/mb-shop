export function getSubstringInsideParentheses(str: string) {
  const regExp = /\(([^)]+)\)/;
  const matches = regExp.exec(str);

  //matches[1] contains the value between the parentheses

  if (!matches || matches.length < 2) return null;

  return matches[1];
}
