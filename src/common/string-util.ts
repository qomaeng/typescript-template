export function parseStringList(str?: string, delim = ','): string[] {
  return !str
    ? []
    : str
        .split(delim)
        .map((s) => s.trim())
        .filter(Boolean);
}
