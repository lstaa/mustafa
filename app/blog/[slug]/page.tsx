import Image from "next/image";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { client } from "../../../sanity/lib/client";

type Post = {
  title: string;
  slug: { current: string };
  body: any;
  mainImage?: { asset?: { url?: string } };
  category?: { title?: string; slug?: { current?: string } };
  author?: { name?: string; image?: { asset?: { url?: string } } };
  _createdAt?: string;
};

async function getPost(slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    title,
    slug,
    body,
    mainImage{ asset->{ url } },
    "category": categories[0]->{ title, slug },
    author->{ name, image },
    _createdAt
  }`;
  return client.fetch(query, { slug });
}

async function getRelatedPosts(categorySlug?: string, excludeSlug?: string) {
  if (!categorySlug) return [] as any[];
  const query = `*[_type == "post" && category->slug.current == $categorySlug && slug.current != $excludeSlug][0...3]{
    title, slug, mainImage{ asset->{ url } }
  }`;
  return client.fetch(query, { categorySlug, excludeSlug });
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return <div className="mx-auto max-w-3xl px-4 py-12">Post not found.</div>;
  const related = await getRelatedPosts(post.category?.slug?.current, post.slug.current);

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-6">
        <div className="text-sm text-gray-600 flex items-center gap-2">
          {post.category?.slug?.current && (
            <Link href={`/category/${post.category.slug.current}`} className="hover:underline">
              {post.category.title}
            </Link>
          )}
          {post._createdAt && <span>• {new Date(post._createdAt).toLocaleDateString()}</span>}
        </div>
        <h1 className="mt-2 text-4xl md:text-5xl font-extrabold">{post.title}</h1>
      </header>
      {post.mainImage?.asset?.url && (
        <div className="mb-6 overflow-hidden rounded-2xl shadow-md">
          <Image src={post.mainImage.asset.url} alt={post.title} width={1200} height={800} className="w-full h-auto object-cover" />
        </div>
      )}
      <div className="prose prose-lg max-w-none">
        <PortableText value={post.body} />
      </div>

      {related?.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((p: any) => (
              <Link key={p.slug.current} href={`/blog/${p.slug.current}`} className="rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 bg-white">
                {p.mainImage?.asset?.url && (
                  <Image src={p.mainImage.asset.url} alt={p.title} width={800} height={600} className="h-44 w-full object-cover" />
                )}
                <div className="p-4">
                  <h3 className="text-lg font-semibold line-clamp-2">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}


