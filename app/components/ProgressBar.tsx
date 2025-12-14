import React from 'react';

interface ProgressBarProps {
    value: number;
    max: number;
    showLabels?: boolean;
    height?: 'sm' | 'md' | 'lg';
}

export function ProgressBar({ value, max, showLabels = true, height = 'md' }: ProgressBarProps) {
    const percentage = max > 0 ? (value / max) * 100 : 0;

    const heightClasses = {
        sm: 'h-2',
        md: 'h-3',
        lg: 'h-4',
    };

    return (
        <div className="w-full">
            {showLabels && (
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                    <span>进度</span>
                    <span className="font-medium">{percentage.toFixed(1)}%</span>
                </div>
            )}

            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full ${heightClasses[height]} overflow-hidden`}>
                <div
                    className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${Math.min(100, percentage)}%` }}
                >
                    {/* 动画光泽效果 */}
                    <div className="h-full w-1/3 bg-gradient-to-r from-white/20 to-transparent animate-shine rounded-full"></div>
                </div>
            </div>

            {showLabels && (
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                </div>
            )}
        </div>
    );
}
