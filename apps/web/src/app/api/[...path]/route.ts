import { type NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function rewriteCookies(
  setCookies: string[],
  _requestOrigin: string
): string[] {
  return setCookies.map((sc) => {
    // Rewrite cookie domain to the frontend origin so the browser
    // stores the session cookie for our domain, not the backend domain.
    let rewritten = sc
      // Remove any explicit Domain= attribute
      .replace(/Domain=[^;]+;?\s*/gi, "")
      // Replace any Secure flag on HTTP localhost (dev) with empty
      .replace(/Secure;?\s*/gi, process.env.NODE_ENV !== "production" ? "" : "Secure; ");

    // If the cookie doesn't have a Path, add one
    if (!/Path=/i.test(rewritten)) {
      rewritten = `${rewritten}; Path=/`;
    }

    // Ensure SameSite=Lax for cross-origin proxy compatibility
    if (!/SameSite=/i.test(rewritten)) {
      rewritten = `${rewritten}; SameSite=Lax`;
    }

    return rewritten;
  });
}

async function proxyRequest(request: NextRequest, path: string): Promise<NextResponse> {
  const backendUrl = `${BACKEND_URL}/api/${path}`;
  const headers = new Headers();

  // Forward relevant headers from the original request
  const forwardableHeaders = [
    "content-type",
    "accept",
    "authorization",
    "x-requested-with",
    "cache-control",
  ];
  for (const h of forwardableHeaders) {
    const value = request.headers.get(h);
    if (value) headers.set(h, value);
  }

  // Forward cookies from the browser
  const cookie = request.headers.get("cookie");
  if (cookie) headers.set("cookie", cookie);

  // Set the origin header so the backend's CORS check sees the frontend origin
  headers.set("origin", BACKEND_URL);

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "follow",
  };

  // Forward body for non-GET/HEAD requests
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
    // @ts-expect-error duplex is needed for streaming body with fetch
    init.duplex = "half";
  }

  let backendResponse: Response;
  try {
    backendResponse = await fetch(backendUrl, init);
  } catch {
    return NextResponse.json(
      { success: false, error: { code: "BAD_GATEWAY", message: "Backend unreachable" } },
      { status: 502 }
    );
  }

  // Build the response to send back to the browser
  const responseHeaders = new Headers();

  // Forward content-type
  const contentType = backendResponse.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);

  // Forward Set-Cookie headers, rewriting them for the frontend domain
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- getSetCookie may not exist in all runtimes
  const setCookies = backendResponse.headers.getSetCookie?.() ?? [];
  if (setCookies.length > 0) {
    const origin = request.nextUrl.origin;
    const rewritten = rewriteCookies(setCookies, origin);
    for (const sc of rewritten) {
      responseHeaders.append("set-cookie", sc);
    }
  }

  return new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join("/"));
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join("/"));
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join("/"));
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join("/"));
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return proxyRequest(request, path.join("/"));
}
