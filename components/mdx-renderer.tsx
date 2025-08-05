'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

import { useMDXComponents } from './mdx-components';

interface MDXRendererProps {
  source: MDXRemoteSerializeResult;
}

export function MDXRenderer({ source }: MDXRendererProps) {
  const components = useMDXComponents({});
  
  return <MDXRemote {...source} components={components} />;
}