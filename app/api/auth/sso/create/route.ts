import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.FASTAPI_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://bizlive.kalptree.xyz";

export async function POST(req: NextRequest) {
  try {
    const rawBase = API_BASE_URL.replace(/\/+$/, "");
    const url = `${rawBase}/auth/sso/create`;

    const body = await req.json().catch(() => ({}));

    const tenantDb =
      req.headers.get("x-tenant-db") ||
      process.env.NEXT_PUBLIC_TENANT_ID ||
      process.env.MONGODB_DB ||
      "kp_hote_grand_eagle";

    const tenantSlug =
      req.headers.get("x-tenant-slug") ||
      process.env.NEXT_PUBLIC_TENANT_SLUG ||
      "hotel-grand-eagle";

    const authHeader = req.headers.get("authorization");

    const headers: Record<string, string> = {
      "Content-Type":  "application/json",
      accept:          "application/json",
      "x-tenant-db":   tenantDb,
      "x-tenant-slug": tenantSlug,
    };

    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => ({}));

    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    console.error("[SSO Create Proxy Error]:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Failed to establish SSO session" },
      { status: 500 }
    );
  }
}
