/**
 * seed-sales-orders.ts
 *
 * Membuat 100 dummy SalesOrder (+ Payment, IssuedTicket, sebagian pakai Coupon)
 * dalam rentang 30 hari terakhir, semuanya untuk event milik organizer
 * cms8yp9ep0000s0uthhp6rim2.
 *
 * - Memakai 13 event PUBLISHED milik organizer tsb yang sudah ada di DB.
 * - Boleh membuat event baru untuk organizer yang sama, MAX 10 — di sini
 *   dibuat 6 event baru untuk variasi kategori.
 * - Kategori HANYA mengambil dari yang sudah ada di tabel categories
 *   (Music, Musik, Olahraga, Workshop, Konferensi, Festival, Teater, Pameran).
 *   Tidak ada kategori baru yang dibuat.
 * - Format invoice/ticket/coupon code persis mengikuti generator project.
 *
 * Cara pakai (dari folder backend):
 *   npx tsx prisma/seed-sales-orders.ts
 */

import { randomUUID, randomBytes } from "node:crypto";
import { prisma } from "../src/config/prisma"; // sesuaikan path relatif ke lokasi file ini

// ---------------------------------------------------------------------------
// Generator persis sesuai punya project (invoice diparameterkan by date
// supaya tanggalnya konsisten dengan createdAt SalesOrder yang di-backdate)
// ---------------------------------------------------------------------------

function generateInvoiceNumber(referenceDate: Date): string {
  const date =
    referenceDate.getFullYear().toString() +
    String(referenceDate.getMonth() + 1).padStart(2, "0") +
    String(referenceDate.getDate()).padStart(2, "0");

  const random = randomUUID().replace(/-/g, "").substring(0, 6).toUpperCase();

  return `SO-${date}-${random}`;
}

function generateTicketCode(): string {
  const random = randomBytes(4).toString("hex").toUpperCase();
  return `TIX-${random}`;
}

