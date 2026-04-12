import Link from "next/link"
import { getBlogPosts } from "@/lib/data"
import { Card, CardContent } from "@/components/ui/card"
import { unstable_noStore } from "next/cache"
import Breadcrumb from "@/components/breadcrumb"
import { generateMetadata } from "@/lib/seo-config"
import type { Metadata } from "next"
import SafeImage from "@/components/safe-image"
import PageHeader from "@/components/page-header"


export const metadata: Metadata = generateMetadata({
  title: "Blog & Resources | Camera Rental Tips",
  description:
    "Explore our blog for expert tips on camera equipment, filmmaking techniques, and industry insights for your next production in Hyderabad.",
  keywords: [
    "camera rental blog",
    "filmmaking tips",
    "camera gear guide",
    "production insights",
    "hyderabad film industry",
  ],
  path: "/blog",
  ogTitle: "D'RENTALS Blog | Camera Equipment & Filmmaking Resources",
  ogDescription:
    "Stay updated with the latest in camera technology and filmmaking best practices from D'RENTALS by Penmen Studios.",
})

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function BlogPage() {
  unstable_noStore()
  const posts = await getBlogPosts()

  return (
    <>
      <div className="bg-zinc-950 min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Blog" }]} />

          <PageHeader
            label="OUR INSIGHTS"
            title={<>D&apos;RENTALS <span className="text-red-500">BLOG</span></>}
            description="Stay updated with expert tips, guides, and industry insights on camera equipment and filmmaking."
          />


          <div className="py-16">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-zinc-400">No blog posts found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="block transition-transform hover:-translate-y-1 duration-300"
                  >
                    <Card className="h-full overflow-hidden bg-zinc-900 border-zinc-800 rounded-none hover:border-red-500 transition-colors">
                      <div className="aspect-[16/9] relative overflow-hidden bg-zinc-800">
                        <SafeImage src={post.imageUrl} alt={post.altText} fill className="object-cover" />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-zinc-500 font-mono mb-2">
                          {new Date(post.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <h2 className="font-heading text-lg mb-2 line-clamp-2 text-white">{post.title}</h2>
                        <p className="text-sm text-zinc-400 line-clamp-3 font-body">{post.excerpt}</p>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

