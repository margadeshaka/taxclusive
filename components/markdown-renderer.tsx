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

// Format inline markdown (bold, italic, code, links)
function formatInlineMarkdown(text: string): React.ReactNode {
  const result: React.ReactNode[] = [];
  let key = 0;
  
  // Split by inline code first to avoid processing markdown inside code
  const codeParts = text.split(/(`[^`]+`)/);
  
  codeParts.forEach((part, _index) => {
    if (part.startsWith('`') && part.endsWith('`')) {
      // Inline code
      result.push(
        <code key={key++} className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {part.slice(1, -1)}
        </code>
      );
    } else {
      // Process other inline formatting
      let currentText = part;
      
      // Bold (**text**)
      currentText = currentText.replace(/\*\*(.*?)\*\*/g, (match, content) => {
        return `<strong>${content}</strong>`;
      });
      
      // Italic (*text*)
      currentText = currentText.replace(/\*(.*?)\*/g, (match, content) => {
        return `<em>${content}</em>`;
      });
      
      // Links [text](url)
      currentText = currentText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        return `<a href="${url}" class="font-medium text-primary underline underline-offset-4 hover:text-primary/80">${text}</a>`;
      });
      
      if (currentText) {
        result.push(
          <span key={key++} dangerouslySetInnerHTML={{ __html: currentText }} />
        );
      }
    }
  });
  
  return result;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const elements = parseMarkdown(content);
  
  return (
    <div className="prose prose-gray max-w-none prose-minimal leading-relaxed">
      {elements}
    </div>
  );
}