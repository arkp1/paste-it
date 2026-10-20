import { del, get, put } from "@vercel/blob";

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

const expiryDurations: Record<Exclude<ExpiryOption, "never">, number> = {
  hour: 60 * 60 * 1000,
  day: 24 * 60 * 60 * 1000,
  week: 7 * 24 * 60 * 60 * 1000
};

const pathnameFor = (id: string) => `pastes/${id}.json`;

async function fetchPaste(id: string) {
  const result = await get(pathnameFor(id), { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return null;
  return JSON.parse(await new Response(result.stream).text()) as Paste;
}

export async function createPaste(input: {
  title: string;
  content: string;
  expires: ExpiryOption;
  maxViews: number | null;
}) {
  const now = Date.now();
  // 128 bits of entropy makes a share URL effectively unguessable.
  const id = crypto.randomUUID().replace(/-/g, "");
  const paste: Paste = {
    id,
    title: input.title || "Untitled paste",
    content: input.content,
    createdAt: now,
    expiresAt: input.expires === "never" ? null : now + expiryDurations[input.expires],
    maxViews: input.maxViews,
    views: 0
  };
  await put(pathnameFor(id), JSON.stringify(paste), {
    access: "private",
    addRandomSuffix: false,
    contentType: "application/json"
  });
  return paste;
}

export async function readPaste(id: string): Promise<{ paste?: Paste; expired: boolean }> {
  const paste = await fetchPaste(id);
  if (!paste) return { expired: false };

  const expiredByTime = paste.expiresAt !== null && Date.now() >= paste.expiresAt;
  const expiredByViews = paste.maxViews !== null && paste.views >= paste.maxViews;
  if (expiredByTime || expiredByViews) {
    await del(pathnameFor(id));
    return { expired: true };
  }

  paste.views += 1;
  await put(pathnameFor(id), JSON.stringify(paste), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json"
  });
  return { paste, expired: false };
}
