"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SelectField } from "@/components/ui/select-field";
import { reportStatusDisplay } from "@/lib/status";
import type { ReportStatus } from "@/types/api";
import { ReportCard, type ReportView } from "@/components/warga/status/report-card";
import { StatusLegend } from "@/components/warga/status/status-legend";

type PointOption = {
  id: string;
  label: string;
};

type StatusExplorerProps = {
  reports: ReportView[];
  points: PointOption[];
};

const urutanStatus: ReportStatus[] = [
  "PENDING",
  "IN_PROGRESS",
  "COMPLETED",
  "REJECTED",
];

/**
 * Pulau client untuk halaman Cek Status: pencarian, filter, dan urutan
 * dikerjakan di browser supaya interaksinya langsung terasa.
 */
export function StatusExplorer({ reports, points }: StatusExplorerProps) {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [pointId, setPointId] = useState("all");
  const [status, setStatus] = useState<"all" | ReportStatus>("all");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");

  const hasFilter =
    query.length > 0 || pointId !== "all" || status !== "all" || sort !== "newest";

  const reset = () => {
    setInput("");
    setQuery("");
    setPointId("all");
    setStatus("all");
    setSort("newest");
  };

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    const filtered = reports.filter((report) => {
      const haystack = [
        report.title,
        report.reportCode,
        report.pointLabel,
        report.category ?? "",
      ]
        .join(" ")
        .toLowerCase();

      const matchesQuery = needle.length === 0 || haystack.includes(needle);
      const matchesPoint = pointId === "all" || report.wastePoint.id === pointId;
      const matchesStatus = status === "all" || report.status === status;

      return matchesQuery && matchesPoint && matchesStatus;
    });

    return filtered.sort((a, b) => {
      const diff =
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();

      return sort === "newest" ? -diff : diff;
    });
  }, [reports, query, pointId, status, sort]);

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(input);
        }}
        aria-label="Pencarian dan filter laporan"
        className="mt-8 rounded-card border border-line bg-surface p-4 sm:p-5"
      >
        <label
          htmlFor="cari-laporan"
          className="block text-caption font-medium text-ink-muted"
        >
          Cari laporan
        </label>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
          <input
            id="cari-laporan"
            type="search"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Cari nomor laporan, kategori, atau kode titik…"
            className="min-h-[52px] w-full flex-1 rounded-[10px] border border-line-strong bg-surface px-3 text-body text-ink placeholder:text-ink-subtle"
          />
          <Button type="submit" className="min-h-[52px] shrink-0">
            Cari
          </Button>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <SelectField
            id="filter-titik"
            label="Titik sampah"
            value={pointId}
            onChange={(event) => setPointId(event.target.value)}
          >
            <option value="all">Semua titik</option>
            {points.map((point) => (
              <option key={point.id} value={point.id}>
                {point.label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="filter-status"
            label="Status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "all" | ReportStatus)
            }
          >
            <option value="all">Semua status</option>
            {urutanStatus.map((value) => (
              <option key={value} value={value}>
                {reportStatusDisplay[value].label}
              </option>
            ))}
          </SelectField>

          <SelectField
            id="filter-urutan"
            label="Urutan"
            value={sort}
            onChange={(event) =>
              setSort(event.target.value as "newest" | "oldest")
            }
          >
            <option value="newest">Terbaru</option>
            <option value="oldest">Terlama</option>
          </SelectField>
        </div>

        {hasFilter ? (
          <button
            type="button"
            onClick={reset}
            className="mt-3 inline-flex min-h-11 items-center text-caption font-semibold text-brand hover:underline"
          >
            Atur ulang filter
          </button>
        ) : null}
      </form>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        <section aria-labelledby="laporan-terbaru-judul">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2
              id="laporan-terbaru-judul"
              className="text-section-title font-semibold text-ink"
            >
              Laporan terbaru
            </h2>

            <p
              role="status"
              aria-live="polite"
              className="text-caption text-ink-muted"
            >
              Menampilkan {visible.length} dari {reports.length} laporan
            </p>
          </div>

          {visible.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {visible.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
            </ul>
          ) : (
            <Card className="mt-4 p-6">
              <p className="text-body text-ink">
                Tidak ada laporan yang cocok dengan pencarian Anda.
              </p>
              <p className="mt-1 text-caption text-ink-muted">
                Coba kata kunci lain, atau atur ulang filter di atas.
              </p>
              <Button
                variant="outline"
                size="md"
                className="mt-4"
                onClick={reset}
              >
                Atur ulang filter
              </Button>
            </Card>
          )}
        </section>

        <StatusLegend />
      </div>
    </>
  );
}
