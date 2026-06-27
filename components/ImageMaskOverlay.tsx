"use client";

import React from "react";
import { PolygonPoint } from "@/lib/ai/interface";
import { motion } from "framer-motion";

interface ImageMaskOverlayProps {
  imageUrl: string;
  polygons: PolygonPoint[][];
  highlightLines?: PolygonPoint[][];
}

export function ImageMaskOverlay({ imageUrl, polygons, highlightLines }: ImageMaskOverlayProps) {
  return (
    <div className="w-full h-full flex items-center justify-center overflow-hidden p-4">
      {/* Wrapper fits exactly to the image's rendered dimensions */}
      <div className="relative inline-block max-w-full max-h-[80vh]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt="Notes"
          className="max-w-full max-h-[80vh] block shadow-xl border border-zinc-300/50 rounded-sm"
          style={{ objectFit: "contain" }}
        />

        {/* SVG perfectly overlays the image. viewBox 0 0 100 100 allows native 0-100 coordinate mapping */}
        <svg
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          style={{ zIndex: 10 }}
        >
          <defs>
            <filter id="heavy-blur" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" />
            </filter>
            
            {/* Soft glow for highlight marker */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {polygons.map((polygon, index) => {
            const pointsStr = polygon.map((p) => `${p.x},${p.y}`).join(" ");

            return (
              <motion.polygon
                key={`poly-${index}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                points={pointsStr}
                fill="rgba(249, 247, 241, 0.96)" /* Paper-like obscuring mask */
                filter="url(#heavy-blur)"
              />
            );
          })}
          
          {highlightLines && highlightLines.map((line, index) => {
            // We use M and L commands to draw paths instead of points string
            const pathData = line.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(" ");
            
            return (
              <motion.path
                key={`highlight-${index}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                d={pathData}
                fill="none"
                stroke="rgba(239, 68, 68, 0.7)" /* Red semi-transparent marker */
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
              />
            );
          })}
        </svg>
      </div>
    </div>
  );
}
