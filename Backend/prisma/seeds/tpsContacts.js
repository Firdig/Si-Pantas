const tpsContacts = [
  {
    name: "TPS Merdeka",
    phoneNumber: "6281111111111",
    isActive: true,
  },
  {
    name: "TPS Melati",
    phoneNumber: "6281222222222",
    isActive: true,
  },
  {
    name: "TPS Mawar",
    phoneNumber: "6281333333333",
    isActive: true,
  },
  {
    name: "TPS Cemara",
    phoneNumber: "6281444444444",
    isActive: true,
  },
  {
    name: "TPS Sejahtera",
    phoneNumber: "6281555555555",
    isActive: false,
  },
];

export async function seedTpsContacts(prisma) {
  for (const contact of tpsContacts) {
    await prisma.tpsContact.upsert({
      where: { phoneNumber: contact.phoneNumber },
      update: {
        name: contact.name,
        isActive: contact.isActive,
      },
      create: contact,
    });
  }

  console.log(
    `[Seed] ${tpsContacts.length} kontak TPS siap ditanamkan.`,
  );
}
