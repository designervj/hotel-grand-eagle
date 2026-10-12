"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";

const GALLERY_IMAGES = [
  { src: "/hotel-img/8dffd4e633638b34.jpg",   alt: "Hotel Exterior",    label: "Hotel Exterior"    },
  { src: "/hotel-img/5d5ccf8281fe2a65.jpg",    alt: "Royal Suite",      label: "Royal Suite"       },
  { src: "/hotel-img/9b80559ce359f116.jpg",     alt: "Suite Interior",   label: "Suite Interior"    },
  { src: "/hotel-img/17c48949ff00c521.jpg",     alt: "Elegant Bedroom",  label: "Elegant Bedroom"   },
  { src: "/hotel-img/487eca713cf2c776.jpg",     alt: "Grand Lobby",      label: "Grand Lobby"       },
  { src: "/hotel-img/c9da6d8c8ba3815d.jpg",     alt: "Fine Dining",      label: "Fine Dining"       },
  { src: "/hotel-img/IMG_0876.JPG",             alt: "Cozy Stay",        label: "Cozy Stay"         },
  { src: "/hotel-img/IMG_0897.JPG",             alt: "Premium Room",     label: "Premium Room"      },
];

const LIGHTBOX_IMAGES = [
  ...GALLERY_IMAGES,
  { src: "/hotel-img/bad0189833006d97 (1).jpg", alt: "Luxury Amenities", label: "Luxury Amenities" },
  { src: "/hotel-img/ceef6ebf560e411d.jpg",     alt: "Premium Comfort",  label: "Premium Comfort"  },
  { src: "/hotel-img/f7d235a552b69374.jpg",     alt: "Relaxation Space", label: "Relaxation Space" },
  { src: "/hotel-img/IMG_0873.JPG",             alt: "Guest Room",       label: "Guest Room"        },
  { src: "/hotel-img/IMG_0893 (1).JPG",         alt: "Suite Bedroom",    label: "Suite Bedroom"     },
  { src: "/hotel-img/IMG_0896.JPG",             alt: "Hotel Interiors",  label: "Hotel Interiors"   },
  { src: "/hotel-img/IMG_0919 (1).JPG",         alt: "Twin Standard",    label: "Twin Standard"     },
  { src: "/hotel-img/deluxe-room-modern.jpg",   alt: "Modern Room",      label: "Modern Room"       },
];

const VISIBLE = 4; // cards visible at once on desktop

