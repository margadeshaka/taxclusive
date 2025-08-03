"use client";

interface SimpleMarkdownRendererProps {
  content: string;
}

export function SimpleMarkdownRenderer({ content }: SimpleMarkdownRendererProps) {
  // For now, just render the content as-is
  // In production, you'd want to use a proper markdown parser
  return (
    <div 
      className="prose prose-gray max-w-none prose-minimal leading-relaxed"
      dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}
    />
  );
}