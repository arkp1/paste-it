"use client";

import { FormEvent, useState } from "react";

type Result = { id: string; title: string } | null;

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [expires, setExpires] = useState("never");
  const [maxViews, setMaxViews] = useState("");
  const [result, setResult] = useState<Result>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!content.trim()) return setError("Add something to your paste first.");
    const response = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, expires, maxViews: maxViews ? Number(maxViews) : null })
    });
    const data = await response.json();
    if (!response.ok) return setError(data.error || "Couldn’t create your paste.");
    setResult(data);
  }

  const shareUrl = result && typeof window !== "undefined" ? `${window.location.origin}/p/${result.id}` : "";

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="page-shell">
      <nav className="nav"><a className="brand" href="/">paste<span>it</span></a><span className="nav-note">fast, private text sharing</span></nav>
      <section className="hero">
        <p className="eyebrow">SHARE WORDS, NOT ACCOUNTS</p>
        <h1>Paste it.<br /><em>Pass it on.</em></h1>
        <p className="intro">Turn any text into a clean, shareable link. No sign-up, no clutter — just paste and go.</p>
      </section>
      <section className="composer" aria-label="Create a paste">
        <form onSubmit={submit}>
          <label className="field-label" htmlFor="title">TITLE <span>OPTIONAL</span></label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Notes from the standup" maxLength={100} />
          <div className="editor-head"><label className="field-label" htmlFor="content">YOUR PASTE</label><span>{content.length.toLocaleString()} characters</span></div>
          <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Drop your text here..." maxLength={100000} />
          <div className="settings">
            <label>EXPIRES
              <select value={expires} onChange={(e) => setExpires(e.target.value)}><option value="never">Never</option><option value="hour">In 1 hour</option><option value="day">In 24 hours</option><option value="week">In 7 days</option></select>
            </label>
            <label>MAXIMUM VIEWS
              <input className="view-input" value={maxViews} onChange={(e) => setMaxViews(e.target.value.replace(/\D/g, ""))} inputMode="numeric" placeholder="Unlimited" />
            </label>
          </div>
          {error && <p className="error">{error}</p>}
          <button className="create" type="submit">Create share link <span>→</span></button>
        </form>
        <p className="privacy-note">Your paste is only available to people with the link.</p>
      </section>
      {result && <section className="result" aria-live="polite"><div><p className="eyebrow">YOUR LINK IS READY</p><h2>{result.title}</h2><code>{shareUrl}</code></div><button onClick={copyLink}>{copied ? "Copied!" : "Copy link"}</button><a href={`/p/${result.id}`}>Open paste ↗</a></section>}
      <footer><span>Made for the quick thought.</span><span>Links are unlisted &amp; private by default.</span></footer>
    </main>
  );
}
