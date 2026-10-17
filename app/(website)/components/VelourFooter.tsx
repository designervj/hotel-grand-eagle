"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function VelourFooter() {
  const [hotel, setHotel] = useState<any>(null);

  useEffect(() => {
    fetch("/api/hotel-settings")
      .then(r => r.json())
      .then(d => { if (d.name) setHotel(d); })
      .catch(() => {});
  }, []);

  const name    = hotel?.name    || "Hotel Grand Eagle";
  const address = hotel?.address || "Commercial Complex, C-50, near JECC, Sanganer, Sitapura Industrial Area, Sitapura, Jaipur, Rajasthan 302022";
  const phone   = hotel?.phone   || hotel?.contactNumber || "063678 50548";
  const email   = hotel?.email   || "grandeaglehotel@gmail.com";

  return (
    <footer className="ft-root">

      {/* ── Decorative top strip ── */}
      {/* <div className="ft-top-strip">
        <div className="ft-strip-line" />
        <div className="ft-strip-diamond">◆</div>
        <div className="ft-strip-line" />
      </div> */}

      {/* ── Main content ── */}
      <div className="ft-body">
        <div className="max-w ft-inner">

          {/* ── Brand block (full top row centered) ── */}
          <div className="ft-brand-row">
            <img src="/logo.png" alt={name} className="ft-logo" />
            <p className="ft-tagline">
              An intimate retreat in the heart of Sitapura, Jaipur —<br />
              where affordability meets genuine hospitality.
            </p>
            <div className="ft-socials">
              {/* Facebook */}
              <a href="#" className="ft-soc" aria-label="Facebook">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="ft-soc" aria-label="Instagram">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/916367850548" className="ft-soc" aria-label="WhatsApp">
                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── Gold separator ── */}
          <div className="ft-sep" />

          {/* ── 3 link columns ── */}
          <div className="ft-cols">

            {/* Col 1 — Navigate */}
            <div className="ft-col">
              <h4 className="ft-col-title">Navigate</h4>
              <ul className="ft-links">
                {[
                  { href: "/",           label: "Home"          },
                  { href: "/about",      label: "About Us"      },
                  { href: "/gallery",    label: "Gallery"       },
                  { href: "/services",   label: "Services"      },
                  { href: "/nearby",     label: "Nearby Places" },
                  { href: "/book",       label: "Book Now"      },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="ft-link">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ft-link-icon">
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 2 — Rooms */}
            <div className="ft-col">
              <h4 className="ft-col-title">Accommodations</h4>
              <ul className="ft-links">
                {[
                  { href: "/room/rm2",  label: "Royal Suite"          },
                  { href: "/room/rm3",  label: "Twin Standard"        },
                  { href: "/book",      label: "Check Availability"   },
                  { href: "/my-bookings", label: "My Bookings"        },
                ].map(l => (
                  <li key={l.href}>
                    <Link href={l.href} className="ft-link">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ft-link-icon">
                        <polyline points="9,18 15,12 9,6" />
                      </svg>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Book Now pill */}
              <Link href="/book" className="ft-book-pill">
                Book Your Stay
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6" />
                </svg>
              </Link>
            </div>

            {/* Col 3 — Contact */}
            <div className="ft-col">
              <h4 className="ft-col-title">Get In Touch</h4>
              <div className="ft-contacts">
                <div className="ft-citem">
                  <div className="ft-cicon">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <p className="ft-ctext">{address}</p>
                </div>

                <a href={`tel:${phone}`} className="ft-citem ft-clink">
                  <div className="ft-cicon">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.86 19.79 19.79 0 01.1 1.22 2 2 0 012.11 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14.92z" />
                    </svg>
                  </div>
                  <span className="ft-ctext">{phone}</span>
                </a>

                <a href={`mailto:${email}`} className="ft-citem ft-clink">
                  <div className="ft-cicon">
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="ft-ctext">{email}</span>
                </a>

                {/* Opening hours */}
                <div className="ft-hours">
                  <div className="ft-hours-label">Reception Hours</div>
                  <div className="ft-hours-val">24 / 7 — Always Open</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="ft-bottom">
        <div className="max-w ft-bottom-inner">
          <div className="ft-bottom-left">
            <span className="ft-copy">© {new Date().getFullYear()} {name}. All rights reserved.</span>
            <span className="ft-credit">Crafted with ♥ by <em>Codified Web Solutions</em></span>
          </div>
          <div className="ft-bottom-right">
            <Link href="/privacy-policy" className="ft-legal">Privacy Policy</Link>
            <span className="ft-dot">·</span>
            <Link href="/terms-and-conditions" className="ft-legal">Terms &amp; Conditions</Link>
            <span className="ft-dot">·</span>
            <Link href="/contact" className="ft-legal">Contact</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ─────────── Root ─────────── */
        .ft-root {
          background: #070707;
        }

        /* ─────────── Top strip ────── */
        .ft-top-strip {
          display: flex;
          align-items: center;
          gap: 0;
          padding: 0 0;
          overflow: hidden;
        }
        .ft-strip-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,168,87,0.25), transparent);
        }
        .ft-strip-diamond {
          font-size: 8px;
          color: rgba(212,168,87,0.45);
          padding: 18px 20px;
          letter-spacing: 0;
          flex-shrink: 0;
        }

        /* ─────────── Body ─────────── */
        .ft-body {
          padding: 52px 0 60px;
        }
        .ft-inner {
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        /* ─────────── Brand row ─────── */
        .ft-brand-row {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          margin-bottom: 44px;
        }
        .ft-logo {
          height: 60px;
          width: auto;
          object-fit: contain;
          margin-bottom: 18px;
          filter: brightness(0.95);
        }
        .ft-tagline {
          font-size: 13px;
          color: rgba(200,192,176,0.45);
          line-height: 1.9;
          margin-bottom: 22px;
          max-width: 440px;
        }
        .ft-socials {
          display: flex;
          gap: 10px;
        }
        .ft-soc {
          width: 36px; height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(212,168,87,0.18);
          background: rgba(212,168,87,0.03);
          display: flex; align-items: center; justify-content: center;
          color: rgba(212,168,87,0.7);
          text-decoration: none;
          transition: all 0.28s ease;
        }
        .ft-soc:hover {
          background: rgba(212,168,87,0.12);
          border-color: rgba(212,168,87,0.5);
          color: var(--gold);
          transform: translateY(-3px);
        }

        /* ─────────── Separator ─────── */
        .ft-sep {
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(212,168,87,0.2) 30%, rgba(212,168,87,0.2) 70%, transparent 100%);
          margin-bottom: 44px;
        }

        /* ─────────── 3 cols ─────────── */
        .ft-cols {
          display: grid;
          grid-template-columns: 1fr 1fr 1.4fr;
          gap: 48px;
        }
        @media (max-width: 900px) { .ft-cols { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 560px) { .ft-cols { grid-template-columns: 1fr; gap: 32px; } }

        /* ─────────── Col title ─────── */
        .ft-col-title {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--gold);
          margin: 0 0 20px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(212,168,87,0.1);
        }

        /* ─────────── Nav links ─────── */
        .ft-links {
          list-style: none;
          padding: 0; margin: 0 0 24px;
          display: flex; flex-direction: column; gap: 9px;
        }
        .ft-link {
          font-size: 13px;
          color: rgba(200,192,176,0.55);
          text-decoration: none;
          display: flex; align-items: center; gap: 8px;
          transition: color 0.22s, gap 0.22s;
          letter-spacing: 0.01em;
        }
        .ft-link:hover { color: var(--gold); gap: 12px; }
        .ft-link-icon {
          color: rgba(212,168,87,0.4);
          flex-shrink: 0;
          transition: color 0.22s;
        }
        .ft-link:hover .ft-link-icon { color: var(--gold); }

        /* ─────────── Book pill ─────── */
        .ft-book-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border: 1px solid rgba(212,168,87,0.45);
          color: var(--gold);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          text-decoration: none;
          transition: background 0.28s, color 0.28s, transform 0.22s;
        }
        .ft-book-pill:hover {
          background: var(--gold);
          color: #070707;
          transform: translateY(-2px);
        }

        /* ─────────── Contact ─────────── */
        .ft-contacts {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .ft-citem {
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .ft-clink {
          text-decoration: none;
        }
        .ft-clink:hover .ft-ctext { color: var(--gold); }
        .ft-cicon {
          width: 30px; height: 30px;
          border-radius: 6px;
          background: rgba(212,168,87,0.06);
          border: 1px solid rgba(212,168,87,0.12);
          display: flex; align-items: center; justify-content: center;
          color: rgba(212,168,87,0.8);
          flex-shrink: 0;
        }
        .ft-ctext {
          font-size: 13px;
          color: rgba(200,192,176,0.55);
          line-height: 1.65;
          transition: color 0.22s;
          margin-top: 5px;
        }

        /* ─────────── Hours ─────────── */
        .ft-hours {
          padding: 12px 16px;
          border: 1px solid rgba(212,168,87,0.1);
          background: rgba(212,168,87,0.03);
          margin-top: 4px;
        }
        .ft-hours-label {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: var(--gold);
          margin-bottom: 5px;
        }
        .ft-hours-val {
          font-size: 13px;
          color: rgba(200,192,176,0.6);
        }

        /* ─────────── Bottom bar ─────── */
        .ft-bottom {
          border-top: 1px solid rgba(212,168,87,0.07);
          background: rgba(0,0,0,0.5);
          padding: 16px 0;
        }
        .ft-bottom-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
        }
        .ft-bottom-left {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .ft-copy {
          font-size: 11px;
          color: rgba(200,192,176,0.35);
          letter-spacing: 0.04em;
        }
        .ft-credit {
          font-size: 10px;
          color: rgba(200,192,176,0.2);
        }
        .ft-credit em {
          font-style: normal;
          color: rgba(212,168,87,0.45);
        }
        .ft-bottom-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .ft-legal {
          font-size: 11px;
          color: rgba(200,192,176,0.35);
          text-decoration: none;
          letter-spacing: 0.04em;
          transition: color 0.2s;
        }
        .ft-legal:hover { color: var(--gold); }
        .ft-dot {
          font-size: 11px;
          color: rgba(200,192,176,0.15);
        }
      `}</style>
    </footer>
  );
}
