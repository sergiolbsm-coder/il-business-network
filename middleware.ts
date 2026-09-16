import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgot-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Injeta o pathname no header para o layout acessar (next/headers não tem pathname)
  const response = NextResponse.next();
  response.headers.set("x-pathname", pathname);

  // Rotas públicas passam direto
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    return response;
  }

  // Arquivos estáticos e API passam direto
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return response;
  }

  // Verifica sessão
  const token = request.cookies.get("session_token")?.value;
  if (!token && pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
