"use client";

import { useState } from "react";

type ShareActionsProps = {
  slug: string;
  name: string;
};

export function ShareActions({ slug, name }: ShareActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = `${window.location.origin}/departments/${slug}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="grid gap-3">
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full bg-white px-4 py-3 font-medium text-slate-950 transition hover:bg-amber-100"
      >
        {copied ? "リンクをコピーしました" : `${name} のURLをコピー`}
      </button>
      <p className="text-sm leading-6 text-slate-400">
        LINE やメールに貼り付けて、そのまま案内用リンクとして使えます。
      </p>
    </div>
  );
}
