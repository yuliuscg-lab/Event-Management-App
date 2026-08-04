/**
 * seed-dummy-data.ts
 *
 * Seed script untuk mengisi Neon DB (via Prisma) dengan data dummy:
 * - 30 Event
 * - 30 SalesOrder ("transaksi"), lengkap dengan Payment & IssuedTicket
 *
 * Cara pakai:
 *   1. Taruh file ini persis di `backend/prisma/seed-dummy-data.ts` (script ini
 *      mengimpor client dari `../src/config/prisma`, jadi lokasinya penting).
 *   2. Pastikan `backend/.env` sudah berisi `APP_DATABASE_URL` (dipakai oleh
 *      `src/config/prisma.ts` lewat pg Pool + adapter-pg).
 *   3. Jalankan dari folder `backend`:
 *        npx tsx prisma/seed-dummy-data.ts
 *
 * Script ini AMAN dijalankan berkali-kali untuk Category & Venue (pakai upsert).
 * Untuk Event & SalesOrder, script akan skip proses seeding kalau sudah ada
 * event dengan judul yang sama persis (lihat cek EVENT_TEMPLATES di bawah),
 * supaya tidak dobel kalau script dijalankan ulang.
 *
 * User (customer/organizer) TIDAK dibuat baru secara default — script akan
 * memakai user yang SUDAH ADA di database (role CUSTOMER & ORGANIZER).
 * Kalau user yang ditemukan kurang dari yang dibutuhkan, script akan otomatis
 * membuat beberapa user dummy tambahan (lihat ensureMinimumUsers()).
 */

import type {
  EventStatus,
  SalesOrderStatus,
  PaymentStatus,
  PaymentMethod,
} from "@prisma/client";
import { prisma } from "../src/config/prisma";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function pad(n: number, len = 4): string {
  return n.toString().padStart(len, "0");
}

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function atTime(date: Date, hour: number, minute = 0): Date {
  const d = new Date(date);
  d.setHours(hour, minute, 0, 0);
  return d;
}

const TODAY = new Date(); // "today" saat script dijalankan

// ---------------------------------------------------------------------------
// Reference data: Category & Venue
// ---------------------------------------------------------------------------

const CATEGORY_NAMES = [
  "Musik",
  "Olahraga",
  "Workshop",
  "Konferensi",
  "Festival",
  "Teater",
  "Pameran",
] as const;

const VENUES = [
  {
    venueName: "Istora Senayan",
    venueAddress: "Jl. Pintu Satu Senayan",
    venueCity: "Jakarta",
    venueState: "DKI Jakarta",
    venueZipCode: "10270",
    venuePhone: "0211234567",
    venueEmail: "info@istorasenayan.com",
    venueGMapsUrl: "https://maps.google.com/?q=Istora+Senayan",
    capacity: 8000,
  },
  {
    venueName: "Sasana Budaya Ganesha",
    venueAddress: "Jl. Taman Sari No.73",
    venueCity: "Bandung",
    venueState: "Jawa Barat",
    venueZipCode: "40132",
    venuePhone: "0222501175",
    venueEmail: "info@sabuga.com",
    venueGMapsUrl: "https://maps.google.com/?q=Sasana+Budaya+Ganesha",
    capacity: 3000,
  },
  {
    venueName: "Grand City Convex",
    venueAddress: "Jl. Walikota Mustajab No.1",
    venueCity: "Surabaya",
    venueState: "Jawa Timur",
    venueZipCode: "60272",
    venuePhone: "0315491000",
    venueEmail: "info@grandcityconvex.com",
    venueGMapsUrl: "https://maps.google.com/?q=Grand+City+Convex",
    capacity: 5000,
  },
  {
    venueName: "Bali Nusa Dua Convention Center",
    venueAddress: "Kawasan ITDC, Nusa Dua",
    venueCity: "Badung",
    venueState: "Bali",
    venueZipCode: "80363",
    venuePhone: "0361771888",
    venueEmail: "info@bndcc.co.id",
    venueGMapsUrl: "https://maps.google.com/?q=Bali+Nusa+Dua+Convention+Center",
    capacity: 6000,
  },
  {
    venueName: "Jogja Expo Center",
    venueAddress: "Jl. Raya Janti",
    venueCity: "Yogyakarta",
    venueState: "DI Yogyakarta",
    venueZipCode: "55198",
    venuePhone: "0274451888",
    venueEmail: "info@jec.co.id",
    venueGMapsUrl: "https://maps.google.com/?q=Jogja+Expo+Center",
    capacity: 4000,
  },
  {
    venueName: "ICE BSD",
    venueAddress: "BSD City",
    venueCity: "Tangerang",
    venueState: "Banten",
    venueZipCode: "15345",
    venuePhone: "0215316188",
    venueEmail: "info@ice-bsd.com",
    venueGMapsUrl: "https://maps.google.com/?q=ICE+BSD",
    capacity: 10000,
  },
];

