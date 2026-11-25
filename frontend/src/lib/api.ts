import type { ApiResponse } from "@/types/api";

/**
 * Base URL API backend (Express).
 *
 * Hanya dipakai dari Server Component / fungsi server, jadi **jangan**
 * memakai prefix `NEXT_PUBLIC_` — URL internal tidak perlu ikut ke browser.
 * Ubah lewat `API_BASE_URL` di `.env.local`.
 */
export const API_BASE_URL = (
  process.env.API_BASE_URL ?? "http://localhost:5000/api/v1"
).replace(/\/+$/, "");

/** Error dari backend (`sendError`) atau dari jaringan/timeout. */
export class ApiError extends Error {
  readonly status: number;
  readonly code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

type QueryValue = string | number | boolean | null | undefined;

type ApiGetOptions = {
  query?: Record<string, QueryValue>;
  /** Batas waktu request. Default 10 detik. */
  timeoutMs?: number;
};

function buildUrl(path: string, query?: Record<string, QueryValue>): URL {
  const url = new URL(`${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`);

  for (const [key, value] of Object.entries(query ?? {})) {
    if (value === null || value === undefined || value === "") continue;
    url.searchParams.set(key, String(value));
  }

  return url;
}

/**
 * GET ke API backend dan kembalikan seluruh envelope response
 * (`{ success, message, data, meta }`).
 *
 * Melempar `ApiError` bila status bukan 2xx atau `success` bernilai false.
 */
export async function apiGet<T>(
  path: string,
  { query, timeoutMs = 10_000 }: ApiGetOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildUrl(path, query);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(timeoutMs),
      // Cache ditangani oleh `'use cache'` di src/lib/edukasi.ts.
      cache: "no-store",
    });
  } catch (error) {
    const reason = error instanceof Error ? error.message : "tidak diketahui";
    throw new ApiError(
      `Tidak bisa menghubungi API ${url.origin}. Pastikan backend berjalan. (${reason})`,
      0,
      "NETWORK_ERROR",
    );
  }

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | null;

  if (!response.ok || !payload?.success) {
    throw new ApiError(
      payload?.message ?? `Request gagal dengan status ${response.status}`,
      response.status,
      payload?.error?.code,
    );
  }

  return payload;
}
