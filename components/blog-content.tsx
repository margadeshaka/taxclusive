"use client";

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { useMDXComponents } from './mdx-components';

interface BlogContentProps {
  source: MDXRemoteSerializeResult;
}

export function BlogContent({ source }: BlogContentProps) {
  const components = useMDXComponents({});
  
  return (
    <div className="prose prose-gray max-w-none prose-minimal leading-relaxed">
      <MDXRemote {...source} components={components} />
    </div>
  );
}