'use client';

import Link from 'next/link';
import { MapPin, ExternalLink } from 'lucide-react';

function parseLatitude(value: unknown): number | null {
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(n) && n >= -90 && n <= 90 ? n : null;
}

function parseLongitude(value: unknown): number | null {
  const n = typeof value === 'number' ? value : parseFloat(String(value));
  return Number.isFinite(n) && n >= -180 && n <= 180 ? n : null;
}

export function IpGeoMap({
  latitude,
  longitude,
  label,
}: {
  latitude: unknown;
  longitude: unknown;
  label?: string;
}) {
  const lat = parseLatitude(latitude);
  const lng = parseLongitude(longitude);

  if (lat === null || lng === null) return null;

  const coords = `${lat},${lng}`;
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(coords)}&hl=en&z=10&output=embed`;
  const openUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`;
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.trim();
  const embedSrc = apiKey
    ? `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(apiKey)}&center=${coords}&zoom=10&maptype=roadmap`
    : embedUrl;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-medium">
          <MapPin className="h-4 w-4 text-primary" aria-hidden />
          Approximate location
          {label ? <span className="text-muted-foreground">· {label}</span> : null}
        </div>
        <Link
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          Open in Google Maps
          <ExternalLink className="h-3 w-3" />
        </Link>
      </div>
      <div className="relative aspect-[16/9] w-full min-h-[220px] bg-muted">
        <iframe
          title={`Map for ${label ?? coords}`}
          src={embedSrc}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
      <p className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        {lat.toFixed(4)}, {lng.toFixed(4)} — IP geolocation is approximate, not exact street-level
        accuracy.
      </p>
    </div>
  );
}
