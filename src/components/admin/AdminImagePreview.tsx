'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { shouldBypassImageOptimization } from '@/lib/imageUtils';

interface AdminImagePreviewProps {
  src: string;
  fallbackSrc: string;
  alt: string;
  caption: string;
}

export function AdminImagePreview({ src, fallbackSrc, alt, caption }: AdminImagePreviewProps) {
  const [imgSrc, setImgSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setImgSrc(src || fallbackSrc);
  }, [src, fallbackSrc]);

  return (
    <div className="space-y-2">
      <div className="aspect-[16/9] bg-[#0E1016] border border-white/15 rounded-xs overflow-hidden relative flex items-center justify-center group shadow-md">
        <Image
          src={imgSrc}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={shouldBypassImageOptimization(imgSrc)}
          className="object-cover"
          onError={() => {
            if (imgSrc !== fallbackSrc) setImgSrc(fallbackSrc);
          }}
        />
      </div>
      <p className="text-[10px] font-mono text-[#8c887e] text-center">{caption}</p>
    </div>
  );
}