// ---------------------------------------------------------------------------
// 30 Event templates
// dayOffset: posisi tanggal event relatif ke hari ini (negatif = sudah lewat)
// ---------------------------------------------------------------------------

type EventTemplate = {
  title: string;
  category: (typeof CATEGORY_NAMES)[number];
  venueIndex: number;
  dayOffset: number;
  ticketTypes: { name: string; price: number; quota: number }[];
};

const EVENT_TEMPLATES: EventTemplate[] = [
  { title: "Jakarta Music Festival 2026", category: "Musik", venueIndex: 0, dayOffset: 45, ticketTypes: [{ name: "Regular", price: 350000, quota: 2000 }, { name: "VIP", price: 850000, quota: 300 }] },
  { title: "Synchronize Fest Bandung", category: "Musik", venueIndex: 1, dayOffset: -12, ticketTypes: [{ name: "Regular", price: 400000, quota: 1500 }, { name: "VIP", price: 950000, quota: 250 }] },
  { title: "Konser Amal Suara Untuk Negeri", category: "Musik", venueIndex: 0, dayOffset: 20, ticketTypes: [{ name: "Regular", price: 150000, quota: 3000 }] },
  { title: "We The Fest Jakarta 2026", category: "Musik", venueIndex: 5, dayOffset: 70, ticketTypes: [{ name: "Regular", price: 500000, quota: 4000 }, { name: "VIP", price: 1200000, quota: 500 }] },
  { title: "Java Jazz Festival 2026", category: "Musik", venueIndex: 5, dayOffset: -30, ticketTypes: [{ name: "Regular", price: 450000, quota: 3500 }, { name: "VIP", price: 1000000, quota: 400 }] },
  { title: "Konser Tunggal Akustik Senja", category: "Musik", venueIndex: 1, dayOffset: 5, ticketTypes: [{ name: "Regular", price: 200000, quota: 1200 }] },
  { title: "Jakarta Marathon 2026", category: "Olahraga", venueIndex: 0, dayOffset: 60, ticketTypes: [{ name: "5K", price: 175000, quota: 2000 }, { name: "10K", price: 250000, quota: 1500 }, { name: "Full Marathon", price: 450000, quota: 800 }] },
  { title: "Turnamen Badminton Nasional", category: "Olahraga", venueIndex: 2, dayOffset: -5, ticketTypes: [{ name: "Regular", price: 75000, quota: 2500 }] },
  { title: "Fun Run 10K Bandung", category: "Olahraga", venueIndex: 1, dayOffset: 15, ticketTypes: [{ name: "Regular", price: 150000, quota: 1800 }] },
  { title: "Liga Futsal Antar Komunitas", category: "Olahraga", venueIndex: 2, dayOffset: -20, ticketTypes: [{ name: "Regular", price: 50000, quota: 1000 }] },
  { title: "Workshop UI/UX Design Fundamentals", category: "Workshop", venueIndex: 4, dayOffset: 10, ticketTypes: [{ name: "Regular", price: 300000, quota: 150 }] },
  { title: "Pelatihan Digital Marketing untuk UMKM", category: "Workshop", venueIndex: 2, dayOffset: -8, ticketTypes: [{ name: "Regular", price: 250000, quota: 200 }] },
  { title: "Workshop Fotografi Dasar", category: "Workshop", venueIndex: 1, dayOffset: 25, ticketTypes: [{ name: "Regular", price: 275000, quota: 100 }] },
  { title: "Bootcamp Web Development Intensif", category: "Workshop", venueIndex: 0, dayOffset: -40, ticketTypes: [{ name: "Regular", price: 1500000, quota: 80 }] },
  { title: "Workshop Public Speaking untuk Profesional", category: "Workshop", venueIndex: 4, dayOffset: 33, ticketTypes: [{ name: "Regular", price: 350000, quota: 120 }] },
  { title: "Tech Conference Indonesia 2026", category: "Konferensi", venueIndex: 0, dayOffset: 50, ticketTypes: [{ name: "Regular", price: 750000, quota: 1000 }, { name: "VIP", price: 1800000, quota: 150 }] },
  { title: "Startup Summit Jakarta", category: "Konferensi", venueIndex: 5, dayOffset: -15, ticketTypes: [{ name: "Regular", price: 500000, quota: 800 }] },
  { title: "HR Conference Nasional 2026", category: "Konferensi", venueIndex: 2, dayOffset: 18, ticketTypes: [{ name: "Regular", price: 600000, quota: 600 }] },
  { title: "Conference on AI and The Future of Work", category: "Konferensi", venueIndex: 0, dayOffset: -3, ticketTypes: [{ name: "Regular", price: 850000, quota: 700 }, { name: "VIP", price: 2000000, quota: 100 }] },
  { title: "Festival Kuliner Nusantara", category: "Festival", venueIndex: 4, dayOffset: 8, ticketTypes: [{ name: "Regular", price: 25000, quota: 5000 }] },
  { title: "Bandung Culture Festival", category: "Festival", venueIndex: 1, dayOffset: -25, ticketTypes: [{ name: "Regular", price: 50000, quota: 3000 }] },
  { title: "Festival Film Indonesia 2026", category: "Festival", venueIndex: 0, dayOffset: 40, ticketTypes: [{ name: "Regular", price: 100000, quota: 2000 }] },
  { title: "Pasar Seni Yogyakarta", category: "Festival", venueIndex: 4, dayOffset: -18, ticketTypes: [{ name: "Regular", price: 20000, quota: 4000 }] },
  { title: "Pementasan Teater Koma: Semar Gugat", category: "Teater", venueIndex: 1, dayOffset: 22, ticketTypes: [{ name: "Regular", price: 200000, quota: 800 }, { name: "VIP", price: 450000, quota: 150 }] },
  { title: "Musikal Laskar Pelangi", category: "Teater", venueIndex: 0, dayOffset: -35, ticketTypes: [{ name: "Regular", price: 300000, quota: 1200 }, { name: "VIP", price: 650000, quota: 200 }] },
  { title: "Pertunjukan Wayang Kulit Kontemporer", category: "Teater", venueIndex: 4, dayOffset: 12, ticketTypes: [{ name: "Regular", price: 100000, quota: 500 }] },
  { title: "Pameran Lukisan Kontemporer Nusantara", category: "Pameran", venueIndex: 2, dayOffset: -10, ticketTypes: [{ name: "Regular", price: 50000, quota: 1500 }] },
  { title: "Indonesia Auto Show 2026", category: "Pameran", venueIndex: 5, dayOffset: 55, ticketTypes: [{ name: "Regular", price: 75000, quota: 6000 }] },
  { title: "Pameran Fotografi Nusantara", category: "Pameran", venueIndex: 1, dayOffset: -2, ticketTypes: [{ name: "Regular", price: 40000, quota: 1000 }] },
  { title: "Jakarta Book Fair 2026", category: "Pameran", venueIndex: 5, dayOffset: 28, ticketTypes: [{ name: "Regular", price: 20000, quota: 5000 }] },
];