function generateCouponCode(): string {
  const randomString = Math.random().toString(36).substring(2, 8);
  return `CPNREF${randomString.toUpperCase()}`;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

function randomDateInLast30Days(): Date {
  const now = new Date();
  const daysAgo = randInt(0, 29);
  const d = new Date(now);
  d.setDate(d.getDate() - daysAgo);
  d.setHours(randInt(8, 22), randInt(0, 59), randInt(0, 59), 0);
  return d;
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

// ---------------------------------------------------------------------------
// Data tetap: organizer, event yang sudah ada, customer
// ---------------------------------------------------------------------------

const ORGANIZER_ID = "cms8yp9ep0000s0uthhp6rim2";

const EXISTING_EVENT_IDS = [
  "cmsbuxdtp0001tout8us4q3xe", // Synchronize Fest Bandung
  "cmsbuxe8l0004toutfqrfoffu", // Java Jazz Festival 2026
  "cmsbuxewd0009toutouwynml2", // Liga Futsal Antar Komunitas
  "cmsbuxfay000ctout6ymcp04h", // Workshop Fotografi Dasar
  "cmsbuxffu000dtout94qm3k8d", // Bootcamp Web Development Intensif
  "cmsbuxgb8000itoutteo5t9gz", // Conference on AI and The Future of Work
  "cmsbuxggh000jtoutsz9qfl7l", // Festival Kuliner Nusantara
  "cmsbuxgpy000ltoutrjcx2i8h", // Festival Film Indonesia 2026
  "cmsbuxgzj000ntoutrdsme00m", // Pementasan Teater Koma: Semar Gugat
  "cmsbuxhil000rtoutoempzmf0", // Indonesia Auto Show 2026
  "cmsbuxhsc000ttoutkw0bhatq", // Jakarta Book Fair 2026
  "cmsdauv2l0002z4utmkzxp428", // Grand Royal Wedding Expo
  "cmsdgnhz90000kcuta793dlpv", // Bandung Rock Fest 2026
];

const CUSTOMERS = [
  { id: "cms1y77so0000ncutq4653xym", email: "budi@test.com" },
  { id: "cms7roeok00048gut24dxx8yh", email: "elvina@gmail.com" },
  { id: "cms69z42n0000vgutmyrn3ta0", email: "yuliuscg@gmail.com" },
  { id: "cms1yg5q40001ncutkh6cnijz", email: "ani@test.com" },
];

// Venue untuk event baru (upsert -> aman kalau sudah pernah dibuat sebelumnya)
const VENUES = [
  { venueName: "Istora Senayan", venueAddress: "Jl. Pintu Satu Senayan", venueCity: "Jakarta", venueState: "DKI Jakarta", venueZipCode: "10270", venuePhone: "0211234567", venueEmail: "info@istorasenayan.com", venueGMapsUrl: "https://maps.google.com/?q=Istora+Senayan", capacity: 8000 },
  { venueName: "Sasana Budaya Ganesha", venueAddress: "Jl. Taman Sari No.73", venueCity: "Bandung", venueState: "Jawa Barat", venueZipCode: "40132", venuePhone: "0222501175", venueEmail: "info@sabuga.com", venueGMapsUrl: "https://maps.google.com/?q=Sasana+Budaya+Ganesha", capacity: 3000 },
  { venueName: "Grand City Convex", venueAddress: "Jl. Walikota Mustajab No.1", venueCity: "Surabaya", venueState: "Jawa Timur", venueZipCode: "60272", venuePhone: "0315491000", venueEmail: "info@grandcityconvex.com", venueGMapsUrl: "https://maps.google.com/?q=Grand+City+Convex", capacity: 5000 },
  { venueName: "Jogja Expo Center", venueAddress: "Jl. Raya Janti", venueCity: "Yogyakarta", venueState: "DI Yogyakarta", venueZipCode: "55198", venuePhone: "0274451888", venueEmail: "info@jec.co.id", venueGMapsUrl: "https://maps.google.com/?q=Jogja+Expo+Center", capacity: 4000 },
  { venueName: "ICE BSD", venueAddress: "BSD City", venueCity: "Tangerang", venueState: "Banten", venueZipCode: "15345", venuePhone: "0215316188", venueEmail: "info@ice-bsd.com", venueGMapsUrl: "https://maps.google.com/?q=ICE+BSD", capacity: 10000 },
];

// Maksimal 10 event baru — di sini dipakai 6, kategori HANYA dari yang sudah ada
type NewEventTemplate = {
  title: string;
  category: "Music" | "Musik" | "Olahraga" | "Workshop" | "Konferensi" | "Festival" | "Teater" | "Pameran";
  venueIndex: number;
  dayOffset: number;
  ticketTypes: { name: string; price: number; quota: number }[];
};

const NEW_EVENT_TEMPLATES: NewEventTemplate[] = [
  { title: "Sunset Acoustic Sessions Jakarta", category: "Music", venueIndex: 0, dayOffset: 25, ticketTypes: [{ name: "Regular", price: 175000, quota: 800 }] },
  { title: "Konser Amal Suara Untuk Negeri Vol.2", category: "Musik", venueIndex: 1, dayOffset: 40, ticketTypes: [{ name: "Regular", price: 150000, quota: 1500 }, { name: "VIP", price: 400000, quota: 200 }] },
  { title: "Half Marathon Kota Tua", category: "Olahraga", venueIndex: 2, dayOffset: 33, ticketTypes: [{ name: "10K", price: 200000, quota: 1000 }, { name: "21K", price: 350000, quota: 500 }] },
  { title: "Workshop Copywriting untuk Konten Kreator", category: "Workshop", venueIndex: 3, dayOffset: 15, ticketTypes: [{ name: "Regular", price: 275000, quota: 150 }] },
  { title: "Digital Transformation Summit 2026", category: "Konferensi", venueIndex: 0, dayOffset: 48, ticketTypes: [{ name: "Regular", price: 650000, quota: 700 }, { name: "VIP", price: 1500000, quota: 100 }] },
  { title: "Pameran Otomotif Klasik Nusantara", category: "Pameran", venueIndex: 4, dayOffset: 20, ticketTypes: [{ name: "Regular", price: 60000, quota: 4000 }] },
];

// ---------------------------------------------------------------------------
// Setup: pastikan event tersedia (existing + baru), lengkap dengan ticketTypes
// ---------------------------------------------------------------------------

interface EventPoolItem {
  id: string;
  ticketTypes: { id: number; price: number; ticketType: string }[];
}

async function setupEvents(): Promise<EventPoolItem[]> {
  const pool: EventPoolItem[] = [];

  // 1. Ambil event existing milik organizer ini yang statusnya PUBLISHED
  const existingEvents = await prisma.event.findMany({
    where: {
      id: { in: EXISTING_EVENT_IDS },
      organizerId: ORGANIZER_ID,
      status: "PUBLISHED",
    },
    include: { ticketTypes: true },
  });

  console.log(`Ditemukan ${existingEvents.length}/${EXISTING_EVENT_IDS.length} event existing yang valid (PUBLISHED & milik organizer).`);

  for (const evt of existingEvents) {
    if (evt.ticketTypes.length === 0) {
      console.warn(`  - Event "${evt.eventTitle}" dilewati: belum punya ticket type.`);
      continue;
    }
    pool.push({
      id: evt.id,
      ticketTypes: evt.ticketTypes.map((t) => ({ id: t.id, price: t.price, ticketType: t.ticketType })),
    });
  }

  // 2. Upsert venue untuk event baru
  const venueIds: number[] = [];
  for (const v of VENUES) {
    const venue = await prisma.venue.upsert({
      where: { venueName: v.venueName },
      update: {},
      create: v,
    });
    venueIds.push(venue.id);
  }

  // 3. Buat (atau reuse) event baru — kategori WAJIB sudah ada di tabel categories
  console.log(`Membuat/menggunakan ${NEW_EVENT_TEMPLATES.length} event baru...`);
  for (const tpl of NEW_EVENT_TEMPLATES) {
    const category = await prisma.category.findUniqueOrThrow({
      where: { category: tpl.category },
    });

    const existing = await prisma.event.findUnique({
      where: { eventTitle: tpl.title },
      include: { ticketTypes: true },
    });

    if (existing) {
      pool.push({
        id: existing.id,
        ticketTypes: existing.ticketTypes.map((t) => ({ id: t.id, price: t.price, ticketType: t.ticketType })),
      });
      continue;
    }

    const eventDate = addDays(new Date(), tpl.dayOffset);
    const created = await prisma.event.create({
      data: {
        eventTitle: tpl.title,
        eventDate,
        startTime: atTime(eventDate, 18, 0),
        endTime: atTime(eventDate, 22, 0),
        eventDesc: `${tpl.title} adalah acara ${tpl.category.toLowerCase()} yang diselenggarakan oleh Super Organizer.`,
        eventTnc: "Tiket yang sudah dibeli tidak dapat dikembalikan. Harap datang 30 menit sebelum acara dimulai.",
        lastBuyAt: addDays(eventDate, -1),
        status: "PUBLISHED",
        categoryId: category.id,
        venueId: venueIds[tpl.venueIndex],
        organizerId: ORGANIZER_ID,
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

    pool.push({
      id: created.id,
      ticketTypes: created.ticketTypes.map((t) => ({ id: t.id, price: t.price, ticketType: t.ticketType })),
    });
  }

  return pool;
}

// ---------------------------------------------------------------------------
// Main: 100 SalesOrder + Payment + IssuedTicket (+ sebagian Coupon)
// ---------------------------------------------------------------------------

const STATUS_WEIGHTS: { status: "PAID" | "WAITING_PAYMENT" | "CANCELLED" | "CANCELLED_EXPIRED" | "REFUNDED"; weight: number }[] = [
  { status: "PAID", weight: 70 },
  { status: "WAITING_PAYMENT", weight: 12 },
  { status: "CANCELLED", weight: 8 },
  { status: "CANCELLED_EXPIRED", weight: 5 },
  { status: "REFUNDED", weight: 5 },
];

function pickStatus() {
  const total = STATUS_WEIGHTS.reduce((s, w) => s + w.weight, 0);
  let r = randInt(1, total);
  for (const w of STATUS_WEIGHTS) {
    if (r <= w.weight) return w.status;
    r -= w.weight;
  }
  return "PAID" as const;
}

async function main() {
  const existingOrderCount = await prisma.salesOrder.count({
    where: { event: { organizerId: ORGANIZER_ID } },
  });
  if (existingOrderCount >= 100) {
    console.log(`Sudah ada ${existingOrderCount} sales order untuk organizer ini, lewati seeding supaya tidak dobel.`);
    return;
  }

  const eventPool = await setupEvents();
  if (eventPool.length === 0) {
    throw new Error("Tidak ada event dengan ticket type yang bisa dipakai. Seeding dibatalkan.");
  }

  const verifier =
    (await prisma.user.findFirst({ where: { role: "ADMIN" } })) ??
    (await prisma.user.findUniqueOrThrow({ where: { id: ORGANIZER_ID } }));

  console.log(`Menggunakan ${eventPool.length} event (existing + baru) sebagai sumber transaksi.`);
  console.log("Seeding 100 sales order...");

  for (let i = 0; i < 100; i++) {
    const evt = pick(eventPool);
    const ticketType = pick(evt.ticketTypes);
    const customer = pick(CUSTOMERS);
    const qty = randInt(1, 4);
    const totalPrice = ticketType.price * qty;
    const orderDate = randomDateInLast30Days();
    const status = pickStatus();

    let couponId: number | null = null;
    let couponCode: string | null = null;
    let totalDiscount = 0;

    const usesCoupon = Math.random() < 0.2;
    if (usesCoupon) {
      const discountPercent = pick([10, 15, 20]);
      const coupon = await prisma.coupon.create({
        data: {
          customerId: customer.id,
          couponCode: generateCouponCode(),
          discountPercent,
          isUsed: true,
          usedAt: orderDate,
          expiredAt: addDays(orderDate, 30),
        },
      });
      couponId = coupon.id;
      couponCode = coupon.couponCode;
      totalDiscount = Math.round(totalPrice * (discountPercent / 100));
    }

    const finalPrice = totalPrice - totalDiscount;
    const invoiceNumber = generateInvoiceNumber(orderDate);

    const salesOrder = await prisma.salesOrder.create({
      data: {
        invoiceNumber,
        customerId: customer.id,
        eventId: evt.id,
        ticketTypeId: ticketType.id,
        ticketName: ticketType.ticketType,
        ticketPrice: ticketType.price,
        qtyTickets: qty,
        couponId,
        couponCode,
        totalPrice,
        totalDiscount,
        finalPrice,
        status,
        createdAt: orderDate,
        updatedAt: orderDate,
      },
    });

    if (couponId) {
      await prisma.coupon.update({
        where: { id: couponId },
        data: { usedInOrderId: salesOrder.id },
      });
    }

    const isPaid = status === "PAID";
    const isRefunded = status === "REFUNDED";
    const isCancelledLike = status === "CANCELLED" || status === "CANCELLED_EXPIRED";

    await prisma.payment.create({
      data: {
        salesOrderId: salesOrder.id,
        amount: finalPrice,
        paymentMethod: "BANK_TRANSFER",
        paidAt: isPaid || isRefunded ? orderDate : null,
        expiredAt: addDays(orderDate, 1),
        status: isPaid ? "VERIFIED" : isRefunded ? "VERIFIED" : isCancelledLike ? "REJECTED" : "WAITING_VERIFICATION",
        verifiedById: isPaid || isRefunded || isCancelledLike ? verifier.id : null,
        verifiedAt: isPaid || isRefunded || isCancelledLike ? orderDate : null,
      },
    });

    if (isPaid || isRefunded) {
      for (let t = 0; t < qty; t++) {
        await prisma.issuedTicket.create({
          data: {
            ticketCode: generateTicketCode(),
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

    if ((i + 1) % 20 === 0) {
      console.log(`  ...${i + 1}/100 sales order dibuat`);
    }
  }

  console.log("Selesai. 100 sales order (beserta payment & issued ticket) sudah ditambahkan.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
