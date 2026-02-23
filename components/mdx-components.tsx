import type {
  AnchorHTMLAttributes,
  ComponentType,
  HTMLAttributes,
  ImgHTMLAttributes,
} from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

export type MDXComponents = Record<string, ComponentType<any>>;

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h1
        className={cn(
          "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6",
          className
        )}
        {...props}
      />
    ),
    h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h2
        className={cn(
          "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 mt-10 mb-4",
          className
        )}
        {...props}
      />
    ),
    h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h3
        className={cn("scroll-m-20 text-2xl font-semibold tracking-tight mt-8 mb-4", className)}
        {...props}
      />
    ),
    h4: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h4
        className={cn("scroll-m-20 text-xl font-semibold tracking-tight mt-6 mb-4", className)}
        {...props}
      />
    ),
    h5: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h5
        className={cn("scroll-m-20 text-lg font-semibold tracking-tight mt-6 mb-4", className)}
        {...props}
      />
    ),
    h6: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
      <h6
        className={cn("scroll-m-20 text-base font-semibold tracking-tight mt-6 mb-4", className)}
        {...props}
      />
    ),
    a: ({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
      <a
        className={cn(
          "font-medium text-primary underline underline-offset-4 hover:text-primary/80",
          className
        )}
        {...props}
      />
    ),
    p: ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
      <p className={cn("leading-7 [&:not(:first-child)]:mt-6 mb-6", className)} {...props} />
    ),
    ul: ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
      <ul className={cn("my-6 ml-6 list-disc [&>li]:mt-2", className)} {...props} />
    ),
    ol: ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => (
      <ol className={cn("my-6 ml-6 list-decimal [&>li]:mt-2", className)} {...props} />
    ),
    li: ({ className, ...props }: HTMLAttributes<HTMLLIElement>) => (
      <li className={cn("leading-7", className)} {...props} />
    ),
    blockquote: ({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
      <blockquote
        className={cn(
          "mt-6 border-l-4 border-primary pl-6 italic [&>p]:leading-relaxed",
          className
        )}
        {...props}
      />
    ),
    img: ({ className, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img className={cn("rounded-md border my-6", className)} alt={alt} {...props} />
    ),
    hr: (props: HTMLAttributes<HTMLHRElement>) => <hr className="my-8 border-muted" {...props} />,
    table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
      <div className="my-6 w-full overflow-y-auto">
        <table className={cn("w-full border-collapse", className)} {...props} />
      </div>
    ),
    tr: ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
      <tr className={cn("m-0 border-t p-0 even:bg-muted/50", className)} {...props} />
    ),
    th: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
      <th
        className={cn(
          "border px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    td: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
      <td
        className={cn(
          "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
          className
        )}
        {...props}
      />
    ),
    pre: ({ className, ...props }: HTMLAttributes<HTMLPreElement>) => (
      <pre className={cn("mb-4 mt-6 overflow-x-auto rounded-lg bg-muted p-4", className)} {...props} />
    ),
    code: ({ className, ...props }: HTMLAttributes<HTMLElement>) => (
      <code
        className={cn(
          "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
          className
        )}
        {...props}
      />
    ),
    Image,
    ...components,
  };
}
