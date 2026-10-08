import React from 'react';
import Card from '../common/Card';
import { formatCurrency } from '../../utils/formatters';
import { HiArrowTrendingUp, HiArrowTrendingDown } from 'react-icons/hi2';

const StatCard = ({
  title,
  amount,
  trend,
  trendLabel = 'vs last month',
  subtitle,
  icon: Icon,
  colorScheme = 'brand',
}) => {
  const schemes = {
    brand: {
      bgIcon: 'bg-brand-50 text-brand-600 border border-brand-200/80',
      glow: 'hover:border-brand-300',
    },
    income: {
      bgIcon: 'bg-emerald-50 text-emerald-600 border border-emerald-200/80',
      glow: 'hover:border-emerald-300',
    },
    expense: {
      bgIcon: 'bg-rose-50 text-rose-600 border border-rose-200/80',
      glow: 'hover:border-rose-300',
    },
    purple: {
      bgIcon: 'bg-purple-50 text-purple-600 border border-purple-200/80',
      glow: 'hover:border-purple-300',
    },
  };

  const currentScheme = schemes[colorScheme] || schemes.brand;

  const isPositiveTrend = trend && trend > 0;
  const isNegativeTrend = trend && trend < 0;

  return (
    <Card
      hoverEffect
      className={`relative overflow-hidden transition-all duration-200 ${currentScheme.glow}`}
      padding="p-5 sm:p-6"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {formatCurrency(amount)}
          </h3>
        </div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm shrink-0 ${currentScheme.bgIcon}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {trend !== undefined && trend !== null ? (
          <div className="flex items-center gap-1.5 font-semibold">
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md ${
                isPositiveTrend
                  ? 'text-emerald-700 bg-emerald-50'
                  : isNegativeTrend
                  ? 'text-rose-700 bg-rose-50'
                  : 'text-slate-600 bg-slate-100'
              }`}
            >
              {isPositiveTrend ? (
                <HiArrowTrendingUp className="w-3.5 h-3.5" />
              ) : (
                <HiArrowTrendingDown className="w-3.5 h-3.5" />
              )}
              {isPositiveTrend ? '+' : ''}
              {trend}%
            </span>
            <span className="text-slate-400 font-normal">{trendLabel}</span>
          </div>
        ) : (
          <span className="text-slate-400">{subtitle || 'Live verified metrics'}</span>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
