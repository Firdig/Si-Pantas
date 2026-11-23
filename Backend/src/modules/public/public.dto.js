const STATUS_LABELS = {
  PENDING: "Dalam Antrean",
  IN_PROGRESS: "Proses Tindak Lanjut",
  COMPLETED: "Selesai",
};

export function toPublicWastePointDto(point) {
  return {
    id: point.id,
    name: point.name,
    address: point.address,
    latitude: point.latitude !== null ? Number(point.latitude) : null,
    longitude: point.longitude !== null ? Number(point.longitude) : null,
    photoUrl: point.photoUrl,
  };
}

export function toPublicReportSummaryDto(report) {
  return {
    reportCode: report.reportCode,
    category: report.category,
    status: report.status,
    statusLabel: STATUS_LABELS[report.status] || report.status,
    wastePoint: report.wastePoint
      ? {
          id: report.wastePoint.id,
          name: report.wastePoint.name,
          address: report.wastePoint.address,
        }
      : null,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}

export function toPublicReportDetailDto(report) {
  return {
    reportCode: report.reportCode,
    category: report.category,
    description: report.description,
    status: report.status,
    statusLabel: STATUS_LABELS[report.status] || report.status,
    wastePoint: report.wastePoint ? toPublicWastePointDto(report.wastePoint) : null,
    photos: (report.photos || []).map((photo) => ({
      id: photo.id,
      storageKey: photo.storageKey,
      createdAt: photo.createdAt,
    })),
    statusHistories: (report.histories || []).map((history) => ({
      oldStatus: history.oldStatus,
      newStatus: history.newStatus,
      newStatusLabel: STATUS_LABELS[history.newStatus] || history.newStatus,
      note: history.note,
      createdAt: history.createdAt,
    })),
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
  };
}

export function toPublicEducationSummaryDto(item) {
  return {
    id: item.id,
    title: item.title,
    slug: item.slug,
    category: item.category,
    imageUrl: item.imageUrl,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  };
}

export function toPublicEducationDetailDto(item) {
  return {
    ...toPublicEducationSummaryDto(item),
    content: item.content,
  };
}
