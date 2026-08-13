import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, Loader2, BookOpen, AlertCircle } from 'lucide-react';
import { blogApi } from '../api/blogApi';

function estimateReadTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export default function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPosts();
  }, [page]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await blogApi.getAll({ page, limit: 9 });
      if (res.data?.success) {
        setPosts(res.data.data.items || []);
        setTotalPages(res.data.data.totalPages || 1);
        setTotal(res.data.data.total || 0);
      }
    } catch (err) {
      console.error('Failed to load blog posts:', err);
      setError('Failed to load journal articles. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="blog-page" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      {/* Header */}
      <div className="blog-page__header" style={{ textAlign: 'center', padding: '0 var(--gutter) 64px' }}>
        <p className="eyebrow" style={{ marginBottom: '10px' }}>THE JOURNAL</p>
        <h1 style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif',
          fontSize: 'clamp(2rem, 5vw, 3.2rem)',
          marginBottom: '16px',
          letterSpacing: '-0.03em',
        }}>
          Architecture, Markets & Luxury Living
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '14px', maxWidth: '540px', margin: '0 auto', lineHeight: 1.7 }}>
          Curated insights on premium real estate trends, architectural movements, and the modern luxury lifestyle — by F.B. Developer.
        </p>
      </div>

      {/* Content */}
      <div className="blog-page__content" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 var(--gutter)' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', paddingTop: '60px' }}>
            <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-accent)' }} />
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>Loading journal articles...</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <AlertCircle size={32} style={{ color: 'var(--muted)', marginBottom: '12px' }} />
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>{error}</p>
          </div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <BookOpen size={40} style={{ color: '#ddd', marginBottom: '16px' }} />
            <h2 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Articles Published Yet</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px' }}>F.B. Developer editorial articles will appear here.</p>
          </div>
        ) : (
          <>
            {/* Featured first post */}
            {page === 1 && posts[0] && (
              <Link className="blog-page__featured-link" to={`/blog/${posts[0].slug || posts[0].id}`}>
                <article className="blog-page__featured">
                  <div className="blog-page__featured-media">
                    <img
                      src={posts[0].coverUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                      alt={posts[0].title}
                    />
                  </div>
                  <div className="blog-page__featured-content">
                    <p className="eyebrow" style={{ marginBottom: '12px', color: 'var(--color-accent)' }}>FEATURED STORY</p>
                    <h2 className="blog-page__title" style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif',
                      fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
                      lineHeight: 1.25,
                      marginBottom: '14px',
                      color: 'var(--ink)',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}>
                      {posts[0].title}
                    </h2>
                    <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.7, marginBottom: '24px', wordBreak: 'break-word' }}>
                      {posts[0].excerpt}
                    </p>
                    <div className="blog-page__meta blog-page__featured-meta" style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '11px', color: 'var(--muted)', fontWeight: 600, marginBottom: '24px', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Calendar size={12} /> {new Date(posts[0].date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <Clock size={12} /> {estimateReadTime(posts[0].content)} min read
                      </span>
                    </div>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: 'var(--ink)', letterSpacing: '.04em' }}>
                      READ ARTICLE <ArrowRight size={14} />
                    </div>
                  </div>
                </article>
              </Link>
            )}

            {/* Grid of remaining posts */}
            <div className="blog-page__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: '28px' }}>
              {(page === 1 ? posts.slice(1) : posts).map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug || post.id}`}
                  style={{ textDecoration: 'none', display: 'block' }}
                >
                  <article style={{
                    border: '1px solid var(--line)', borderRadius: '10px', overflow: 'hidden',
                    background: '#fff', transition: 'transform 0.2s, box-shadow 0.2s',
                    height: '100%',
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.09)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                  >
                    <div style={{ height: '220px', overflow: 'hidden', background: '#f4f0ec' }}>
                      <img
                        src={post.coverUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                      />
                    </div>
                    <div className="blog-page__card-content" style={{ padding: '24px' }}>
                      <div className="blog-page__meta" style={{ display: 'flex', gap: '14px', fontSize: '10px', color: 'var(--muted)', fontWeight: 600, letterSpacing: '.04em', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={11} /> {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={11} /> {estimateReadTime(post.content)} min
                        </span>
                      </div>
                      <h3 className="blog-page__title" style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", "Helvetica Neue", sans-serif',
                        fontSize: '1rem', fontWeight: 700, lineHeight: 1.35, marginBottom: '10px', color: 'var(--ink)',
                      }}>
                        {post.title}
                      </h3>
                      <p style={{ fontSize: '12px', color: 'var(--muted)', lineHeight: 1.65, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.excerpt}
                      </p>
                      <p style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-accent)', letterSpacing: '.04em' }}>
                        By {post.author}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="blog-page__pagination" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', marginTop: '64px' }}>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-outline"
                  style={{ padding: '8px 20px', fontSize: '12px', cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.5 : 1 }}
                >
                  ← Previous
                </button>
                <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                  Page {page} of {totalPages} ({total} articles)
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn btn-dark"
                  style={{ padding: '8px 20px', fontSize: '12px', cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.5 : 1 }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
