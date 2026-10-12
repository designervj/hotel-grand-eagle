"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { generateCodeChallenge, generateCodeVerifier } from "@/lib/pkce";

export default function KalptreeLoginForm() {
  const router = useRouter();
  const [email, setEmail]               = useState("grandeaglehotel@gmail.com");
  const [password, setPassword]         = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const tenantSlug   = (process.env.NEXT_PUBLIC_TENANT_SLUG  || "hotel-grand-eagle").trim();
  const tenantId     = (process.env.NEXT_PUBLIC_TENANT_ID    || "kp_hote_grand_eagle").trim();
  const rawAdminUrl  =  process.env.NEXT_PUBLIC_ADMIN_URL    || "https://zerolive.kalptree.xyz";
  const adminBaseUrl = rawAdminUrl.trim().replace(/^['\"]+|['\"]+$/g, "").replace(/\/+$/, "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setError("");
    setLoading(true);

    try {
      const rawApiBase = (
        process.env.NEXT_PUBLIC_API_BASE_URL || "https://bizlive.kalptree.xyz"
      ).replace(/\/+$/, "");

      const authApiUrl = rawApiBase.endsWith("/api")
        ? `${rawApiBase}/auth`
        : `${rawApiBase}/api/auth`;

      const loginRes = await fetch(`${authApiUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type":   "application/json",
          accept:           "application/json",
          "x-tenant-db":    tenantId,
          "x-tenant-slug":  tenantSlug,
        },
        body: JSON.stringify({
          email:          email.trim(),
          password,
          tenant_slug:    tenantSlug,
          keepSignedIn:   false,
          keep_signed_in: false,
        }),
      });

      const loginData = await loginRes.json().catch(() => ({}));

      if (!loginRes.ok || !loginData.access_token) {
        throw new Error(
          loginData.detail || loginData.message || "Invalid credentials or unauthorized access."
        );
      }

      const token   = loginData.access_token;
      const maxAge  = 60 * 60 * 24 * 30;

      document.cookie = `auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `${tenantId}_auth_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `auth_token_${tenantId}=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      document.cookie = `admin_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
      try { localStorage.setItem("auth_token", token); } catch {}

      const codeVerifier   = generateCodeVerifier();
      const codeChallenge  = await generateCodeChallenge(codeVerifier);
      const targetDashboard = `/canvas/${tenantSlug}/home`;
      const redirectUri    = `${adminBaseUrl}/auth/callback`;

      const ssoRes = await fetch("/api/auth/sso/create", {
        method: "POST",
        headers: {
          "Content-Type":   "application/json",
          Authorization:    `Bearer ${token}`,
          "x-tenant-db":    tenantId,
          "x-tenant-slug":  tenantSlug,
        },
        body: JSON.stringify({
          redirectUri,
          codeChallenge,
          codeVerifier,
          returnTo: targetDashboard,
          redirect: targetDashboard,
        }),
      });

      const ssoData = await ssoRes.json().catch(() => ({}));

      if (!ssoRes.ok || !ssoData.success || !ssoData.code) {
        throw new Error(
          ssoData.detail || ssoData.message || "Failed to establish admin session. Please try again."
        );
      }

      const callbackUrl = `${redirectUri}?code=${encodeURIComponent(ssoData.code)}&returnTo=${encodeURIComponent(targetDashboard)}&redirect=${encodeURIComponent(targetDashboard)}&next=${encodeURIComponent(targetDashboard)}`;
      window.location.href = callbackUrl;
    } catch (err: any) {
      console.error("[KalptreeLogin] Error:", err);
      setError(err.message || "Login failed. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      {error && <div className="login-error" role="alert">{error}</div>}

      <label htmlFor="kt-email">Email Address</label>
      <div className="input-shell">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 6h16v12H4z" />
          <path d="m4 7 8 6 8-6" />
        </svg>
        <input
          id="kt-email"
          name="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
      </div>

      <label htmlFor="kt-password">Password</label>
      <div className="input-shell">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="5" y="10" width="14" height="10" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        <input
          id="kt-password"
          name="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={e => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <button
          className="password-toggle"
          type="button"
          onClick={() => setShowPassword(s => !s)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <svg className="eye-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Signing In…" : "Sign In to Dashboard"}
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
