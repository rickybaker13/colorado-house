'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowUpRight } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  seo_keywords: string | null;
}

function estimateReadTime(content: string): number {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function getImageSrc(featuredImage: string | null): string {
  if (!featuredImage) return '/images/sunflowers-mountain-valley.jpg';
  if (featuredImage.startsWith('http')) return featuredImage;
  return `/images/${featuredImage}`;
}

export default function BlogListClient({ posts }: { posts: BlogPost[] }) {
  return (
    <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }}>
      {/* ===================== HERO ===================== */}
      <section
        className="relative overflow-hidden"
        style={{
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a2e',
        }}
      >
        {/* Subtle grain overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse at 30% 50%, rgba(196,149,106,0.08) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(196,149,106,0.05) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10 text-center px-6" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
          <motion.p
            className="font-sans"
            style={{
              fontSize: '13px',
              letterSpacing: '0.3em',
              textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.4)',
              marginBottom: '24px',
            }}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Journal
          </motion.p>
          <motion.h1
            className="font-display max-w-4xl mx-auto"
            style={{
              fontSize: 'clamp(40px, 7vw, 80px)',
              fontWeight: 300,
              color: '#ffffff',
              lineHeight: 1.05,
              marginBottom: '24px',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Stories from the San Juans
          </motion.h1>
          <motion.p
            className="font-sans max-w-xl mx-auto"
            style={{
              fontSize: 'clamp(16px, 2vw, 19px)',
              color: 'rgba(255,255,255,0.45)',
              lineHeight: 1.6,
              fontWeight: 300,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Exploring the mountains, history, and culture of southwestern Colorado
          </motion.p>
        </div>
      </section>

      {/* ===================== POST GRID ===================== */}
      <section style={{ padding: 'clamp(60px, 8vw, 100px) 24px' }}>
        <div className="max-w-5xl mx-auto">
          {posts.length === 0 ? (
            /* Empty state */
            <motion.div
              {...fadeInUp}
              className="text-center"
              style={{ padding: '80px 24px' }}
            >
              <p
                className="font-display"
                style={{
                  fontSize: 'clamp(28px, 4vw, 44px)',
                  fontWeight: 300,
                  color: '#1a1a2e',
                  marginBottom: '16px',
                }}
              >
                New stories coming soon
              </p>
              <p
                className="font-sans"
                style={{
                  fontSize: '17px',
                  color: 'rgba(26,26,46,0.5)',
                  fontWeight: 300,
                  lineHeight: 1.6,
                  maxWidth: '480px',
                  margin: '0 auto',
                }}
              >
                We are working on tales of alpine adventure, local history, and mountain
                culture. Check back soon.
              </p>
            </motion.div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2"
              style={{ gap: 'clamp(32px, 4vw, 48px)' }}
            >
              {posts.map((post, idx) => {
                const readTime = estimateReadTime(post.content);
                const publishedDate = post.published_at
                  ? formatDate(post.published_at)
                  : formatDate(post.created_at);
                const imageSrc = getImageSrc(post.featured_image);

                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{
                      duration: 0.7,
                      delay: idx % 2 === 0 ? 0 : 0.1,
                      ease: [0.16, 1, 0.3, 1] as const,
                    }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block"
                      style={{ textDecoration: 'none' }}
                    >
                      {/* Image */}
                      <div
                        className="relative overflow-hidden"
                        style={{
                          aspectRatio: '16 / 10',
                          marginBottom: '20px',
                          backgroundColor: '#f0ece6',
                        }}
                      >
                        <Image
                          src={imageSrc}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 50vw"
                          quality={85}
                        />
                      </div>

                      {/* Meta */}
                      <div
                        className="flex items-center"
                        style={{ gap: '16px', marginBottom: '12px' }}
                      >
                        <span
                          className="font-sans"
                          style={{
                            fontSize: '13px',
                            color: 'rgba(26,26,46,0.5)',
                            fontWeight: 300,
                          }}
                        >
                          {publishedDate}
                        </span>
                        <span
                          style={{
                            width: '3px',
                            height: '3px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(26,26,46,0.2)',
                          }}
                        />
                        <span
                          className="font-sans flex items-center"
                          style={{
                            fontSize: '13px',
                            color: 'rgba(26,26,46,0.5)',
                            fontWeight: 300,
                            gap: '5px',
                          }}
                        >
                          <Clock size={12} />
                          {readTime} min read
                        </span>
                      </div>

                      {/* Title */}
                      <h2
                        className="font-display"
                        style={{
                          fontSize: 'clamp(24px, 3vw, 32px)',
                          fontWeight: 300,
                          color: '#1a1a2e',
                          lineHeight: 1.2,
                          marginBottom: '10px',
                        }}
                      >
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p
                        className="font-sans"
                        style={{
                          fontSize: '16px',
                          fontWeight: 300,
                          lineHeight: 1.6,
                          color: 'rgba(26,26,46,0.5)',
                          marginBottom: '16px',
                        }}
                      >
                        {post.excerpt}
                      </p>

                      {/* Read more */}
                      <span
                        className="font-sans inline-flex items-center transition-all duration-300 group-hover:gap-3"
                        style={{
                          fontSize: '14px',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase' as const,
                          color: '#c4956a',
                          gap: '6px',
                        }}
                      >
                        Read Story
                        <ArrowUpRight size={14} />
                      </span>
                    </Link>
                  </motion.article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ===================== BOTTOM CTA ===================== */}
      <section
        style={{
          backgroundColor: '#f5f0eb',
          padding: 'clamp(60px, 8vw, 100px) 24px',
          textAlign: 'center',
        }}
      >
        <motion.div {...fadeInUp}>
          <p
            className="font-sans"
            style={{
              fontSize: '12px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase' as const,
              color: '#c4956a',
              marginBottom: '16px',
            }}
          >
            Your Mountain Retreat
          </p>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 300,
              color: '#1a1a2e',
              marginBottom: '20px',
            }}
          >
            Write your own chapter
          </h2>
          <p
            className="font-sans max-w-xl mx-auto"
            style={{
              fontSize: '17px',
              fontWeight: 300,
              lineHeight: 1.6,
              color: 'rgba(26,26,46,0.5)',
              marginBottom: '36px',
            }}
          >
            Experience the San Juan Mountains from our luxury townhouse at the base of
            Purgatory Resort.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center font-sans rounded-full transition-all duration-300"
            style={{
              fontSize: '14px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              padding: '16px 40px',
              backgroundColor: '#1a1a2e',
              color: '#fafaf8',
              gap: '8px',
            }}
          >
            Book Your Stay
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
