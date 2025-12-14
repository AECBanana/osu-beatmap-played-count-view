import React from 'react';

interface StatCardProps {
    title: string;
    value: string;
    icon: string;
    description: string;
    trend?: string;
    color: 'blue' | 'green' | 'yellow' | 'purple' | 'pink' | 'teal' | 'orange' | 'red' | 'indigo' | 'cyan' | 'amber' | 'lime';
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-100 dark:border-blue-800',
        text: 'text-blue-600 dark:text-blue-400',
        iconBg: 'bg-blue-100 dark:bg-blue-800',
    },
    green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-100 dark:border-green-800',
        text: 'text-green-600 dark:text-green-400',
        iconBg: 'bg-green-100 dark:bg-green-800',
    },
    yellow: {
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-100 dark:border-yellow-800',
        text: 'text-yellow-600 dark:text-yellow-400',
        iconBg: 'bg-yellow-100 dark:bg-yellow-800',
    },
    purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        border: 'border-purple-100 dark:border-purple-800',
        text: 'text-purple-600 dark:text-purple-400',
        iconBg: 'bg-purple-100 dark:bg-purple-800',
    },
    pink: {
        bg: 'bg-pink-50 dark:bg-pink-900/20',
        border: 'border-pink-100 dark:border-pink-800',
        text: 'text-pink-600 dark:text-pink-400',
        iconBg: 'bg-pink-100 dark:bg-pink-800',
    },
    teal: {
        bg: 'bg-teal-50 dark:bg-teal-900/20',
        border: 'border-teal-100 dark:border-teal-800',
        text: 'text-teal-600 dark:text-teal-400',
        iconBg: 'bg-teal-100 dark:bg-teal-800',
    },
    orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        border: 'border-orange-100 dark:border-orange-800',
        text: 'text-orange-600 dark:text-orange-400',
        iconBg: 'bg-orange-100 dark:bg-orange-800',
    },
    red: {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-100 dark:border-red-800',
        text: 'text-red-600 dark:text-red-400',
        iconBg: 'bg-red-100 dark:bg-red-800',
    },
    indigo: {
        bg: 'bg-indigo-50 dark:bg-indigo-900/20',
        border: 'border-indigo-100 dark:border-indigo-800',
        text: 'text-indigo-600 dark:text-indigo-400',
        iconBg: 'bg-indigo-100 dark:bg-indigo-800',
    },
    cyan: {
        bg: 'bg-cyan-50 dark:bg-cyan-900/20',
        border: 'border-cyan-100 dark:border-cyan-800',
        text: 'text-cyan-600 dark:text-cyan-400',
        iconBg: 'bg-cyan-100 dark:bg-cyan-800',
    },
    amber: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-100 dark:border-amber-800',
        text: 'text-amber-600 dark:text-amber-400',
        iconBg: 'bg-amber-100 dark:bg-amber-800',
    },
    lime: {
        bg: 'bg-lime-50 dark:bg-lime-900/20',
        border: 'border-lime-100 dark:border-lime-800',
        text: 'text-lime-600 dark:text-lime-400',
        iconBg: 'bg-lime-100 dark:bg-lime-800',
    },
};

export function StatCard({ title, value, icon, description, trend, color }: StatCardProps) {
    const colors = colorClasses[color];

    return (
        <div className={`${colors.bg} border ${colors.border} rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`${colors.iconBg} w-10 h-10 rounded-lg flex items-center justify-center`}>
                            <span className="text-lg">{icon}</span>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{description}</p>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
                        {trend && (
                            <div className="flex items-center gap-1 mt-1">
                                <span className={`text-xs font-medium ${colors.text}`}>{trend}</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">vs 上周</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>


        </div>
    );
}
