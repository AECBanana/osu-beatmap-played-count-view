import React from 'react';

export function LoadingSpinner() {
    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="relative">
                {/* 外圈 */}
                <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>

                {/* 旋转圈 */}
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-pink-500 border-r-purple-500 rounded-full animate-spin"></div>

                {/* 内圈 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>

                {/* 中心点 */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-pink-500 rounded-full"></div>
            </div>

            <div className="text-center">
                <p className="text-gray-700 dark:text-gray-300 font-medium">正在获取osu!玩家数据</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">请稍候...</p>
            </div>

            {/* 加载点动画 */}
            <div className="flex gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
        </div>
    );
}
