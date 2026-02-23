"use client";

interface SimpleMarkdownRendererProps {
  content: string;
}

export function SimpleMarkdownRenderer({ content }: SimpleMarkdownRendererProps) {
  const lines = content.split("\n");

  return (
    <div className="prose prose-gray max-w-none prose-minimal leading-relaxed">
      {lines.map((line, index) => (
        <span key={`line-${index}`}>
          {line}
          {index < lines.length - 1 ? <br /> : null}
        </span>
      ))}
    </div>
  );
}
