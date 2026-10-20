import Link from "next/link";
import { readPaste } from "@/lib/pastes";

export const dynamic = "force-dynamic";

export default async function PastePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { paste, expired } = readPaste(id);
  if (!paste) return <main className="paste-page"><Link className="brand" href="/">paste<span>it</span></Link><div className="missing"><p className="eyebrow">{expired ? "PASTE EXPIRED" : "NOT FOUND"}</p><h1>{expired ? "This paste has gone." : "Nothing here."}</h1><p>The link may be incorrect, or this paste has reached its expiry limit.</p><Link className="create inline" href="/">Create a new paste →</Link></div></main>;
  const remaining = paste.maxViews === null ? null : paste.maxViews - paste.views;
  return <main className="paste-page"><nav className="nav"><Link className="brand" href="/">paste<span>it</span></Link><Link className="new-link" href="/">+ New paste</Link></nav><article className="paste-card"><div className="paste-meta"><span>{new Date(paste.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</span><span>{paste.views} view{paste.views === 1 ? "" : "s"}{remaining !== null ? ` · ${remaining} remaining` : ""}</span></div><h1>{paste.title}</h1><pre>{paste.content}</pre></article></main>;
}