export default function Gallery() {
  const [startIdx, setStartIdx]       = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = GALLERY_IMAGES.length;

  /* ── auto-slide every 4s ── */
  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setStartIdx(i => (i + 1) % total);
    }, 4000);
  }, [total]);

  useEffect(() => {
    startAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [startAuto]);

  const slide = (dir: 1 | -1) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setStartIdx(i => (i + dir + total) % total);
    startAuto();
    setTimeout(() => setIsAnimating(false), 400);
  };

  /* ── lightbox ── */
  const openLightbox = (galleryIdx: number) => {
    setLightboxIdx(galleryIdx);
    if (autoRef.current) clearInterval(autoRef.current);
  };
  const closeLightbox = () => {
    setLightboxIdx(null);
    startAuto();
  };
  const lbPrev = useCallback(() =>
    setLightboxIdx(i => i === null ? null : (i - 1 + LIGHTBOX_IMAGES.length) % LIGHTBOX_IMAGES.length), []);
  const lbNext = useCallback(() =>
    setLightboxIdx(i => i === null ? null : (i + 1) % LIGHTBOX_IMAGES.length), []);

  useEffect(() => {
    if (lightboxIdx === null) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape")      closeLightbox();
      if (e.key === "ArrowLeft")   lbPrev();
      if (e.key === "ArrowRight")  lbNext();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lightboxIdx, lbPrev, lbNext]);

  /* build the 4-card window (circular) */
  const visibleCards = Array.from({ length: VISIBLE }, (_, k) => ({
    ...GALLERY_IMAGES[(startIdx + k) % total],
    galleryIdx: (startIdx + k) % total,
  }));

  const currentLb = lightboxIdx !== null ? LIGHTBOX_IMAGES[lightboxIdx] : null;

  return (
    <>
      <section id="gallery" style={{ padding: "112px 0", background: "#0a0a0a", overflow: "hidden" }}>
        <div className="max-w">

          {/* Header */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 32, marginBottom: 56 }}>
            <div>
              <div className="section-eyebrow fade-in-up visible">
                <span className="line" />
                <span>Visual Journey</span>
              </div>
              <h2 className="section-title fade-in-up visible">
                Life at <em>Grand Eagle</em>
              </h2>
            </div>
            {/* Only arrows on right */}
            <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
              <button className="gal-nav-btn" onClick={() => slide(-1)} aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
              </button>
              <button className="gal-nav-btn" onClick={() => slide(1)} aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </button>
            </div>
          </div>

          {/* 4-Card Slider */}
          <div className="gal-slider-wrap">
            <div className={`gal-slider-track ${isAnimating ? "animating" : ""}`}>
              {visibleCards.map((img, k) => (
                <div
                  key={`${img.src}-${k}`}
                  className="gal-card"
                  onClick={() => openLightbox(img.galleryIdx)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && openLightbox(img.galleryIdx)}
                  aria-label={`View ${img.label}`}
                >
                  <img src={img.src} alt={img.alt} loading="lazy" />
                  <div className="gal-card-overlay">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <line x1="11" y1="8" x2="11" y2="14" />
                      <line x1="8" y1="11" x2="14" y2="11" />
                    </svg>
                  </div>
                  <div className="gal-corner-tl" />
                  <div className="gal-corner-br" />
                </div>
              ))}
            </div>
          </div>

          {/* Dot indicators */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 32 }}>
            {GALLERY_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`gal-dot ${i === startIdx ? "active" : ""}`}
                onClick={() => { setStartIdx(i); startAuto(); }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-Width Lightbox ── */}
      {currentLb && (
        <div className="home-lightbox" onClick={closeLightbox} role="dialog" aria-modal="true">
          <button className="home-lightbox-close" onClick={closeLightbox} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button className="home-lightbox-nav prev" onClick={e => { e.stopPropagation(); lbPrev(); }} aria-label="Previous">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
          <div className="home-lightbox-img-wrap" onClick={e => e.stopPropagation()}>
            <img src={currentLb.src} alt={currentLb.alt} className="home-lightbox-img" key={lightboxIdx} />
            <div className="home-lightbox-caption">
              <span className="font-display" style={{ fontSize: 13, letterSpacing: "0.14em", color: "var(--gold)", textTransform: "uppercase" }}>
                {currentLb.label}
              </span>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginLeft: 16 }}>
                {lightboxIdx! + 1} / {LIGHTBOX_IMAGES.length}
              </span>
            </div>
          </div>
          <button className="home-lightbox-nav next" onClick={e => { e.stopPropagation(); lbNext(); }} aria-label="Next">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <polyline points="9,18 15,12 9,6" />
            </svg>
          </button>
        </div>
      )}

      <style jsx>{`
        /* ── Slider ──────────────────────────────────────── */
        .gal-slider-wrap {
          overflow: hidden;
          width: 100%;
        }
        .gal-slider-track {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
          transition: opacity 0.35s ease;
        }
        .gal-slider-track.animating {
          opacity: 0.6;
        }
        @media (max-width: 1024px) { .gal-slider-track { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 560px)  { .gal-slider-track { grid-template-columns: 1fr; } }

        /* ── Card ──────────────────────────────────────── */
        .gal-card {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(212,168,87,0.08);
          transition: transform 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease;
        }
        .gal-card:hover {
          transform: translateY(-4px);
          border-color: rgba(212,168,87,0.4);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }
        .gal-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s ease;
        }
        .gal-card:hover img { transform: scale(1.06); }

        .gal-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.05) 60%, transparent 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .gal-card:hover .gal-card-overlay { opacity: 1; }

        .gal-corner-tl, .gal-corner-br {
          position: absolute;
          width: 16px; height: 16px;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .gal-corner-tl { top: 8px; left: 8px; border-top: 1px solid var(--gold); border-left: 1px solid var(--gold); }
        .gal-corner-br { bottom: 8px; right: 8px; border-bottom: 1px solid var(--gold); border-right: 1px solid var(--gold); }
        .gal-card:hover .gal-corner-tl,
        .gal-card:hover .gal-corner-br { opacity: 1; }

        /* ── Nav buttons ── */
        .gal-nav-btn {
          width: 42px; height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(212,168,87,0.3);
          background: rgba(212,168,87,0.05);
          color: var(--gold);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: background 0.25s, border-color 0.25s, transform 0.2s;
        }
        .gal-nav-btn:hover {
          background: rgba(212,168,87,0.15);
          border-color: rgba(212,168,87,0.7);
          transform: scale(1.08);
        }

        /* ── Dots ── */
        .gal-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          border: none;
          background: rgba(212,168,87,0.25);
          cursor: pointer;
          transition: background 0.3s, transform 0.3s;
          padding: 0;
        }
        .gal-dot.active {
          background: var(--gold);
          transform: scale(1.5);
        }

        /* ── Lightbox ─────────────────────────────────── */
        .home-lightbox {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.96);
          display: flex; align-items: center; justify-content: center;
          animation: lbFadeIn 0.25s ease;
        }
        @keyframes lbFadeIn { from { opacity:0 } to { opacity:1 } }

        .home-lightbox-img-wrap {
          position: relative;
          max-width: 92vw; max-height: 90vh;
          display: flex; flex-direction: column; align-items: center;
        }
        .home-lightbox-img {
          max-width: 92vw; max-height: 82vh;
          width: auto; height: auto;
          object-fit: contain; display: block;
          box-shadow: 0 24px 80px rgba(0,0,0,0.8);
          border: 1px solid rgba(212,168,87,0.15);
          animation: lbImgIn 0.3s ease;
        }
        @keyframes lbImgIn { from { transform:scale(0.95);opacity:0 } to { transform:scale(1);opacity:1 } }

        .home-lightbox-caption { margin-top: 14px; display: flex; align-items: center; }

        .home-lightbox-close {
          position: fixed; top: 20px; right: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 50%; width: 44px; height: 44px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          z-index: 10001;
        }
        .home-lightbox-close:hover { background: rgba(212,168,87,0.15); border-color: rgba(212,168,87,0.5); }

        .home-lightbox-nav {
          position: fixed; top: 50%; transform: translateY(-50%);
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 50%; width: 52px; height: 52px;
          display: flex; align-items: center; justify-content: center;
          color: #fff; cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          z-index: 10001;
        }
        .home-lightbox-nav:hover { background: rgba(212,168,87,0.15); border-color: rgba(212,168,87,0.5); }
        .home-lightbox-nav.prev { left: 20px; }
        .home-lightbox-nav.next { right: 20px; }

        @media (max-width: 640px) {
          .home-lightbox-nav.prev { left: 8px; }
          .home-lightbox-nav.next { right: 8px; }
          .home-lightbox-nav { width: 40px; height: 40px; }
        }
      `}</style>
    </>
  );
}
