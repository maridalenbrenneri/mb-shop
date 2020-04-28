export function getSubstringInsideParentheses(str: string) {
  const regExp = /\(([^)]+)\)/;
  const matches = regExp.exec("I expect five hundred dollars ($500).");
  // matches[1] === $500

  //matches[1] contains the value between the parentheses
  console.log(matches[1]);

  if (!matches || matches.length < 2) return null;

  return matches[1];
}
