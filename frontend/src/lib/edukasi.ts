"use cache";

import { cacheLife, cacheTag } from "next/cache";
import { ApiError, apiGet } from "@/lib/api";
import type { EducationDetail, EducationSummary } from "@/types/api";

/**
 * Data edukasi publik.
 *
 * Endpoint backend (lihat Backend/src/modules/public/public.routes.js):
 * - GET /api/v1/public/education
 * - GET /api/v1/public/education/:slug
 *
 * Backend hanya mengirim konten berstatus PUBLISHED, jadi frontend tidak
 * perlu memfilter status lagi.
 *
 * `'use cache'` di level file membuat hasil kedua fungsi ikut masuk static
 * shell (Cache Components). Isi baru dari operator muncul paling lambat
 * setelah masa `cacheLife` habis (±1 menit).
 */

const CACHE_TAG = "edukasi";

/** Maksimum `limit` yang diizinkan backend. */
const MAKS_ARTIKEL = 100;

export async function getDaftarEdukasi(): Promise<EducationSummary[]> {
  cacheLife("minutes");
  cacheTag(CACHE_TAG);

  try {
    const { data } = await apiGet<EducationSummary[]>("/public/education", {
      query: { limit: MAKS_ARTIKEL },
    });

    return data;
  } catch (error) {
    // Jangan gagalkan render/build hanya karena backend belum menyala.
    console.error("[edukasi] Gagal mengambil daftar konten:", error);
    return [];
  }
}

export async function getEdukasiBySlug(
  slug: string,
): Promise<EducationDetail | null> {
  cacheLife("minutes");
  cacheTag(CACHE_TAG);

  try {
    const { data } = await apiGet<EducationDetail>(
      `/public/education/${encodeURIComponent(slug)}`,
    );

    return data;
  } catch (error) {
    // 404 = slug tidak ada / belum PUBLISHED → tampilkan halaman notFound.
    if (error instanceof ApiError && error.status === 404) {
      return null;
    }

    console.error(`[edukasi] Gagal mengambil artikel "${slug}":`, error);
    return null;
  }
}
