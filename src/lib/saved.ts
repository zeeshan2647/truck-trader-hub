const KEY = "rigmarket:saved";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function getSaved(): string[] {
  return read();
}

export function isSaved(id: string): boolean {
  return read().includes(id);
}

export function toggleSaved(id: string): boolean {
  const cur = read();
  const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event("rigmarket:saved-changed"));
  return next.includes(id);
}