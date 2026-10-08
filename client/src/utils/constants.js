export const EXPENSE_CATEGORIES = [
  'Food',
  'Transport',
  'Shopping',
  'Bills',
  'Entertainment',
  'Healthcare',
  'Education',
  'Other',
];

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Investment',
  'Gift',
  'Other',
];

export const ALL_CATEGORIES = [...new Set([...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES])];

// Category metadata with icons, colors, and descriptions
export const CATEGORY_CONFIG = {
  Food: {
    name: 'Food & Dining',
    color: '#f97316', // Orange
    bgLight: 'bg-orange-50 text-orange-700 border-orange-200',
    iconName: 'HiOutlineShoppingCart',
  },
  Transport: {
    name: 'Transportation',
    color: '#3b82f6', // Blue
    bgLight: 'bg-blue-50 text-blue-700 border-blue-200',
    iconName: 'HiOutlineTruck',
  },
  Shopping: {
    name: 'Shopping & Retail',
    color: '#ec4899', // Pink
    bgLight: 'bg-pink-50 text-pink-700 border-pink-200',
    iconName: 'HiOutlineShoppingBag',
  },
  Bills: {
    name: 'Bills & Utilities',
    color: '#ef4444', // Red
    bgLight: 'bg-red-50 text-red-700 border-red-200',
    iconName: 'HiOutlineHome',
  },
  Entertainment: {
    name: 'Entertainment & Leisure',
    color: '#8b5cf6', // Purple
    bgLight: 'bg-purple-50 text-purple-700 border-purple-200',
    iconName: 'HiOutlineFilm',
  },
  Healthcare: {
    name: 'Healthcare & Medical',
    color: '#10b981', // Emerald
    bgLight: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconName: 'HiOutlineHeart',
  },
  Education: {
    name: 'Education & Courses',
    color: '#06b6d4', // Cyan
    bgLight: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    iconName: 'HiOutlineAcademicCap',
  },
  Salary: {
    name: 'Salary & Compensation',
    color: '#059669', // Green
    bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconName: 'HiOutlineBriefcase',
  },
  Freelance: {
    name: 'Freelance & Contracting',
    color: '#0284c7', // Sky
    bgLight: 'bg-sky-50 text-sky-800 border-sky-200',
    iconName: 'HiOutlineCodeBracket',
  },
  Investment: {
    name: 'Investments & Returns',
    color: '#d97706', // Amber
    bgLight: 'bg-amber-50 text-amber-800 border-amber-200',
    iconName: 'HiOutlineChartBar',
  },
  Gift: {
    name: 'Gifts & Grants',
    color: '#a855f7', // Violet
    bgLight: 'bg-purple-50 text-purple-800 border-purple-200',
    iconName: 'HiOutlineGift',
  },
  Other: {
    name: 'General & Miscellaneous',
    color: '#64748b', // Slate
    bgLight: 'bg-slate-100 text-slate-700 border-slate-200',
    iconName: 'HiOutlineEllipsisHorizontalCircle',
  },
};

export const TAN_HIDE_PALETTE = {
  50: '#fff7ed',
  100: '#feedd6',
  200: '#fcd7ac',
  300: '#f9b978',
  400: '#f79f58',
  500: '#f3731c',
  600: '#e45912',
  700: '#bd4211',
  800: '#963616',
  900: '#792e15',
  950: '#411509',
};
