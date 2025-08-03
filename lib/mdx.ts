import { serialize } from 'next-mdx-remote/serialize';

export async function serializeMDX(content: string) {
  const mdxSource = await serialize(content, {
    parseFrontmatter: true,
  });
  
  return mdxSource;
}