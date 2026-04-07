"use client";

interface SvgRendererProps {
  content: string;
}

export function SvgRenderer({ content }: SvgRendererProps) {
  return (
    <div
      className="w-full overflow-x-auto rounded-lg border bg-card p-4"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
