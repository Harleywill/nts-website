'use client';

import { useRef } from 'react';

interface FocalPointPickerProps {
  imageUrl: string;
  cropX: number;
  cropY: number;
  onChange: (x: number, y: number) => void;
}

export default function FocalPointPicker({ imageUrl, cropX, cropY, onChange }: FocalPointPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const positionFromEvent = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    const pos = positionFromEvent(e.clientX, e.clientY);
    if (pos) onChange(pos.x, pos.y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current) return;
    const pos = positionFromEvent(e.clientX, e.clientY);
    if (pos) onChange(pos.x, pos.y);
  };

  const handleMouseUp = () => { dragging.current = false; };

  const handleTouchStart = (e: React.TouchEvent) => {
    dragging.current = true;
    const t = e.touches[0];
    const pos = positionFromEvent(t.clientX, t.clientY);
    if (pos) onChange(pos.x, pos.y);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!dragging.current) return;
    e.preventDefault();
    const t = e.touches[0];
    const pos = positionFromEvent(t.clientX, t.clientY);
    if (pos) onChange(pos.x, pos.y);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-900">
          Focal Point{' '}
          <span className="text-gray-400 font-normal">— click or drag to reposition</span>
        </label>
        <button
          type="button"
          onClick={() => onChange(0.5, 0.5)}
          className="text-xs text-green-600 hover:text-green-800 font-medium"
        >
          Reset to centre
        </button>
      </div>

      {/* Full-image picker */}
      <div
        ref={containerRef}
        className="relative rounded-lg overflow-hidden border border-gray-300 cursor-crosshair select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        <img
          src={imageUrl}
          alt="Set focal point"
          className="w-full block pointer-events-none"
          draggable={false}
        />
        {/* Crosshair dot */}
        <div
          className="absolute pointer-events-none"
          style={{ left: `${cropX * 100}%`, top: `${cropY * 100}%`, transform: 'translate(-50%, -50%)' }}
        >
          <div style={{
            position: 'absolute', width: 28, height: 28,
            marginLeft: -14, marginTop: -14,
            borderRadius: '50%',
            border: '2.5px solid #fff',
            boxShadow: '0 0 0 1.5px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.25)',
          }} />
          <div style={{
            position: 'absolute', width: 8, height: 8,
            marginLeft: -4, marginTop: -4,
            borderRadius: '50%',
            background: '#4caf50',
          }} />
        </div>
      </div>

      {/* Card preview */}
      <div>
        <p className="text-xs text-gray-500 mb-1.5">Homepage card preview</p>
        <div className="rounded-lg overflow-hidden border border-gray-200" style={{ aspectRatio: '16/9' }}>
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-cover pointer-events-none"
            style={{ objectPosition: `${cropX * 100}% ${cropY * 100}%` }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