// ---------------------------------------------------------------------------
// Users: ambil user yang sudah ada, atau buat fallback minimal
// ---------------------------------------------------------------------------

async function ensureMinimumUsers() {
  let organizers = await prisma.user.findMany({ where: { role: "ORGANIZER" } });
  let customers = await prisma.user.findMany({ where: { role: "CUSTOMER" } });
  const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });

  const DUMMY_PASSWORD_HASH = "$2b$10$3euJ8m8I3vXHqO/dummySeedHashNotForLogin"; // placeholder, bukan hash valid

  if (organizers.length === 0) {
    const created = await prisma.user.create({
      data: {
        email: "organizer.dummy@test.com",
        password: DUMMY_PASSWORD_HASH,
        phone: "081200000001",
        name: "Organizer Dummy",
        role: "ORGANIZER",
      },
    });
    organizers = [created];
  }

  if (customers.length < 4) {
    const need = 4 - customers.length;
    for (let i = 0; i < need; i++) {
      const created = await prisma.user.create({
        data: {
          email: `customer.dummy${i + 1}@test.com`,
          password: DUMMY_PASSWORD_HASH,
          phone: `08130000000${i + 1}`,
          name: `Customer Dummy ${i + 1}`,
          role: "CUSTOMER",
        },
      });
      customers.push(created);
    }
  }

  const verifier = admins[0] ?? organizers[0];

  return { organizers, customers, verifier };
}

