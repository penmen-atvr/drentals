import { getBlogPostBySlug } from "@/lib/data"
import { notFound } from "next/navigation"
import Breadcrumb from "@/components/breadcrumb"
import PageHeader from "@/components/page-header"
import Link from "next/link"
import Script from "next/script"

interface BlogPostPageProps {
  params: {
    slug: string
  }
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

          <div className="py-12">
            <div className="prose prose-invert max-w-none text-zinc-300 font-body leading-relaxed">
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
