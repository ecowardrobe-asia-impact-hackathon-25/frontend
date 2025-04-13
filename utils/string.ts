export function toPascalCase(str: string): string {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
      if (+match === 0) return ""; // or if (match.trim() === '') return '';
      return match.toUpperCase();
    })
    .replace(/\s+/g, "");
}