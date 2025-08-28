import Image from "next/image";
import Link from "next/link";
import { client } from "../../sanity/lib/client";

type PostCard = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset?: { url?: string } };
};

async function getPosts(limit = 12, offset = 0): Promise<PostCard[]> {
  const query = `*[_type == "post"] | order(_createdAt desc)[${offset}...${offset + limit}]{
    title,
    slug,
    excerpt,
    mainImage{ asset->{ url } },
  }`;
  return client.fetch(query);
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold mb-8">Blog</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <div key={post.slug.current} className="rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 bg-white">
            {post.mainImage?.asset?.url && (
              <Image src={post.mainImage.asset.url} alt={post.title} width={800} height={600} className="h-48 w-full object-cover" />
            )}
            <div className="p-4">
              <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
              {post.excerpt && (
                <p className="mt-2 text-base text-gray-700 line-clamp-3">{post.excerpt}</p>
              )}
              <Link href={`/blog/${post.slug.current}`} className="mt-4 inline-block text-base text-rose-600 hover:underline font-semibold">Read More</Link>
            </div>
          </div>
        ))}
      </div>
      {/* For brevity, load-more/pagination can be added with searchParams to adjust offset */}
    </div>
  );
}


