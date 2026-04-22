'use client';

import { useState } from 'react';

interface FilePreviewProps {
  url: string;
  title?: string;
}

const IMAGE_EXTS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];
const PDF_EXTS = ['.pdf'];
const CAD_EXTS = ['.stp', '.step', '.sldprt', '.sldasm', '.dwg', '.dxf'];

function getFileType(url: string): 'image' | 'pdf' | 'cad' | 'link' {
  const ext = url.split('.').pop()?.toLowerCase() || '';
  if (IMAGE_EXTS.includes(`.${ext}`)) return 'image';
  if (PDF_EXTS.includes(`.${ext}`)) return 'pdf';
  if (CAD_EXTS.includes(`.${ext}`)) return 'cad';
  return 'link';
}

export function FilePreview({ url, title }: FilePreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const fileType = getFileType(url);
  const fileName = url.split('/').pop() || 'Attachment';

  return (
    <div className="glass-input rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
        <span className="text-xs text-[var(--text-secondary)] uppercase tracking-wider font-semibold">Attachment Preview</span>
      </div>

      {fileType === 'image' && (
        <div className="rounded-lg overflow-hidden bg-[var(--surface-3)]">
          <img 
            src={url} 
            alt={title || 'Attachment'} 
            className="w-full max-h-64 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      {fileType === 'pdf' && (
        <div className="rounded-lg overflow-hidden bg-[var(--surface-3)] p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-[var(--danger)]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7 3a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V9l-6-6H7zm0 2h6v4h4v10H7V5z"/>
          </svg>
          <p className="text-sm text-[var(--text-primary)] mb-2">{fileName}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open PDF
          </a>
        </div>
      )}

      {fileType === 'cad' && (
        <div className="rounded-lg overflow-hidden bg-[var(--surface-3)] p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-[var(--purple)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.256 1.623-1.256 2.05 0m1.014 9.67c.35.284.82.42 1.305.385.964-.068 1.75-.954 1.75-1.952v-1.557c0-1.22-.987-2.195-2.167-2.05-1.026.126-1.827 1.113-1.693 2.159" />
          </svg>
          <p className="text-sm text-[var(--text-primary)] mb-2">CAD File: {fileName}</p>
          <p className="text-xs text-[var(--text-muted)] mb-3">Open in Onshape, SolidWorks, or other CAD software</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-[var(--purple)] hover:bg-[var(--purple-glow)] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open CAD
          </a>
        </div>
      )}

      {fileType === 'link' && (
        <div className="rounded-lg overflow-hidden bg-[var(--surface-3)] p-6 text-center">
          <svg className="w-10 h-10 mx-auto mb-3 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm text-[var(--accent)] hover:bg-[var(--accent-glow)] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Link
          </a>
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
        <span className="text-[10px] text-[var(--text-muted)]">URL: {url}</span>
      </div>
    </div>
  );
}