import Image from "next/image";
import Link from "next/link";
import { client } from "../../../sanity/lib/client";

type PostCard = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset?: { url?: string } };
};

async function getCategoryPosts(slug: string): Promise<PostCard[]> {
  const query = `*[_type == "post" && category->slug.current == $slug]{
    title,
    slug,
    excerpt,
    mainImage{ asset->{ url } },
  }`;
  return client.fetch(query, { slug });
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const posts = await getCategoryPosts(params.slug);
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-8 capitalize">{params.slug.replace(/-/g, " ")}</h1>
      {posts.length === 0 ? (
        <p>No posts found in this category.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div key={post.slug.current} className="rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 bg-white">
              {post.mainImage?.asset?.url && (
                <Image src={post.mainImage.asset.url} alt={post.title} width={800} height={600} className="h-48 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-lg font-semibold line-clamp-2">{post.title}</h3>
                <Link href={`/blog/${post.slug.current}`} className="mt-4 inline-block text-sm text-blue-600 hover:underline">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


