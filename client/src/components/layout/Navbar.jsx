import React from 'react';
import {
  HiBars3,
  HiPlus,
} from 'react-icons/hi2';
import Button from '../common/Button';

const TITLES = {
  overview: {
    title: 'Financial Overview',
    subtitle: 'Real-time cash flow, budget tracking, and income breakdown',
  },
  transactions: {
    title: 'Transactions Ledger',
    subtitle: 'Manage, search, filter, and inspect your financial records',
  },
  analytics: {
    title: 'Analytics & Insights',
    subtitle: 'Visual distribution of your spending patterns and monthly trends',
  },
  budgets: {
    title: 'Monthly Budgeting',
    subtitle: 'Set spending guardrails, track limits, and avoid overspending',
  },
};

const Navbar = ({ activeTab, onOpenAddTransaction, onToggleMobileMenu }) => {
  const currentInfo = TITLES[activeTab] || TITLES.overview;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Toggle navigation menu"
          >
            <HiBars3 className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {currentInfo.title}
            </h1>
            <p className="hidden sm:block text-xs text-slate-500 font-medium">
              {currentInfo.subtitle}
            </p>
          </div>
        </div>

        {/* Right: Quick Action */}
        <div className="flex items-center gap-3">
          <Button
            onClick={onOpenAddTransaction}
            icon={HiPlus}
            size="sm"
            className="shadow-sm"
          >
            <span className="hidden sm:inline">Add Transaction</span>
            <span className="sm:hidden">Add</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
