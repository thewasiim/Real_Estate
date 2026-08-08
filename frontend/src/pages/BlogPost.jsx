import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Loader2, AlertCircle, User } from 'lucide-react';
import { blogApi } from '../api/blogApi';

function estimateReadTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await blogApi.getById(slug);
        if (res.data?.success) {
          setPost(res.data.data);
          // Also fetch 3 related posts
          const relRes = await blogApi.getAll({ limit: 4 });
          if (relRes.data?.success) {
            const all = relRes.data.data.items || [];
            setRelated(all.filter((p) => p.id !== res.data.data.id).slice(0, 3));
          }
        } else {
          setError('Article not found.');
        }
      } catch (err) {
        console.error(err);
        setError('Could not load this article. It may have been moved or deleted.');
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <main style={{ paddingTop: '120px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
      </main>
    );
  }

  if (error || !post) {
    return (
      <main style={{ paddingTop: '120px', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '0 24px' }}>
          <AlertCircle size={36} style={{ color: 'var(--muted)', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>Article Not Found</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '24px' }}>{error}</p>
          <Link to="/blog" className="btn btn-dark" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <ArrowLeft size={15} /> Back to Journal
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Back link */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 var(--gutter) 28px' }}>
        <Link
          to="/blog"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--muted)', fontSize: '11px', fontWeight: 700, letterSpacing: '.05em', textDecoration: 'none' }}
        >
          <ArrowLeft size={13} /> BACK TO JOURNAL
        </Link>
      </div>

      {/* Article Header */}
      <header style={{ maxWidth: '760px', margin: '0 auto', padding: '0 var(--gutter) 40px' }}>
        <p className="eyebrow" style={{ marginBottom: '12px', color: 'var(--color-accent)' }}>THE JOURNAL</p>
        <h1 style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          lineHeight: 1.15,
          letterSpacing: '-0.03em',
          marginBottom: '20px',
        }}>
          {post.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--muted)', lineHeight: 1.7, marginBottom: '28px' }}>
          {post.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', paddingBottom: '28px', borderBottom: '1px solid var(--line)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', background: 'var(--ink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0,
            }}>
              <User size={16} />
            </div>
            <div>
              <p style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink)' }}>{post.author}</p>
              <p style={{ fontSize: '10px', color: 'var(--muted)' }}>F.B. Developer Editorial</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Calendar size={12} />
              {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={12} /> {estimateReadTime(post.content)} min read
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div style={{ maxWidth: '960px', margin: '0 auto 48px', padding: '0 var(--gutter)' }}>
        <div style={{ borderRadius: '12px', overflow: 'hidden', maxHeight: '520px' }}>
          <img
            src={post.coverUrl}
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>
      </div>

      {/* Article Body */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '0 var(--gutter) 64px' }}>
        <div style={{
          fontSize: '15px',
          lineHeight: 1.85,
          color: 'var(--ink)',
          whiteSpace: 'pre-wrap',
          fontFamily: '"Georgia", "Times New Roman", serif',
        }}>
          {post.content}
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section style={{ background: 'var(--surface)', padding: '60px 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--gutter)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '36px' }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: '6px' }}>CONTINUE READING</p>
                <h2 style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif',
                  fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                }}>
                  More from The Journal
                </h2>
              </div>
              <Link to="/blog" style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textDecoration: 'none', letterSpacing: '.04em' }}>
                ALL ARTICLES →
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug || rel.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article style={{ border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden', background: '#fff', transition: 'transform 0.2s, box-shadow 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ height: '180px', overflow: 'hidden', background: '#f4f0ec' }}>
                      <img src={rel.coverUrl} alt={rel.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div style={{ padding: '20px' }}>
                      <p style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.04em', marginBottom: '8px' }}>
                        {new Date(rel.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--ink)', lineHeight: 1.35 }}>{rel.title}</h3>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