// ---------------------------------------------------------------------------
// Main seeding
// ---------------------------------------------------------------------------

async function main() {
  console.log("Seeding categories...");
  const categoryMap = new Map<string, number>();
  for (const name of CATEGORY_NAMES) {
    const cat = await prisma.category.upsert({
      where: { category: name },
      update: {},
      create: { category: name },
    });
    categoryMap.set(name, cat.id);
  }

  console.log("Seeding venues...");
  const venueIds: number[] = [];
  for (const v of VENUES) {
    const venue = await prisma.venue.upsert({
      where: { venueName: v.venueName },
      update: {},
      create: v,
    });
    venueIds.push(venue.id);
  }

  const { organizers, customers, verifier } = await ensureMinimumUsers();

  console.log(`Menggunakan ${organizers.length} organizer & ${customers.length} customer yang tersedia.`);

  // -------------------------------------------------------------------
  // Buat 30 event + ticket types
  // -------------------------------------------------------------------
  console.log("Seeding 30 events...");

  type CreatedEvent = {
    id: string;
    ticketTypes: { id: number; price: number; ticketType: string }[];
  };

  const createdEvents: CreatedEvent[] = [];

  for (let i = 0; i < EVENT_TEMPLATES.length; i++) {
    const tpl = EVENT_TEMPLATES[i];

    const existing = await prisma.event.findUnique({
      where: { eventTitle: tpl.title },
      include: { ticketTypes: true },
    });

    if (existing) {
      createdEvents.push({
        id: existing.id,
        ticketTypes: existing.ticketTypes.map((t) => ({
          id: t.id,
          price: t.price,
          ticketType: t.ticketType,
        })),
      });
      continue;
    }

    const eventDate = addDays(TODAY, tpl.dayOffset);
    const organizer = pick(organizers);
    const status: EventStatus =
      tpl.dayOffset < -1 ? "ARCHIVED" : Math.random() < 0.9 ? "PUBLISHED" : "DRAFT";

    const event = await prisma.event.create({
      data: {
        eventTitle: tpl.title,
        eventDate,
        startTime: atTime(eventDate, 18, 0),
        endTime: atTime(eventDate, 22, 0),
        eventDesc: `${tpl.title} adalah acara ${tpl.category.toLowerCase()} yang diselenggarakan di ${VENUES[tpl.venueIndex].venueCity}.`,
        eventTnc: "Tiket yang sudah dibeli tidak dapat dikembalikan. Harap datang 30 menit sebelum acara dimulai.",
        lastBuyAt: addDays(eventDate, -1),
        status,
        categoryId: categoryMap.get(tpl.category)!,
        venueId: venueIds[tpl.venueIndex],
        organizerId: organizer.id,
        ticketTypes: {
          create: tpl.ticketTypes.map((tt) => ({
            ticketType: tt.name,
            price: tt.price,
            quota: tt.quota,
            sold: 0,
          })),
        },
      },
      include: { ticketTypes: true },
    });

    createdEvents.push({
      id: event.id,
      ticketTypes: event.ticketTypes.map((t) => ({
        id: t.id,
        price: t.price,
        ticketType: t.ticketType,
      })),
    });
  }

  // -------------------------------------------------------------------
  // Buat 30 transaksi (SalesOrder + Payment + IssuedTicket)
  // -------------------------------------------------------------------
  console.log("Seeding 30 transaksi...");

  const existingOrderCount = await prisma.salesOrder.count();
  if (existingOrderCount >= 30) {
    console.log(`Sudah ada ${existingOrderCount} sales order di database, lewati seeding transaksi supaya tidak dobel.`);
  } else {
    const STATUS_WEIGHTS: { status: SalesOrderStatus; weight: number }[] = [
      { status: "PAID", weight: 70 },
      { status: "WAITING_PAYMENT", weight: 12 },
      { status: "CANCELLED", weight: 8 },
      { status: "CANCELLED_EXPIRED", weight: 5 },
      { status: "REFUNDED", weight: 5 },
    ];

    function pickStatus(): SalesOrderStatus {
      const total = STATUS_WEIGHTS.reduce((s, w) => s + w.weight, 0);
      let r = randInt(1, total);
      for (const w of STATUS_WEIGHTS) {
        if (r <= w.weight) return w.status;
        r -= w.weight;
      }
      return "PAID";
    }

    // Sebaran tanggal transaksi: dari awal tahun ini (YTD) sampai hari ini,
    // dengan konsentrasi lebih banyak di 30 hari terakhir supaya filter
    // 1D / 1W / 1M di dashboard sama-sama ada datanya.
    function randomOrderDate(): Date {
      const bucket = randInt(1, 100);
      if (bucket <= 15) return addDays(TODAY, -randInt(0, 1)); // hari ini / kemarin -> 1D
      if (bucket <= 40) return addDays(TODAY, -randInt(2, 7)); // minggu ini -> 1W
      if (bucket <= 70) return addDays(TODAY, -randInt(8, 30)); // bulan ini -> 1M
      const startOfYear = new Date(TODAY.getFullYear(), 0, 1);
      const daysSinceStart = Math.floor(
        (TODAY.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );
      return addDays(startOfYear, randInt(0, Math.max(daysSinceStart - 31, 1))); // sisa tahun ini -> YTD
    }

    for (let i = 0; i < 30; i++) {
      const evt = pick(createdEvents);
      const ticketType = pick(evt.ticketTypes);
      const customer = pick(customers);
      const qty = randInt(1, 4);
      const totalPrice = ticketType.price * qty;
      const hasDiscount = Math.random() < 0.25;
      const totalDiscount = hasDiscount ? Math.round(totalPrice * 0.1) : 0;
      const finalPrice = totalPrice - totalDiscount;
      const status = pickStatus();
      const orderDate = randomOrderDate();
      const invoiceNumber = `INV-${orderDate.getFullYear()}${pad(orderDate.getMonth() + 1, 2)}-${pad(i + 1)}`;

      const salesOrder = await prisma.salesOrder.create({
        data: {
          invoiceNumber,
          customerId: customer.id,
          eventId: evt.id,
          ticketTypeId: ticketType.id,
          ticketName: ticketType.ticketType,
          ticketPrice: ticketType.price,
          qtyTickets: qty,
          totalPrice,
          totalDiscount,
          finalPrice,
          status,
          createdAt: orderDate,
          updatedAt: orderDate,
        },
      });

      const isPaid = status === "PAID";
      const isCancelledLike = status === "CANCELLED" || status === "CANCELLED_EXPIRED";
      const paymentStatus: PaymentStatus = isPaid
        ? "VERIFIED"
        : isCancelledLike
        ? "REJECTED"
        : status === "REFUNDED"
        ? "VERIFIED"
        : "WAITING_VERIFICATION";

      await prisma.payment.create({
        data: {
          salesOrderId: salesOrder.id,
          amount: finalPrice,
          paymentMethod: "BANK_TRANSFER" as PaymentMethod,
          paidAt: isPaid || status === "REFUNDED" ? orderDate : null,
          expiredAt: addDays(orderDate, 1),
          status: paymentStatus,
          verifiedById: isPaid || status === "REFUNDED" || isCancelledLike ? verifier.id : null,
          verifiedAt: isPaid || status === "REFUNDED" || isCancelledLike ? orderDate : null,
        },
      });

      if (isPaid || status === "REFUNDED") {
        for (let t = 0; t < qty; t++) {
          await prisma.issuedTicket.create({
            data: {
              ticketCode: `TCK-${invoiceNumber}-${pad(t + 1, 2)}`,
              ticketTypeId: ticketType.id,
              salesOrderId: salesOrder.id,
              ticketName: ticketType.ticketType,
              ticketPrice: ticketType.price,
            },
          });
        }

        await prisma.ticketType.update({
          where: { id: ticketType.id },
          data: { sold: { increment: qty } },
        });
      }
    }
  }

  console.log("Selesai. 30 event & 30 transaksi (kurang lebih, tergantung data yang sudah ada) sudah ditambahkan ke database.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
