"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause } from "lucide-react";
import { MEDIA_VIDEOS, MEDIA_IMAGES } from "@/lib/media";
import { RevealWords } from "@/components/store/Cinematic";

export function FilmBand() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  return (
    <section className="relative bg-charcoal text-ivory overflow-hidden">
      <div className="container-page section-py grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center">
        <div>
          <span className="label !text-champagne">The film</span>
          <RevealWords as="h2" text="Movement, muse, mastery" className="editorial-h2 mt-3 block" />
          <p className="mt-6 text-lg text-ivory/70 max-w-md">
            Watch the collection come alive — drape, motion, and the quiet confidence of a Bukky fit.
          </p>
          <button
            onClick={toggle}
            className="mt-8 inline-flex items-center gap-3 border border-ivory/40 px-6 py-3.5 text-[0.72rem] font-semibold tracking-[0.16em] uppercase hover:bg-ivory hover:text-charcoal transition-colors"
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {playing ? "Pause film" : "Play film"}
          </button>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-video overflow-hidden border border-ivory/15 bg-black cursor-pointer group"
          onClick={toggle}
        >
          <video
            ref={videoRef}
            src={MEDIA_VIDEOS.hero.src}
            poster={MEDIA_IMAGES.hero1.src}
            playsInline
            loop
            muted
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {!playing && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="w-20 h-20 rounded-full bg-ivory/95 text-charcoal flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <Play className="w-7 h-7 ml-1" />
              </span>
            </span>
          )}
          <span className="absolute bottom-4 left-4 label !text-ivory/70">Bukky Collection — Campaign Film</span>
        </motion.div>
      </div>
    </section>
  );
}