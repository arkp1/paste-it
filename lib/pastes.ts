export type ExpiryOption = "never" | "hour" | "day" | "week";

export type Paste = {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  expiresAt: number | null;
  maxViews: number | null;
  views: number;
};

declare global {
  // Keep the collection across dev hot reloads. Replace this with a database for production use.
  // eslint-disable-next-line no-var
  var pasteStore: Map<string, Paste> | undefined;
}

const store = globalThis.pasteStore ?? new Map<string, Paste>();
globalThis.pasteStore = store;

const expiryDurations: Record<Exclude<ExpiryOption, "never">, number> = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000
};

export function createPaste(input: {
  title: string;
  content: string;
  expires: ExpiryOption;
  maxViews: number | null;
}) {
  const now = Date.now();
  const id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
  const paste: Paste = {
    id,
    title: input.title || "Untitled paste",
    content: input.content,
    createdAt: now,
    expiresAt: input.expires === "never" ? null : now + expiryDurations[input.expires],
    maxViews: input.maxViews,
    views: 0
  };
  store.set(id, paste);
  return paste;
}

export function readPaste(id: string): { paste?: Paste; expired: boolean } {
  const paste = store.get(id);
  if (!paste) return { expired: false };

  const expiredByTime = paste.expiresAt !== null && Date.now() >= paste.expiresAt;
  const expiredByViews = paste.maxViews !== null && paste.views >= paste.maxViews;
  if (expiredByTime || expiredByViews) {
    store.delete(id);
    return { expired: true };
  }

  paste.views += 1;
  return { paste, expired: false };
}
