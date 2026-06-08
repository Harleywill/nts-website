'use client';

import { useState } from 'react';

export default function FeaturedNewsDirections() {
  const [selected, setSelected] = useState<'horizontal' | 'vertical' | 'herolite' | 'minimal'>('horizontal');

  const article = {
    title: 'Revolutionary HVAC System Brings Energy Efficiency to Historic Hull Property',
    excerpt: 'NTS Ltd completes cutting-edge installation on Grade II listed building, achieving 40% energy reduction while maintaining architectural integrity.',
    date: 'June 4, 2026',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=1200&h=600&fit=crop',
  };

  // Component Option 1: Horizontal Card (Image left, content right)
  const HorizontalCard = () => (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-lg overflow-hidden border-l-4 border-brand-green-500">
          <div className="h-64 lg:h-80 bg-cover bg-center" style={{ backgroundImage: `url('${article.image}')` }} />
          <div className="p-8 lg:p-10">
            <span className="inline-block text-xs font-bold text-brand-green-600 uppercase tracking-wider mb-3">Featured News</span>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4" style={{ textWrap: 'balance' }}>
              {article.title}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">{article.excerpt}</p>
            <div className="flex items-center justify-between">
              <time className="text-sm text-gray-500">{article.date}</time>
              <a href="#" className="inline-flex items-center gap-2 text-brand-green-600 hover:text-green-700 font-semibold">
                Read More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Component Option 2: Vertical Card (Image top, content bottom)
  const VerticalCard = () => (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-2xl px-6 sm:px-8 lg:px-12">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="h-80 bg-cover bg-center" style={{ backgroundImage: `url('${article.image}')` }} />
          <div className="p-8 lg:p-10">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-block text-xs font-bold text-white bg-brand-green-500 px-3 py-1 rounded">Featured</span>
              <time className="text-xs text-gray-500">{article.date}</time>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3" style={{ textWrap: 'balance' }}>
              {article.title}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6">{article.excerpt}</p>
            <a href="#" className="inline-flex items-center gap-2 bg-brand-green-500 hover:bg-brand-green-600 text-white px-6 py-2 rounded font-semibold transition-colors">
              Read Full Article
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );

  // Component Option 3: Hero-Lite (Large image with text overlay)
  const HeroLite = () => (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <div
          className="relative h-96 rounded-lg overflow-hidden shadow-lg bg-cover bg-center"
          style={{ backgroundImage: `url('${article.image}')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
            <span className="inline-block bg-brand-green-500 text-white px-3 py-1 text-xs font-bold uppercase w-fit mb-4">Featured News</span>
            <h3 className="text-3xl lg:text-4xl font-bold text-white mb-3" style={{ textWrap: 'balance' }}>
              {article.title}
            </h3>
            <p className="text-gray-100 text-lg mb-6 max-w-2xl">{article.excerpt}</p>
            <div className="flex items-center gap-6">
              <time className="text-gray-300 text-sm">{article.date}</time>
              <a href="#" className="inline-flex items-center gap-2 bg-brand-green-500 hover:bg-brand-green-600 text-white px-6 py-2 font-semibold transition-colors rounded">
                Read More
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  // Component Option 4: Minimal (Clean, simple, professional)
  const Minimal = () => (
    <section className="py-12 lg:py-16 bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 h-48 lg:h-64 rounded-lg bg-cover bg-center shadow-md" style={{ backgroundImage: `url('${article.image}')` }} />
          <div className="lg:col-span-2 flex flex-col justify-center">
            <div className="mb-3">
              <span className="text-xs font-semibold text-brand-green-600 uppercase tracking-wider">Latest News</span>
            </div>
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3" style={{ textWrap: 'balance' }}>
              {article.title}
            </h3>
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between">
              <time className="text-sm text-gray-600">{article.date}</time>
              <a href="#" className="text-brand-green-600 hover:text-green-700 font-semibold text-sm">
                Read Article →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-lg font-bold text-gray-900">Featured News Component Options</h1>
            <div className="flex gap-2 flex-wrap">
              {[
                { id: 'horizontal', label: 'Horizontal' },
                { id: 'vertical', label: 'Vertical' },
                { id: 'herolite', label: 'Hero-Lite' },
                { id: 'minimal', label: 'Minimal' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelected(option.id as any)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-colors text-sm ${
                    selected === option.id
                      ? 'bg-brand-green-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      {selected === 'horizontal' && <HorizontalCard />}
      {selected === 'vertical' && <VerticalCard />}
      {selected === 'herolite' && <HeroLite />}
      {selected === 'minimal' && <Minimal />}

      {/* Description */}
      <div className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            {selected === 'horizontal' && 'Option A: Horizontal Card'}
            {selected === 'vertical' && 'Option B: Vertical Card'}
            {selected === 'herolite' && 'Option C: Hero-Lite'}
            {selected === 'minimal' && 'Option D: Minimal'}
          </h3>
          <p className="text-gray-700 leading-relaxed max-w-2xl">
            {selected === 'horizontal' &&
              'Image on left, content on right. Great balance for homepage. Works well on all screen sizes. Green accent line draws attention.'}
            {selected === 'vertical' &&
              'Image on top, content below. Stacked layout that feels compact. Good for maintaining page flow. Centered and focused.'}
            {selected === 'herolite' &&
              'Large image with text overlay (smaller hero section). Bold and visual. Great for storytelling. Makes the featured article feel important.'}
            {selected === 'minimal' &&
              'Clean 3-column grid on desktop. Simple and professional. Image gets reduced emphasis. Best for flowing naturally into other content below.'}
          </p>
        </div>
      </div>
    </div>
  );
}
