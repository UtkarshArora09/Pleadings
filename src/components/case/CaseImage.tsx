import React from 'react';
import Image from 'next/image';

interface CaseImageProps {
  src: string;
  alt: string;
  provenance: 'archival' | 'illustration';
  width?: number;
  height?: number;
  fill?: boolean;
  priority?: boolean;
  className?: string;
  aspectRatio?: string;
}

export function CaseImage({
  src,
  alt,
  provenance,
  width,
  height,
  fill = false,
  priority = false,
  className = '',
  aspectRatio = 'aspect-[16/9]'
}: CaseImageProps) {
  const isIllustration = provenance === 'illustration';
  const resolvedAlt = isIllustration && !alt.startsWith('Illustration:') ? `Illustration: ${alt}` : alt;
  const isDataUri = typeof src === 'string' && (src.startsWith('data:') || src.startsWith('blob:'));
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    return (
      <div
        className={`relative overflow-hidden rounded-xs select-none flex flex-col items-center justify-center p-6 bg-[#121520] border border-red-500/30 text-center ${
          !fill && !width ? aspectRatio : ''
        } ${className}`}
      >
        <span className="text-red-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
          ✕ Error loading image
        </span>
        <span className="text-white/40 text-[10px] font-mono truncate max-w-full px-2">
          {resolvedAlt || 'Image unavailable'}
        </span>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xs select-none ${
        !fill && !width ? aspectRatio : ''
      } ${isIllustration ? 'border border-[#D4AF37]/40 saturate-[0.82] contrast-[1.05]' : 'border border-white/10'} ${className}`}
    >
      {fill ? (
        <Image
          src={src}
          alt={resolvedAlt}
          fill
          unoptimized={isDataUri}
          priority={priority}
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setHasError(true)}
          className="object-cover object-center"
        />
      ) : (
        <Image
          src={src}
          alt={resolvedAlt}
          width={width || 600}
          height={height || 338}
          unoptimized={isDataUri}
          priority={priority}
          onError={() => setHasError(true)}
          className="w-full h-auto object-cover object-center"
        />
      )}

      {/* Grain & Watermark Overlay for Illustrations */}
      {isIllustration && (
        <>
          {/* Subtle noise/grain CSS overlay */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:8px_8px]"
            aria-hidden="true"
          />
          {/* Corner Watermark */}
          <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-black/80 backdrop-blur-xs border border-[#D4AF37]/50 rounded-2xs text-[9px] font-mono font-bold tracking-widest text-[#D4AF37] uppercase pointer-events-none shadow-md">
            ILLUSTRATION
          </div>
        </>
      )}

      {/* Archival Badge */}
      {!isIllustration && (
        <div className="absolute top-2 right-2 z-10 px-2 py-0.5 bg-black/80 backdrop-blur-xs border border-emerald-500/40 rounded-2xs text-[9px] font-mono font-bold tracking-widest text-emerald-300 uppercase pointer-events-none shadow-md">
          ARCHIVAL
        </div>
      )}
    </div>
  );
}
