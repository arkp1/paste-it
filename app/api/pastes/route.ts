import { NextResponse } from "next/server";
import { createPaste, type ExpiryOption } from "@/lib/pastes";

const expiryOptions = new Set<ExpiryOption>(["never", "hour", "day", "week"]);

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body.content !== "string" || !body.content.trim()) {
    return NextResponse.json({ error: "Paste content is required." }, { status: 400 });
  }
  if (body.content.length > 100000) return NextResponse.json({ error: "Pastes are limited to 100,000 characters." }, { status: 400 });
  const maxViews = body.maxViews === null ? null : Number(body.maxViews);
  if (maxViews !== null && (!Number.isInteger(maxViews) || maxViews < 1 || maxViews > 1000000)) {
    return NextResponse.json({ error: "Maximum views must be a whole number." }, { status: 400 });
  }
  const paste = createPaste({
    title: typeof body.title === "string" ? body.title.slice(0, 100) : "",
    content: body.content,
    expires: expiryOptions.has(body.expires) ? body.expires : "never",
    maxViews
  });
  return NextResponse.json({ id: paste.id, title: paste.title });
}
