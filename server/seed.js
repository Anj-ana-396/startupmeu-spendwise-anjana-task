import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Transaction from './models/Transaction.js';
import Budget from './models/Budget.js';
import connectDB from './config/db.js';

dotenv.config();

const sampleTransactions = [
  // Current month
  {
    title: 'Monthly Software Engineer Salary',
    amount: 5200.00,
    type: 'income',
    category: 'Salary',
    date: new Date(new Date().setDate(1)),
    description: 'Direct deposit payroll salary for the month',
  },
  {
    title: 'Freelance UI/UX Design Project',
    amount: 1450.00,
    type: 'income',
    category: 'Freelance',
    date: new Date(new Date().setDate(5)),
    description: 'Milestone payment for fintech design sprint',
  },
  {
    title: 'Stock Dividend Payout',
    amount: 280.50,
    type: 'income',
    category: 'Investment',
    date: new Date(new Date().setDate(8)),
    description: 'Quarterly index fund dividend payout',
  },
  {
    title: 'Apartment Monthly Rent & Maintenance',
    amount: 1650.00,
    type: 'expense',
    category: 'Bills',
    date: new Date(new Date().setDate(2)),
    description: 'Downtown apartment lease and building maintenance fee',
  },
  {
    title: 'Whole Foods Organic Groceries',
    amount: 184.25,
    type: 'expense',
    category: 'Food',
    date: new Date(new Date().setDate(3)),
    description: 'Weekly grocery restock, fresh produce & essentials',
  },
  {
    title: 'Electric & Fiber High-Speed Internet',
    amount: 135.00,
    type: 'expense',
    category: 'Bills',
    date: new Date(new Date().setDate(6)),
    description: 'Power grid bill and 1Gbps fiber internet',
  },
  {
    title: 'Uber & Subway Transit Commute',
    amount: 62.40,
    type: 'expense',
    category: 'Transport',
    date: new Date(new Date().setDate(7)),
    description: 'Work commute and weekend rides',
  },
  {
    title: 'Artisan Coffee & Bistro Brunch',
    amount: 48.75,
    type: 'expense',
    category: 'Food',
    date: new Date(new Date().setDate(8)),
    description: 'Weekend team brunch and specialty espresso',
  },
  {
    title: 'Cloud Server & SaaS Subscriptions',
    amount: 89.99,
    type: 'expense',
    category: 'Shopping',
    date: new Date(new Date().setDate(9)),
    description: 'GitHub Copilot, Figma, and AWS dev servers',
  },
  {
    title: 'Premium Cinema & IMAX Tickets',
    amount: 42.00,
    type: 'expense',
    category: 'Entertainment',
    date: new Date(new Date().setDate(10)),
    description: 'Weekend movie with popcorn combo',
  },
  {
    title: 'Annual Fitness Club Membership',
    amount: 95.00,
    type: 'expense',
    category: 'Healthcare',
    date: new Date(new Date().setDate(11)),
    description: 'Gym access, sauna, and pool facilities',
  },
  {
    title: 'Online Advanced Full-Stack Course',
    amount: 120.00,
    type: 'expense',
    category: 'Education',
    date: new Date(new Date().setDate(12)),
    description: 'Full-stack system architecture masterclass',
  },

  // 1 Month Ago
  {
    title: 'Monthly Software Engineer Salary',
    amount: 5200.00,
    type: 'income',
    category: 'Salary',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    description: 'Direct deposit payroll',
  },
  {
    title: 'Consulting Honorarium',
    amount: 900.00,
    type: 'income',
    category: 'Freelance',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 14),
    description: 'Tech advisory consultation session',
  },
  {
    title: 'Apartment Monthly Rent',
    amount: 1650.00,
    type: 'expense',
    category: 'Bills',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 2),
    description: 'Monthly apartment rent',
  },
  {
    title: 'Supermarket Groceries & Supplies',
    amount: 320.60,
    type: 'expense',
    category: 'Food',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 10),
    description: 'Bulk monthly kitchen supplies',
  },
  {
    title: 'Vehicle Fuel & Toll Charges',
    amount: 110.00,
    type: 'expense',
    category: 'Transport',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 18),
    description: 'Highway tolls and gas fill-up',
  },
  {
    title: 'Concert & Festival Passes',
    amount: 175.00,
    type: 'expense',
    category: 'Entertainment',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 22),
    description: 'Live jazz & symphony festival tickets',
  },

  // 2 Months Ago
  {
    title: 'Monthly Software Engineer Salary',
    amount: 5200.00,
    type: 'income',
    category: 'Salary',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 1),
    description: 'Direct deposit payroll',
  },
  {
    title: 'Birthday Gift from Family',
    amount: 300.00,
    type: 'income',
    category: 'Gift',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 12),
    description: 'Celebration gift money',
  },
  {
    title: 'Apartment Monthly Rent',
    amount: 1650.00,
    type: 'expense',
    category: 'Bills',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 2),
    description: 'Monthly apartment rent',
  },
  {
    title: 'Gourmet Dinner with Friends',
    amount: 215.40,
    type: 'expense',
    category: 'Food',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 15),
    description: 'Dinner outing and beverages',
  },
  {
    title: 'Ergonomic Standing Desk & Chair',
    amount: 450.00,
    type: 'expense',
    category: 'Shopping',
    date: new Date(new Date().getFullYear(), new Date().getMonth() - 2, 20),
    description: 'Home office equipment upgrade',
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('[SpendWise Seeder] Clearing existing records...');
    await Transaction.deleteMany({});
    await Budget.deleteMany({});

    console.log('[SpendWise Seeder] Inserting sample transactions...');
    await Transaction.insertMany(sampleTransactions);

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    console.log('[SpendWise Seeder] Creating monthly budgets...');
    await Budget.create([
      {
        month: currentMonth,
        year: currentYear,
        limit: 3000.00,
        category: 'All',
        notes: 'Monthly standard overall spending limit target',
      },
      {
        month: currentMonth === 1 ? 12 : currentMonth - 1,
        year: currentMonth === 1 ? currentYear - 1 : currentYear,
        limit: 2800.00,
        category: 'All',
        notes: 'Prior month budget target',
      },
    ]);

    console.log('✅ [SpendWise Seeder] Database seeded successfully with test records!');
    process.exit(0);
  } catch (err) {
    console.error('❌ [SpendWise Seeder Error]:', err.message);
    process.exit(1);
  }
};

seedDB();
