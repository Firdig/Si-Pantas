function parseSequenceNumber(code, prefix) {
  if (!code || !code.startsWith(prefix)) {
    return 0;
  }
  const numPart = Number.parseInt(code.slice(prefix.length), 10);
  return Number.isNaN(numPart) ? 0 : numPart;
}

function formatCode(prefix, sequence) {
  return `${prefix}${String(sequence).padStart(3, "0")}`;
}

/**
 * Menghasilkan 1 kode grup (GRP-YYYY-XXX) dan N kode laporan (RPT-YYYY-XXX)
 * secara aman terhadap concurrency menggunakan PostgreSQL advisory transaction lock.
 * Wajib dipanggil di dalam `prisma.$transaction`.
 */
export async function generateGroupAndReportCodes(tx, reportCount) {
  const year = new Date().getFullYear();
  const groupPrefix = `GRP-${year}-`;
  const reportPrefix = `RPT-${year}-`;

  // Kunci transaksi spesifik per tahun untuk mencegah duplikasi kode saat request bersamaan
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${`sipantas_codes_${year}`}))`;

  const [lastGroup, lastReport] = await Promise.all([
    tx.reportGroup.findFirst({
      where: { groupCode: { startsWith: groupPrefix } },
      orderBy: { groupCode: "desc" },
      select: { groupCode: true },
    }),
    tx.report.findFirst({
      where: { reportCode: { startsWith: reportPrefix } },
      orderBy: { reportCode: "desc" },
      select: { reportCode: true },
    }),
  ]);

  const nextGroupSeq = parseSequenceNumber(lastGroup?.groupCode, groupPrefix) + 1;
  const startReportSeq = parseSequenceNumber(lastReport?.reportCode, reportPrefix) + 1;

  const groupCode = formatCode(groupPrefix, nextGroupSeq);
  const reportCodes = Array.from({ length: reportCount }, (_, idx) =>
    formatCode(reportPrefix, startReportSeq + idx)
  );

  return { groupCode, reportCodes };
}
