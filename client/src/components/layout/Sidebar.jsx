import React from 'react';
import {
  HiOutlineSquares2X2,
  HiOutlineArrowsRightLeft,
  HiOutlineChartPie,
  HiOutlineBanknotes,
  HiPlus,
} from 'react-icons/hi2';
import Button from '../common/Button';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: HiOutlineSquares2X2 },
  { id: 'transactions', label: 'Transactions', icon: HiOutlineArrowsRightLeft },
  { id: 'analytics', label: 'Analytics', icon: HiOutlineChartPie },
  { id: 'budgets', label: 'Budgets', icon: HiOutlineBanknotes },
];

const Sidebar = ({ activeTab, setActiveTab, onOpenAddTransaction, isMobileOpen, setIsMobileOpen }) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header & Branding */}
        <div>
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white shadow-md shadow-brand-500/25">
                <span className="font-extrabold text-lg tracking-wider">S</span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-bold text-slate-900 tracking-tight">
                    Spend<span className="text-brand-500">Wise</span>
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200 rounded">
                    v1.0
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Financial Intelligence</p>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="px-4 pt-5 pb-3">
            <Button
              onClick={() => {
                onOpenAddTransaction();
                if (setIsMobileOpen) setIsMobileOpen(false);
              }}
              icon={HiPlus}
              size="md"
              className="w-full justify-center shadow-md shadow-brand-500/20 hover:shadow-brand-500/30"
            >
              New Transaction
            </Button>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Menu
            </p>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (setIsMobileOpen) setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-brand-50 text-brand-600 shadow-sm border border-brand-200/70 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-500" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Clean Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span className="font-medium">SpendWise SaaS</span>
          <span className="text-[11px]">2026</span>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
