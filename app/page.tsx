import Image from "next/image";
import Link from "next/link";
import { client } from "../sanity/lib/client";

type PostCard = {
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: { asset?: { url?: string } };
  category?: { title?: string; slug?: { current?: string } };
  _createdAt?: string;
};

async function getLatestPosts(): Promise<PostCard[]> {
  const query = `*[_type == "post"] | order(_createdAt desc)[0...6]{
    title,
    slug,
    excerpt,
    mainImage{ asset->{ url } },
    // derive single category from categories array for display
    "category": categories[0]->{ title, slug },
    _createdAt
  }`;
  return client.fetch(query);
}

export default async function Home() {
  const posts = await getLatestPosts();

  const categories = [
    { name: "Time & Effort", slug: "time-and-effort", url: "https://images.pexels.com/photos/8448322/pexels-photo-8448322.jpeg" },
    { name: "Health & Lifestyle", slug: "health-and-lifestyle", url: "https://images.pexels.com/photos/2092507/pexels-photo-2092507.jpeg" },
    { name: "Occasion", slug: "occasion", url: "https://images.pexels.com/photos/33593121/pexels-photo-33593121.jpeg" },
    { name: "Cuisine", slug: "cuisine", url: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg" },
    { name: "Season", slug: "season", url: "https://images.pexels.com/photos/2273823/pexels-photo-2273823.jpeg" },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[60vh] flex items-center justify-center">
        <Image src="https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg" alt="Hero" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold">Welcome to DinnerRecipes</h1>
          <p className="mt-3 md:mt-4 text-lg md:text-xl font-semibold">Tasty ideas for every night of the week.</p>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">Latest Posts</h2>
          <Link href="/blog" className="text-base text-rose-600 hover:underline font-semibold">View all</Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts?.map((post) => (
            <div key={post.slug.current} className="rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 bg-white">
              {post.mainImage?.asset?.url && (
                <Image src={post.mainImage.asset.url} alt={post.title} width={800} height={600} className="h-48 w-full object-cover" />
              )}
              <div className="p-4">
                {post.category?.title && (
                  <span className="inline-block text-xs text-gray-600 mb-2">{post.category.title}</span>
                )}
                <h3 className="text-xl font-bold line-clamp-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="mt-2 text-base text-gray-700 line-clamp-3">{post.excerpt}</p>
                )}
                <Link href={`/blog/${post.slug.current}`} className="mt-4 inline-block text-base text-rose-600 hover:underline font-semibold">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-3xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((c) => (
            <Link href={`/category/${c.slug}`} key={c.slug} className="flex flex-col items-center group">
              <div className="h-28 w-28 md:h-32 md:w-32 rounded-full overflow-hidden shadow-md transition-transform group-hover:scale-105">
                <Image src={c.url} alt={c.name} width={256} height={256} className="h-full w-full object-cover" />
              </div>
              <span className="mt-3 text-base md:text-lg font-bold">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
