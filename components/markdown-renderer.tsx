import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

// Simple markdown parser for basic formatting
function parseMarkdown(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Headers
    if (line.startsWith('# ')) {
      elements.push(
        <h1 key={key++} className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
          {line.slice(2)}
        </h1>
      );
    } else if (line.startsWith('## ')) {
      elements.push(
        <h2 key={key++} className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mt-10 mb-4">
          {line.slice(3)}
        </h2>
      );
    } else if (line.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4">
          {line.slice(4)}
        </h3>
      );
    } else if (line.startsWith('#### ')) {
      elements.push(
        <h4 key={key++} className="scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-4">
          {line.slice(5)}
        </h4>
      );
    }
    // Blockquotes
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="mt-6 border-l-4 border-primary pl-6 italic [&>p]:leading-relaxed">
          <p>{line.slice(2)}</p>
        </blockquote>
      );
    }
    // Lists
    else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = [line.slice(2)];
      // Collect consecutive list items
      while (i + 1 < lines.length && (lines[i + 1].startsWith('- ') || lines[i + 1].startsWith('* '))) {
        i++;
        listItems.push(lines[i].slice(2));
      }
      elements.push(
        <ul key={key++} className="my-6 ml-6 list-disc [&>li]:mt-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-7">
              {formatInlineMarkdown(item)}
            </li>
          ))}
        </ul>
      );
    }
    // Numbered lists
    else if (/^\d+\.\s/.test(line)) {
      const listItems: string[] = [line.replace(/^\d+\.\s/, '')];
      // Collect consecutive numbered list items
      while (i + 1 < lines.length && /^\d+\.\s/.test(lines[i + 1])) {
        i++;
        listItems.push(lines[i].replace(/^\d+\.\s/, ''));
      }
      elements.push(
        <ol key={key++} className="my-6 ml-6 list-decimal [&>li]:mt-2">
          {listItems.map((item, idx) => (
            <li key={idx} className="leading-7">
              {formatInlineMarkdown(item)}
            </li>
          ))}
        </ol>
      );
    }
    // Code blocks
    else if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++; // Skip the opening ```
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={key++} className="mb-4 mt-6 overflow-x-auto rounded-lg bg-muted p-4">
          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
            {codeLines.join('\n')}
          </code>
        </pre>
      );
    }
    // Empty lines (paragraph breaks)
    else if (line.trim() === '') {
      // Skip empty lines, they're handled by paragraph spacing
      continue;
    }
    // Regular paragraphs
    else if (line.trim()) {
      // Collect consecutive non-empty lines into paragraphs
      const paragraphLines: string[] = [line];
      while (i + 1 < lines.length && lines[i + 1].trim() && !isSpecialLine(lines[i + 1])) {
        i++;
        paragraphLines.push(lines[i]);
      }
      
      elements.push(
        <p key={key++} className="leading-7 [&:not(:first-child)]:mt-6 mb-6">
          {formatInlineMarkdown(paragraphLines.join(' '))}
        </p>
      );
    }
  }

  return elements;
}

// Check if a line starts with special markdown syntax
function isSpecialLine(line: string): boolean {
  return line.startsWith('#') ||
         line.startsWith('>') ||
         line.startsWith('-') ||
         line.startsWith('*') ||
         line.startsWith('```') ||
         /^\d+\.\s/.test(line);
}

function isSafeHref(href: string): boolean {
  const trimmed = href.trim();
  if (!trimmed) return false;

  if (trimmed.startsWith('/') || trimmed.startsWith('#')) {
    return true;
  }

  try {
    const url = new URL(trimmed);
    return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol);
  } catch {
    return false;
  }
}

// Format inline markdown (bold, italic, code, links) without raw HTML injection
function formatInlineMarkdown(text: string, keyPrefix: string = 'inline'): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  const tokenRegex = /(`[^`]+`)|(\[([^\]]+)\]\(([^)]+)\))|(\*\*([^*]+)\*\*)|(\*([^*]+)\*)/g;

  let lastIndex = 0;
  let nodeIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    if (match[1]) {
      nodes.push(
        <code key={`${keyPrefix}-code-${nodeIndex++}`} className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {match[1].slice(1, -1)}
        </code>
      );
    } else if (match[2]) {
      const linkText = match[3];
      const href = match[4];
      if (isSafeHref(href)) {
        nodes.push(
          <a
            key={`${keyPrefix}-link-${nodeIndex++}`}
            href={href}
            className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
            target={href.startsWith('http') ? '_blank' : undefined}
            rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {formatInlineMarkdown(linkText, `${keyPrefix}-linktext-${nodeIndex}`)}
          </a>
        );
      } else {
        nodes.push(linkText);
      }
    } else if (match[5]) {
      nodes.push(
        <strong key={`${keyPrefix}-bold-${nodeIndex++}`}>
          {formatInlineMarkdown(match[6], `${keyPrefix}-boldtext-${nodeIndex}`)}
        </strong>
      );
    } else if (match[7]) {
      nodes.push(
        <em key={`${keyPrefix}-italic-${nodeIndex++}`}>
          {formatInlineMarkdown(match[8], `${keyPrefix}-italictext-${nodeIndex}`)}
        </em>
      );
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const elements = parseMarkdown(content);
  
  return (
    <div className="prose prose-gray max-w-none prose-minimal leading-relaxed">
      {elements}
    </div>
  );
}
