const wastePoints = [
  {
    name: "TPS Merdeka",
    address: "Jl. Merdeka No. 10, Kota Bandung",
    latitude: "-6.914744",
    longitude: "107.609810",
    photoUrl: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b",
    isActive: true,
  },
  {
    name: "TPS Melati",
    address: "Jl. Melati Raya No. 25, Kota Bandung",
    latitude: "-6.920345",
    longitude: "107.606234",
    photoUrl: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
    isActive: true,
  },
  {
    name: "TPS Mawar",
    address: "Jl. Mawar Indah No. 8, Kota Bandung",
    latitude: "-6.901278",
    longitude: "107.618421",
    photoUrl: null,
    isActive: true,
  },
  {
    name: "TPS Cemara",
    address: "Jl. Cemara Hijau No. 16, Kota Bandung",
    latitude: "-6.927810",
    longitude: "107.617902",
    photoUrl: null,
    isActive: true,
  },
  {
    name: "TPS Sejahtera",
    address: "Jl. Sejahtera No. 30, Kota Bandung",
    latitude: "-6.908155",
    longitude: "107.598713",
    photoUrl: null,
    isActive: false,
  },
];

export async function seedWastePoints(prisma) {
  for (const point of wastePoints) {
    const existing = await prisma.wastePoint.findFirst({
      where: {
        name: point.name,
        address: point.address,
      },
    });

    if (existing) {
      await prisma.wastePoint.update({
        where: { id: existing.id },
        data: {
          latitude: point.latitude,
          longitude: point.longitude,
          photoUrl: point.photoUrl,
          isActive: point.isActive,
        },
      });
    } else {
      await prisma.wastePoint.create({
        data: point,
      });
    }
  }

  console.log(
    `[Seed] ${wastePoints.length} titik sampah siap ditanamkan.`,
  );
}
