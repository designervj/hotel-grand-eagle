import Link from "next/link";
import type { Metadata } from "next";
import KalptreeLoginForm from "./KalptreeLoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Hotel Grand Eagle",
  description: "Secure Hotel Grand Eagle administration portal — manage bookings, rooms, and operations.",
};

const features = [
  {
    title: "Bookings & Reservations",
    description:
      "View, confirm, and manage all guest bookings in real-time. Track check-ins, check-outs, and cancellations effortlessly.",
    icon: "calendar",
  },
  {
    title: "Room & Inventory Control",
    description:
      "Update room types, pricing rules, availability, and housekeeping status from one unified dashboard.",
    icon: "box",
  },
  {
    title: "Secure Admin Access",
    description:
      "Protected administrator console with encrypted sessions, role-based access, and full audit trails.",
    icon: "shield",
  },
];

function Icon({ name }: { name: string }) {
  if (name === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  if (name === "box") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
        <path d="m4 7.5 8 4.5 8-4.5" />
        <path d="M12 12v9" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 5 6v5c0 4.6 2.9 8.8 7 10 4.1-1.2 7-5.4 7-10V6l-7-3Z" />
      <path d="M12 8v5" />
      <path d="M12 16h.01" />
    </svg>
  );
}

export default function KalptreeAdminLoginPage() {
  return (
    <main className="kalptree-admin">

      {/* ── Left: Login ── */}
      <section className="login-side" aria-labelledby="admin-login-heading">
        <div className="login-card">

          <div className="brand-row">
            <img className="brand-logo" src="/logo.png" alt="Hotel Grand Eagle" />
          </div>

          <div className="portal-pill">
            <span />
            Admin Portal
          </div>

          <h1 id="admin-login-heading">Admin Login</h1>
          <p className="login-copy">
            Enter your credentials to access the Hotel Grand Eagle administration dashboard.
          </p>

          <KalptreeLoginForm />

          <div className="login-links">
            <Link href="/">← Back to Website</Link>
            <Link href="/sign-in">Guest Login</Link>
          </div>
        </div>
      </section>

      {/* ── Right: Info ── */}
      <section className="info-side" aria-label="Hotel Grand Eagle administration details">
        <div className="info-inner">
          <div className="section-pill">
            <Icon name="shield" />
            Hotel Administration
          </div>

          <h2>Manage Your Hotel with Complete Control</h2>
          <p className="info-copy">
            Access your centralized operations dashboard to manage bookings, monitor room occupancy,
            and run day-to-day hotel operations — all from one place.
          </p>

          <div className="feature-list">
            {features.map(feature => (
              <article className="feature-card" key={feature.title}>
                <div className="feature-icon">
                  <Icon name={feature.icon} />
                </div>
                <div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="portal-meta">
            <p>Portal: <strong>Hotel Grand Eagle</strong></p>
            <p>Access: <strong>Authorized Personnel Only</strong></p>
          </div>
        </div>
      </section>

      <style>{`
        /* ── Root ── */
        .kalptree-admin {
          --midnight: #06161a;
          --charcoal: #051e26;
          --ivory:    #ffffff;
          --gold:     #d5a857;
          --muted:    #0d2a34;
          --line:     rgba(213, 168, 87, 0.18);
          position: fixed;
          inset: 0;
          height: 100%;
          width: 100%;
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          background: var(--midnight);
          color: var(--ivory);
          font-family: Arial, Helvetica, sans-serif;
          overflow: hidden;
        }
        .kalptree-admin, .kalptree-admin * { box-sizing: border-box; }
        .kalptree-admin svg {
          fill: none;
          stroke: currentColor;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-width: 1.8;
        }

        /* ── Sides ── */
        .login-side, .info-side {
          min-height: 100dvh;
          position: relative;
          overflow-y: auto;
        }
        .login-side {
          align-items: center;
          background:
            radial-gradient(circle at 28% 12%, rgba(213,168,87,0.13), transparent 28%),
            radial-gradient(circle at 72% 44%, rgba(213,168,87,0.08), transparent 32%),
            linear-gradient(135deg, var(--midnight), #06242d 58%, #021015);
          border-right: 1px solid var(--line);
          display: flex;
          justify-content: center;
          padding: clamp(24px, 4vw, 56px);
        }
        .login-side::before, .info-side::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(213,168,87,0.09) 1px, transparent 1px);
          background-size: 28px 28px;
          opacity: 0.28;
          pointer-events: none;
        }

        /* ── Login card ── */
        .login-card {
          max-width: 540px;
          position: relative;
          width: 100%;
          z-index: 1;
        }
        .brand-row {
          align-items: flex-start;
          display: inline-flex;
          flex-direction: column;
          gap: 9px;
          padding: 8px 14px;
        }
        .brand-logo {
          height: 56px;
          width: auto;
          object-fit: contain;
          filter: brightness(1.1);
        }
        .portal-pill {
          position: absolute;
          right: 14px;
          top: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
        }
        .portal-pill span {
          background: var(--gold);
          border-radius: 50%;
          box-shadow: 0 0 16px rgba(213,168,87,0.8);
          height: 8px;
          width: 8px;
          flex-shrink: 0;
        }
        .login-card h1 {
          color: var(--ivory);
          font-family: Georgia, 'Times New Roman', serif;
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          margin: 8px 14px 0;
          font-size: clamp(36px, 4vw, 48px);
        }
        .login-copy {
          font-size: 14px;
          line-height: 1.65;
          margin: 12px 14px 24px;
          color: #aebdcc;
          max-width: 460px;
        }

        /* ── Form ── */
        .login-form {
          display: grid;
          gap: 12px;
          padding: 0 14px;
        }
        .login-error {
          background: rgba(255,80,80,0.1);
          border: 1px solid rgba(255,80,80,0.32);
          border-radius: 10px;
          color: #ffb4a8;
          font-size: 13px;
          line-height: 1.45;
          padding: 11px 14px;
        }
        .login-form label {
          color: #d9e1e8;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.09em;
          margin-top: 6px;
          text-transform: uppercase;
        }
        .input-shell {
          align-items: center;
          background: rgba(238,244,255,0.07);
          border: 1px solid rgba(213,168,87,0.2);
          border-radius: 12px;
          color: #86a0b8;
          display: flex;
          gap: 12px;
          min-height: 50px;
          padding: 0 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-shell:focus-within {
          border-color: rgba(213,168,87,0.65);
          box-shadow: 0 0 0 4px rgba(213,168,87,0.1);
        }
        .input-shell svg { flex: 0 0 auto; height: 18px; width: 18px; }
        .input-shell input {
          background: transparent;
          border: 0;
          color: #e8edf3;
          flex: 1;
          font-size: 14px;
          min-width: 0;
          outline: 0;
        }
        .input-shell input::placeholder { color: #4a6070; }
        .password-toggle {
          align-items: center;
          background: transparent;
          border: 0;
          color: #86a0b8;
          cursor: pointer;
          display: flex;
          flex: 0 0 auto;
          justify-content: center;
          margin: 0; padding: 0;
        }
        .password-toggle:hover { color: var(--gold); }
        .eye-icon { margin-left: auto; }
        .login-form > button[type="submit"] {
          align-items: center;
          background: linear-gradient(135deg, var(--gold), #b98132);
          border: 0;
          border-radius: 12px;
          box-shadow: 0 16px 40px rgba(213,168,87,0.22);
          color: #060f12;
          cursor: pointer;
          display: flex;
          font-size: 15px;
          font-weight: 800;
          gap: 10px;
          justify-content: center;
          margin-top: 8px;
          min-height: 52px;
          transition: transform 0.2s, box-shadow 0.2s;
          letter-spacing: 0.02em;
        }
        .login-form > button[type="submit"]:hover {
          box-shadow: 0 22px 50px rgba(213,168,87,0.3);
          transform: translateY(-1px);
        }
        .login-form > button[type="submit"]:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
        }
        .login-form > button[type="submit"] svg,
        .login-form .password-toggle svg { height: 19px; width: 19px; }

        /* ── Bottom links ── */
        .login-links {
          border-top: 1px solid var(--line);
          display: flex;
          justify-content: space-between;
          margin: 28px 14px 0;
          padding-top: 20px;
        }
        .login-links a {
          font-size: 13px;
          color: #aebdcc;
          text-decoration: none;
          transition: color 0.2s;
        }
        .login-links a:hover { color: var(--gold); }

        /* ── Info side ── */
        .info-side {
          align-items: center;
          background:
            linear-gradient(rgba(4,18,24,0.92), rgba(4,18,24,0.94)),
            url('/hotel-img/9b80559ce359f116.jpg') center / cover no-repeat;
          display: flex;
          padding: clamp(24px, 4vw, 56px);
        }
        .info-inner {
          max-width: 600px;
          position: relative;
          width: 100%;
          z-index: 1;
        }
        .section-pill {
          align-items: center;
          color: var(--gold);
          display: flex;
          font-size: 13px;
          gap: 8px;
          letter-spacing: 0.04em;
          margin-bottom: 22px;
          text-transform: uppercase;
        }
        .section-pill svg { height: 18px; width: 18px; }
        .info-inner h2 {
          color: var(--ivory);
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(30px, 3.2vw, 44px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.05;
          margin: 0;
          max-width: 560px;
        }
        .info-copy {
          color: #aebdcc;
          font-size: 15px;
          line-height: 1.65;
          margin: 18px 0 28px;
          max-width: 560px;
        }
        .feature-list { display: grid; gap: 12px; }
        .feature-card {
          align-items: center;
          background: rgba(5,30,38,0.72);
          border: 1px solid var(--line);
          border-radius: 14px;
          display: flex;
          gap: 16px;
          padding: 14px 16px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .feature-card:hover {
          border-color: rgba(213,168,87,0.42);
          transform: translateY(-1px);
        }
        .feature-icon {
          align-items: center;
          background: rgba(213,168,87,0.1);
          border-radius: 10px;
          color: var(--gold);
          display: flex;
          flex: 0 0 auto;
          height: 40px;
          justify-content: center;
          width: 40px;
        }
        .feature-icon svg { height: 18px; width: 18px; }
        .feature-card h3 {
          color: var(--ivory);
          font-family: Georgia, 'Times New Roman', serif;
          font-size: 15px;
          margin: 0 0 4px;
        }
        .feature-card p {
          color: #aebdcc;
          font-size: 13px;
          line-height: 1.45;
          margin: 0;
        }
        .portal-meta {
          border-top: 1px solid var(--line);
          display: flex;
          gap: 24px;
          justify-content: space-between;
          margin-top: 40px;
          padding-top: 20px;
        }
        .portal-meta p { color: #aebdcc; font-size: 14px; margin: 0; }
        .portal-meta strong { color: var(--gold); }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .kalptree-admin {
            position: static;
            grid-template-columns: 1fr;
            overflow: visible;
            height: auto;
            min-height: 100dvh;
          }
          .login-side, .info-side { min-height: auto; }
          .login-side {
            border-bottom: 1px solid var(--line);
            border-right: 0;
          }
          .portal-pill { margin-bottom: 0; }
        }
        @media (max-width: 580px) {
          .login-side, .info-side { padding: 28px 18px; }
          .brand-logo { height: 44px; }
          .login-links, .portal-meta {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }
        }
      `}</style>
    </main>
  );
}
