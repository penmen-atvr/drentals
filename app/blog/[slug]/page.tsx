import { getBlogPostBySlug } from "@/lib/data"
import { notFound } from "next/navigation"
import Breadcrumb from "@/components/breadcrumb"
import PageHeader from "@/components/page-header"
import Link from "next/link"
import Script from "next/script"
import { generateMetadata as generateSeoMetadata } from "@/lib/seo-config"
import type { Metadata } from "next"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return generateSeoMetadata({
    title: `${post.title} | D'RENTALS Blog`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    ogTitle: post.title,
    ogDescription: post.excerpt,
    // Add an image if we have one defined in the post data structure, assuming post.imageUrl exists based on blog index page
    ...(post.imageUrl ? { ogImage: post.imageUrl } : {}),
  })
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <>
      {/* Google Tag (gtag.js) */}
      {/* Google Tag (gtag.js) */}
      <Script strategy="afterInteractive" src="https://www.googletagmanager.com/gtag/js?id=G-P623CW7HNM" />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-P623CW7HNM');
          `,
        }}
      />
      <div className="bg-zinc-950 min-h-screen">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />

          <PageHeader
            label={post.category.toUpperCase()}
            title={post.title}
            description={post.excerpt}
          />
          <p className="text-sm text-zinc-500 font-mono px-4 container mx-auto pt-4">
            By {post.author} on{" "}
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="py-8 max-w-4xl mx-auto px-4">
            <div className="
              text-zinc-300 font-body leading-relaxed
              [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-heading [&_h1]:text-white [&_h1]:mb-6 [&_h1]:mt-10 [&_h1]:uppercase [&_h1]:tracking-wide
              [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:font-heading [&_h2]:text-white [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:uppercase [&_h2]:tracking-wide
              [&_h3]:text-xl [&_h3]:md:text-2xl [&_h3]:font-heading [&_h3]:text-white [&_h3]:mb-4 [&_h3]:mt-8
              [&_p]:text-base [&_p]:md:text-lg [&_p]:mb-6 [&_p]:text-zinc-300 [&_p]:leading-loose
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2 [&_ul]:text-zinc-300
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2 [&_ol]:text-zinc-300
              [&_li]:text-base [&_li]:md:text-lg [&_li]:leading-relaxed
              [&_a]:text-red-500 [&_a]:hover:text-red-400 [&_a]:underline [&_a]:underline-offset-4 [&_a]:transition-colors
              [&_strong]:text-white [&_strong]:font-semibold
              [&_blockquote]:border-l-4 [&_blockquote]:border-red-500 [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:my-8 [&_blockquote]:text-zinc-400 [&_blockquote]:text-lg
              [&_img]:rounded-none [&_img]:my-8 [&_img]:border [&_img]:border-zinc-800
              [&_hr]:border-zinc-800 [&_hr]:my-10
            ">
              {/* Render HTML content directly. Be cautious with untrusted HTML. */}
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>

            <div className="mt-12 text-center">
              <Link
                href="/blog"
                className="inline-block bg-red-500 hover:bg-red-600 text-white px-8 py-3 font-heading transition-colors rounded-none"
              >
                BACK TO BLOG
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
