export function safeImageFilename(original: string, existing: string[]): string {
  const dot = original.lastIndexOf(".");
  const rawExt = dot >= 0 ? original.slice(dot + 1) : "";
  const rawBase = dot >= 0 ? original.slice(0, dot) : original;

  const ext = rawExt.toLowerCase().replace(/[^a-z0-9]/g, "");
  const base =
    rawBase
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "image";

  const taken = new Set(existing);
  const candidate = ext ? `${base}.${ext}` : base;
  if (!taken.has(candidate)) return candidate;

  let n = 1;
  for (;;) {
    const next = ext ? `${base}-${n}.${ext}` : `${base}-${n}`;
    if (!taken.has(next)) return next;
    n++;
  }
}
