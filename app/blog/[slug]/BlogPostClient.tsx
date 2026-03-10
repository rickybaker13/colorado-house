'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Clock, ArrowUpRight } from 'lucide-react';
import { useMemo } from 'react';

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

/**
 * Sanitize a string to prevent script injection by escaping HTML entities.
 * Applied to all text content before inserting into HTML markup.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Validate and sanitize a URL for use in href/src attributes.
 * Only allows http, https, and relative paths.
 */
function sanitizeUrl(url: string): string {
  const trimmed = url.trim();
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('../')
  ) {
    return trimmed;
  }
  // For bare filenames (images), prefix with /images/
  if (/^[\w\-./]+\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
    return `/images/${trimmed}`;
  }
  return '#';
}

/**
 * Convert markdown content to HTML.
 * Handles: headings (##, ###), bold, italic, images, links, paragraphs, blockquotes, hr.
 * Content is sanitized to prevent XSS - all text is HTML-escaped before insertion.
 */
function markdownToHtml(markdown: string): string {
  const lines = markdown.split('\n');
  const htmlParts: string[] = [];
  let paragraphLines: string[] = [];

  function processInline(text: string): string {
    // First escape the text to prevent XSS
    let safe = escapeHtml(text);

    // Images: ![alt](src) - we escaped these, so match escaped versions
    safe = safe.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_match, alt: string, src: string) => {
        const cleanSrc = sanitizeUrl(src.replace(/&amp;/g, '&'));
        const cleanAlt = alt; // already escaped by escapeHtml
        return `<figure style="margin: 32px 0;"><img src="${cleanSrc}" alt="${cleanAlt}" style="width: 100%; height: auto; display: block;" />${cleanAlt ? `<figcaption style="font-size: 14px; color: rgba(26,26,46,0.4); margin-top: 10px; font-style: italic;">${cleanAlt}</figcaption>` : ''}</figure>`;
      }
    );
    // Links: [text](url)
    safe = safe.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      (_match, linkText: string, href: string) => {
        const cleanHref = sanitizeUrl(href.replace(/&amp;/g, '&'));
        return `<a href="${cleanHref}" style="color: #c4956a; text-decoration: underline; text-decoration-color: rgba(196,149,106,0.3); text-underline-offset: 3px; transition: text-decoration-color 0.3s;" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
      }
    );
    // Bold: **text**
    safe = safe.replace(
      /\*\*([^*]+)\*\*/g,
      '<strong style="font-weight: 500; color: #1a1a2e;">$1</strong>'
    );
    // Italic: *text*
    safe = safe.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    return safe;
  }

  function flushParagraph() {
    if (paragraphLines.length > 0) {
      const content = processInline(paragraphLines.join(' '));
      // Check if content is only a figure (image-only paragraph)
      if (content.trim().startsWith('<figure')) {
        htmlParts.push(content);
      } else {
        htmlParts.push(
          `<p style="font-size: 17px; line-height: 1.8; color: #4a4540; font-weight: 300; margin-bottom: 24px;">${content}</p>`
        );
      }
      paragraphLines = [];
    }
  }

  for (const line of lines) {
    const trimmed = line.trim();

    // Empty line: flush paragraph
    if (trimmed === '') {
      flushParagraph();
      continue;
    }

    // H2: ## heading
    if (trimmed.startsWith('## ')) {
      flushParagraph();
      const headingText = processInline(trimmed.slice(3));
      htmlParts.push(
        `<h2 style="font-family: 'Cormorant Garamond', serif; font-size: clamp(26px, 3.5vw, 36px); font-weight: 300; color: #1a1a2e; margin-top: 48px; margin-bottom: 20px; line-height: 1.2;">${headingText}</h2>`
      );
      continue;
    }

    // H3: ### heading
    if (trimmed.startsWith('### ')) {
      flushParagraph();
      const headingText = processInline(trimmed.slice(4));
      htmlParts.push(
        `<h3 style="font-family: 'Cormorant Garamond', serif; font-size: clamp(22px, 2.8vw, 28px); font-weight: 400; color: #1a1a2e; margin-top: 36px; margin-bottom: 16px; line-height: 1.3;">${headingText}</h3>`
      );
      continue;
    }

    // Horizontal rule: ---
    if (trimmed === '---' || trimmed === '***' || trimmed === '___') {
      flushParagraph();
      htmlParts.push(
        '<hr style="border: none; border-top: 1px solid rgba(196,149,106,0.25); margin: 40px 0;" />'
      );
      continue;
    }

    // Blockquote: > text
    if (trimmed.startsWith('> ')) {
      flushParagraph();
      const quoteText = processInline(trimmed.slice(2));
      htmlParts.push(
        `<blockquote style="border-left: 3px solid #c4956a; padding-left: 20px; margin: 32px 0; font-style: italic; color: rgba(26,26,46,0.6); font-size: 18px; line-height: 1.7;">${quoteText}</blockquote>`
      );
      continue;
    }

    // Strip any remaining image suggestion comments (should be resolved server-side)
    if (/^<!--\s*Image\s*suggestion:/i.test(trimmed)) {
      flushParagraph();
      continue;
    }

    // Otherwise, accumulate for paragraph
    paragraphLines.push(trimmed);
  }

  // Flush any remaining paragraph
  flushParagraph();

  return htmlParts.join('\n');
}

export default function BlogPostClient({ post }: { post: BlogPost }) {
  const readTime = estimateReadTime(post.content);
  const publishedDate = post.published_at
    ? formatDate(post.published_at)
    : formatDate(post.created_at);
  const imageSrc = getImageSrc(post.featured_image);

  // Memoize the HTML conversion since content does not change
  const contentHtml = useMemo(() => markdownToHtml(post.content), [post.content]);

  return (
    <main style={{ backgroundColor: '#fafaf8', minHeight: '100vh' }}>
      {/* ===================== HERO ===================== */}
      <section
        className="relative overflow-hidden"
        style={{ height: '60vh', minHeight: '400px', maxHeight: '700px' }}
      >
        <Image
          src={imageSrc}
          alt={post.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
          quality={90}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(26,26,46,0.35) 0%, rgba(26,26,46,0.2) 40%, rgba(26,26,46,0.7) 100%)',
          }}
        />

        <div
          className="relative z-10 h-full flex flex-col justify-end px-6"
          style={{ paddingBottom: 'clamp(40px, 6vw, 80px)' }}
        >
          <div className="max-w-4xl mx-auto w-full">
            <motion.h1
              className="font-display"
              style={{
                fontSize: 'clamp(36px, 6vw, 72px)',
                fontWeight: 300,
                color: '#ffffff',
                lineHeight: 1.08,
                textShadow: '0 2px 20px rgba(0,0,0,0.3)',
                maxWidth: '800px',
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {post.title}
            </motion.h1>
          </div>
        </div>
      </section>

      {/* ===================== ARTICLE ===================== */}
      <article style={{ padding: 'clamp(40px, 6vw, 80px) 24px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          {/* Back link + meta */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ marginBottom: '48px' }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center font-sans transition-colors duration-300"
              style={{
                fontSize: '14px',
                color: 'rgba(26,26,46,0.4)',
                gap: '6px',
                marginBottom: '24px',
                display: 'inline-flex',
              }}
            >
              <ArrowLeft size={14} />
              Back to all stories
            </Link>

            <div
              className="flex items-center flex-wrap"
              style={{
                gap: '16px',
                paddingBottom: '28px',
                borderBottom: '1px solid rgba(196,149,106,0.2)',
              }}
            >
              <span
                className="font-sans"
                style={{
                  fontSize: '14px',
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
                  fontSize: '14px',
                  color: 'rgba(26,26,46,0.5)',
                  fontWeight: 300,
                  gap: '5px',
                }}
              >
                <Clock size={13} />
                {readTime} min read
              </span>
            </div>
          </motion.div>

          {/* Content — rendered from admin-authored markdown stored in Supabase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="font-sans"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* ===================== CTA ===================== */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }}
            style={{
              marginTop: '64px',
              padding: '48px 32px',
              backgroundColor: '#f5f0eb',
              textAlign: 'center',
            }}
          >
            <p
              className="font-sans"
              style={{
                fontSize: '12px',
                letterSpacing: '0.25em',
                textTransform: 'uppercase' as const,
                color: '#c4956a',
                marginBottom: '12px',
              }}
            >
              Ready to explore?
            </p>
            <h3
              className="font-display"
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 300,
                color: '#1a1a2e',
                marginBottom: '16px',
              }}
            >
              Plan Your San Juan Adventure
            </h3>
            <p
              className="font-sans max-w-md mx-auto"
              style={{
                fontSize: '16px',
                fontWeight: 300,
                lineHeight: 1.6,
                color: 'rgba(26,26,46,0.5)',
                marginBottom: '28px',
              }}
            >
              Stay at our luxury mountain townhouse and experience everything the San Juans
              have to offer.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center font-sans rounded-full transition-all duration-300"
              style={{
                fontSize: '14px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                padding: '14px 36px',
                backgroundColor: '#1a1a2e',
                color: '#fafaf8',
                gap: '8px',
              }}
            >
              Book Your Stay
              <ArrowUpRight size={14} />
            </Link>
          </motion.div>
        </div>
      </article>
    </main>
  );
}
