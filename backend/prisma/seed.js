/*
 * If you need to initialize your database with some data, you may write a script
 * to do so here.
 */
'use strict';

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...\n");

  // Hash password for all demo accounts
  const hashedPassword = await bcrypt.hash("password123", 10);

  // ============================================
  // 1. CREATE DEMO USERS (all roles)
  // ============================================
  console.log("Creating demo users...");

  const superuser = await prisma.user.upsert({
    where: { utorid: "superadmin" },
    update: {},
    create: {
      utorid: "superadmin",
      name: "Super Admin",
      email: "superadmin@mail.utoronto.ca",
      password: hashedPassword,
      role: "superuser",
      verified: true,
      points: 0,
    },
  });

  const manager = await prisma.user.upsert({
    where: { utorid: "manager01" },
    update: {},
    create: {
      utorid: "manager01",
      name: "Manager Demo",
      email: "manager@mail.utoronto.ca",
      password: hashedPassword,
      role: "manager",
      verified: true,
      points: 100,
    },
  });

  const cashier = await prisma.user.upsert({
    where: { utorid: "cashier01" },
    update: {},
    create: {
      utorid: "cashier01",
      name: "Cashier Demo",
      email: "cashier@mail.utoronto.ca",
      password: hashedPassword,
      role: "cashier",
      verified: true,
      points: 250,
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { utorid: "user0001" },
    update: {},
    create: {
      utorid: "user0001",
      name: "Regular User",
      email: "user@mail.utoronto.ca",
      password: hashedPassword,
      role: "regular",
      verified: true,
      points: 500,
      birthday: "2000-05-15",
    },
  });

  // Additional regular users for testing user listing
  const user2 = await prisma.user.upsert({
    where: { utorid: "user0002" },
    update: {},
    create: {
      utorid: "user0002",
      name: "Alice Johnson",
      email: "alice@mail.utoronto.ca",
      password: hashedPassword,
      role: "regular",
      verified: true,
      points: 1200,
    },
  });

  const user3 = await prisma.user.upsert({
    where: { utorid: "user0003" },
    update: {},
    create: {
      utorid: "user0003",
      name: "Bob Smith",
      email: "bob@mail.utoronto.ca",
      password: hashedPassword,
      role: "regular",
      verified: false, // Unverified user for testing
      points: 0,
    },
  });

  const user4 = await prisma.user.upsert({
    where: { utorid: "user0004" },
    update: {},
    create: {
      utorid: "user0004",
      name: "Carol Williams",
      email: "carol@mail.utoronto.ca",
      password: hashedPassword,
      role: "regular",
      verified: true,
      points: 750,
    },
  });

  console.log("✅ Created 7 demo users\n");

  // ============================================
  // 2. CREATE PROMOTIONS
  // ============================================
  console.log("Creating promotions...");

  const promo1 = await prisma.promotion.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Welcome Bonus",
      description: "Get 100 bonus points on your first purchase over $10",
      type: "onetime",
      startTime: new Date("2025-01-01"),
      endTime: new Date("2025-12-31"),
      minSpending: 10,
      rate: 0,
      points: 100,
    },
  });

  const promo2 = await prisma.promotion.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: "Double Points Week",
      description: "Earn 2x points on all purchases this week",
      type: "automatic",
      startTime: new Date("2025-01-01"),
      endTime: new Date("2025-01-31"),
      minSpending: 0,
      rate: 2,
      points: 0,
    },
  });

  const promo3 = await prisma.promotion.upsert({
    where: { id: 3 },
    update: {},
    create: {
      name: "Big Spender Bonus",
      description: "Spend $50 or more and get 200 bonus points",
      type: "automatic",
      startTime: new Date("2025-01-01"),
      endTime: new Date("2025-06-30"),
      minSpending: 50,
      rate: 1,
      points: 200,
    },
  });

  console.log("✅ Created 3 promotions\n");

  // ============================================
  // 3. CREATE EVENTS
  // ============================================
  console.log("Creating events...");

  const event1 = await prisma.event.create({
    data: {
      name: "Welcome Week Kickoff",
      description: "Join us for the start of a great semester! Free food and prizes.",
      location: "Bahen Centre, Room BA1130",
      startTime: new Date("2025-01-20T14:00:00Z"),
      endTime: new Date("2025-01-20T17:00:00Z"),
      capacity: 100,
      spaceRemain: 95,
      pointsRemain: 500,
      pointsAwarded: 0,
      published: true,
      organizers: {
        connect: [{ id: manager.id }],
      },
      guests: {
        connect: [{ id: regularUser.id }, { id: user2.id }],
      },
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: "Tech Talk: AI in 2025",
      description: "A discussion on the latest AI trends and their impact on society.",
      location: "Myhal Centre, MY150",
      startTime: new Date("2025-02-05T18:00:00Z"),
      endTime: new Date("2025-02-05T20:00:00Z"),
      capacity: 50,
      spaceRemain: 48,
      pointsRemain: 300,
      pointsAwarded: 0,
      published: true,
      organizers: {
        connect: [{ id: manager.id }, { id: cashier.id }],
      },
      guests: {
        connect: [{ id: user4.id }],
      },
    },
  });

  const event3 = await prisma.event.create({
    data: {
      name: "Study Session: Finals Prep",
      description: "Group study session for final exams. Snacks provided!",
      location: "Robarts Library, Room 4049",
      startTime: new Date("2025-04-10T10:00:00Z"),
      endTime: new Date("2025-04-10T16:00:00Z"),
      capacity: 30,
      spaceRemain: 30,
      pointsRemain: 150,
      pointsAwarded: 0,
      published: false, // Unpublished event for testing
      organizers: {
        connect: [{ id: cashier.id }],
      },
    },
  });

  console.log("✅ Created 3 events\n");

  // ============================================
  // 4. CREATE TRANSACTIONS
  // ============================================
  console.log("Creating transactions...");

  // Purchase transactions
  await prisma.transaction.create({
    data: {
      utorid: regularUser.utorid,
      type: "purchase",
      spent: 25.5,
      points: 26, // ~1 point per dollar
      remark: "Coffee and snacks at campus cafe",
      createdBy: cashier.utorid,
    },
  });

  await prisma.transaction.create({
    data: {
      utorid: regularUser.utorid,
      type: "purchase",
      spent: 15.0,
      points: 15,
      remark: "Lunch special",
      createdBy: cashier.utorid,
    },
  });

  await prisma.transaction.create({
    data: {
      utorid: user2.utorid,
      type: "purchase",
      spent: 55.0,
      points: 255, // 55 + 200 bonus from promo
      remark: "Textbooks purchase - Big Spender Bonus applied",
      createdBy: cashier.utorid,
    },
  });

  // Redemption transaction
  await prisma.transaction.create({
    data: {
      utorid: user4.utorid,
      type: "redemption",
      spent: null,
      points: -200, // Negative because points are spent
      remark: "Redeemed for $20 gift card",
      createdBy: cashier.utorid,
    },
  });

  // Event points
  await prisma.transaction.create({
    data: {
      utorid: regularUser.utorid,
      type: "event",
      spent: null,
      points: 50,
      remark: "Attended Welcome Week Kickoff",
      relatedId: event1.id,
      createdBy: manager.utorid,
    },
  });

  // Transfer transaction
  await prisma.transaction.create({
    data: {
      utorid: user2.utorid,
      type: "transfer",
      spent: null,
      points: -100, // Sender loses points
      remark: "Transferred to user0001",
      createdBy: user2.utorid,
    },
  });

  await prisma.transaction.create({
    data: {
      utorid: regularUser.utorid,
      type: "transfer",
      spent: null,
      points: 100, // Recipient gains points
      remark: "Received from user0002",
      createdBy: user2.utorid,
    },
  });

  // Adjustment transaction (manager action)
  await prisma.transaction.create({
    data: {
      utorid: user4.utorid,
      type: "adjustment",
      spent: null,
      points: 50,
      remark: "Compensation for system error",
      createdBy: manager.utorid,
    },
  });

  console.log("✅ Created 8 transactions\n");

  // ============================================
  // SUMMARY
  // ============================================
  console.log("═══════════════════════════════════════");
  console.log("🎉 Database seeded successfully!");
  console.log("═══════════════════════════════════════\n");

  console.log("📋 Demo Accounts (password: password123)\n");
  console.log("┌────────────┬──────────────┬────────────┐");
  console.log("│ Role       │ UTORid       │ Email      │");
  console.log("├────────────┼──────────────┼────────────┤");
  console.log("│ Superuser  │ superadmin   │ superadmin@mail.utoronto.ca │");
  console.log("│ Manager    │ manager01    │ manager@mail.utoronto.ca    │");
  console.log("│ Cashier    │ cashier01    │ cashier@mail.utoronto.ca    │");
  console.log("│ Regular    │ user0001     │ user@mail.utoronto.ca       │");
  console.log("└────────────┴──────────────┴────────────┘\n");

  console.log("📊 Seeded Data Summary:");
  console.log("   • 7 Users (1 superuser, 1 manager, 1 cashier, 4 regular)");
  console.log("   • 3 Promotions (1 one-time, 2 automatic)");
  console.log("   • 3 Events (2 published, 1 draft)");
  console.log("   • 8 Transactions (purchases, redemptions, transfers, events)");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
