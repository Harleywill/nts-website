'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { canEdit, canDelete } from '@/lib/admin/permissions';

interface Post {
  id: string;
  title: string;
  content?: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');

  useEffect(() => {
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUserRole(data.role || 'viewer'))
      .catch(() => setUserRole('viewer'));

    fetch('/api/news', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const postsData = Array.isArray(data) ? data : data.news || [];
        setPosts(postsData.sort((a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
      })
      .catch((error) => console.error('Failed to fetch posts:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/news/${id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) {
        setPosts(posts.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  const showEditDelete = canEdit(userRole as any) || canDelete(userRole as any);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="mepm-h2 text-navy-700">Blog</h1>
          <p className="mepm-spec mt-1 text-slate-500">
            {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canEdit(userRole as any) && (
          <Link
            href="/admin/news/new"
            className="inline-flex items-center gap-2 rounded-md bg-green-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-600"
          >
            <Plus size={17} /> Add post
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="font-mono text-slate-400">Loading…</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-300 px-6 py-16 text-center">
          <p className="mepm-spec text-slate-400">No posts yet</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px',
        }}>
          {posts.map((post) => (
            <div
              key={post.id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div style={{
                height: '160px',
                background: post.imageUrl ? '#000' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ color: '#9ca3af', fontSize: '32px' }}>📝</div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <h3 style={{
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 700,
                  fontSize: '15px',
                  color: '#1a2f6e',
                  margin: 0,
                  marginBottom: '4px',
                }}>
                  {post.title}
                </h3>

                {post.content && (
                  <p style={{
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '13px',
                    color: '#4b5563',
                    margin: 0,
                    marginBottom: '10px',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {post.content}
                  </p>
                )}

                {/* Date */}
                <p style={{
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#6b7280',
                  margin: '8px 0 10px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '.03em',
                }}>
                  {new Date(post.createdAt).toLocaleDateString('en-GB', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                {/* Featured Badge */}
                {post.featured && (
                  <div style={{ marginBottom: '12px' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      background: '#dcfce7',
                      color: '#166534',
                    }}>
                      Featured
                    </span>
                  </div>
                )}

                {/* Actions */}
                {showEditDelete && (
                  <div style={{
                    display: 'flex',
                    gap: '6px',
                    borderTop: '1px solid #e5e7eb',
                    paddingTop: '12px',
                  }}>
                    {canEdit(userRole as any) && (
                      <Link
                        href={`/admin/news/${post.id}/edit`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                    )}
                    {canDelete(userRole as any) && (
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
