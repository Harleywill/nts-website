'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { canEdit, canDelete } from '@/lib/admin/permissions';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl?: string;
  category: string;
  featured: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>('viewer');

  useEffect(() => {
    // Fetch user role
    fetch('/api/auth/me', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setUserRole(data.role || 'viewer'))
      .catch(() => setUserRole('viewer'));

    // Fetch projects
    fetch('/api/projects', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        const projectsData = Array.isArray(data) ? data : data.projects || [];
        setProjects(projectsData);
      })
      .catch((error) => console.error('Failed to fetch projects:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setProjects(projects.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const showEditDelete = canEdit(userRole as any) || canDelete(userRole as any);

  return (
    <div>
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold" style={{ color: "#1a2f6e" }}>Projects</h1>
          <p className="text-sm text-gray-500 mt-1">
            {projects.length} project{projects.length !== 1 ? 's' : ''}
          </p>
        </div>
        {canEdit(userRole as any) && (
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition-all"
            style={{ backgroundColor: "#4caf50" }}
          >
            <Plus size={17} /> Add project
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <span className="text-gray-400">Loading…</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <p className="text-gray-400 mb-4">No projects yet</p>
          {canEdit(userRole as any) && (
            <Link
              href="/admin/projects/new"
              className="inline-block px-6 py-2 text-white font-medium rounded-lg hover:scale-105 transition-all"
              style={{ backgroundColor: "#4caf50" }}
            >
              Create your first project
            </Link>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px',
        }}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
            >
              {/* Image */}
              <div style={{
                height: '160px',
                background: project.imageUrl ? '#000' : '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}>
                {project.imageUrl ? (
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ color: '#9ca3af', fontSize: '32px' }}>📁</div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <h3 style={{
                  fontWeight: 700,
                  fontSize: '15px',
                  color: '#1a2f6e',
                  margin: 0,
                  marginBottom: '4px',
                }}>
                  {project.title}
                </h3>
                <p style={{
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
                  {project.description}
                </p>

                {/* Category & Featured Badge */}
                <div style={{ marginBottom: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'capitalize',
                    background: '#f3f4f6',
                    color: '#4b5563',
                  }}>
                    {project.category}
                  </span>
                  {project.featured && (
                    <span style={{
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600,
                      background: '#dcfce7',
                      color: '#166534',
                    }}>
                      Featured
                    </span>
                  )}
                </div>

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
                        href={`/admin/projects/${project.id}/edit`}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                    )}
                    {canDelete(userRole as any) && (
                      <button
                        onClick={() => handleDelete(project.id, project.title)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
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
