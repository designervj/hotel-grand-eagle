"use client";
import React, { useEffect, useState } from "react";

const FALLBACK_IMAGES = [
    "/hotel-img/IMG_0873.JPG",
    "/hotel-img/IMG_0876.JPG",
    "/hotel-img/IMG_0890 (1).JPG",
    "/hotel-img/IMG_0893 (1).JPG",
    "/hotel-img/IMG_0896.JPG",
    "/hotel-img/IMG_0897.JPG",
    "/hotel-img/IMG_0908.JPG",
    "/hotel-img/IMG_0919 (1).JPG",
    "/hotel-img/IMG_0926.JPG",
    "/hotel-img/IMG_0941.JPG",
    "/hotel-img/IMG_0947 (1).JPG",
    "/hotel-img/IMG_0950.JPG",
    "/hotel-img/IMG_0953.JPG",
    "/hotel-img/IMG_0955.JPG",
    "/hotel-img/17c48949ff00c521.jpg",
    "/hotel-img/1e88ecfffc39572b.jpg",
    "/hotel-img/2e41589097cad4ce.jpg",
    "/hotel-img/487eca713cf2c776.jpg",
    "/hotel-img/5d5ccf8281fe2a65.jpg",
    "/hotel-img/73bf5b889aced7ee.webp",
    "/hotel-img/8dffd4e633638b34.jpg",
    "/hotel-img/9b80559ce359f116.jpg",
    "/hotel-img/bad0189833006d97.jpg",
    "/hotel-img/c9da6d8c8ba3815d.jpg",
    "/hotel-img/ceef6ebf560e411d.jpg",
    "/hotel-img/e02ab1f8503f40b4.jpg",
    "/hotel-img/f7d235a552b69374.jpg",
    "/hotel-img/ff84731cb1484a5f.jpg"
];

export default function GalleryPage() {
    const [lightboxSrc, setLightboxSrc] = useState("");
    const [images, setImages] = useState<string[]>(FALLBACK_IMAGES);

    useEffect(() => {
        fetch("/api/gallery")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setImages(data.map((img: any) => img.url));
                }
            })
            .catch(() => { /* use fallback */ });
        
        // Handle animations
        const fadeEls = document.querySelectorAll('.fade-in-up');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.transitionDelay = (i * 0.05) + 's';
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        fadeEls.forEach(el => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const openLightbox = (src: string) => { 
        setLightboxSrc(src); 
        document.body.style.overflow = "hidden"; 
    };
    
    const closeLightbox = () => { 
        setLightboxSrc(""); 
        document.body.style.overflow = ""; 
    };

    return (
        <div style={{ background: "var(--midnight)", minHeight: "100vh", paddingTop: 160, paddingBottom: 112 }}>
            <div className="max-w">
                {/* Header Section */}
                <div style={{ textAlign: "center", marginBottom: 80 }}>
                    <div className="section-eyebrow fade-in-up" style={{ justifyContent: "center" }}>
                        <span className="line"></span>
                        <span>Visual Journey</span>
                        <span className="line"></span>
                    </div>
                    <h1 className="section-title fade-in-up" style={{ fontSize: "clamp(40px, 8vw, 84px)" }}>
                        Art of <em>Living</em>
                    </h1>
                    <p className="fade-in-up" style={{ color: "var(--ivory-dim)", marginTop: 24, fontSize: 15, maxWidth: 600, margin: "24px auto 0", lineHeight: 1.8 }}>
                        From our meticulously curated suites to the serene ambiance of our public spaces, explore the visual aesthetic of Hotel Grand Eagle.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="gallery-grid" style={{ marginBottom: 96 }}>
                    {images.map((img, i) => (
                        <div key={i} className="gallery-item fade-in-up" onClick={() => openLightbox(img)} style={{ aspectRatio: "4/5", cursor: "pointer" }}>
                            <img src={img} alt={`Gallery item ${i + 1}`} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            <div className="gallery-overlay">
                                <div className="gallery-overlay-content">
                                    <div className="gallery-zoom-icon">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--midnight)" strokeWidth="1.5">
                                            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                                        </svg>
                                    </div>
                                    <span className="gallery-view-text">Enlarge View</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Invitation Section */}
                <div style={{ textAlign: "center", borderTop: "1px solid rgba(212,168,87,0.1)", paddingTop: 112 }}>
                    <h2 className="section-title fade-in-up" style={{ fontSize: 36, marginBottom: 40 }}>
                        Experience the <em>extraordinary</em>
                    </h2>
                    <div className="fade-in-up">
                        <a href="/book" className="btn-primary" style={{ display: "inline-flex", textDecoration: "none" }}>
                            Secure Your Reservation
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: 12 }}>
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Lightbox Implementation */}
            {lightboxSrc && (
                <div className="lightbox-overlay" onClick={closeLightbox}>
                    <button className="lightbox-close" onClick={closeLightbox}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                    <div className="lightbox-content" onClick={e => e.stopPropagation()}>
                        <img src={lightboxSrc} alt="Gallery Spotlight" style={{ maxWidth: "90vw", maxHeight: "85vh", border: "1px solid var(--gold)" }} />
                    </div>
                </div>
            )}

            <style jsx>{`
                .lightbox-overlay {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(0,0,0,0.95);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(8px);
                    animation: fadeIn 0.4s ease;
                }
                .lightbox-close {
                    position: absolute;
                    top: 40px; right: 40px;
                    background: none; border: none;
                    cursor: pointer; padding: 10px;
                    z-index: 10001;
                }
                .lightbox-content {
                    position: relative;
                    animation: zoomIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
}
