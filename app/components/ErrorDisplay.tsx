import React from 'react';

interface ErrorDisplayProps {
    message: string;
    onRetry?: () => void;
}

export function ErrorDisplay({ message, onRetry }: ErrorDisplayProps) {
    return (
        <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-red-100 dark:border-red-900/50 p-8">
            <div className="text-center">
                {/* 错误图标 */}
                <div className="relative inline-block mb-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 rounded-full flex items-center justify-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>

                        {/* 动画脉冲效果 */}
                        <div className="absolute inset-0 border-2 border-red-300 dark:border-red-700 rounded-full animate-ping opacity-20"></div>
                    </div>
                </div>

                {/* 错误信息 */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    获取数据失败
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {message}
                </p>

                {/* 可能的原因 */}
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 mb-6 text-left">
                    <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">可能的原因：</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>osu! API密钥未配置或已过期</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>玩家ID不正确或玩家不存在</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500 mt-0.5">•</span>
                            <span>网络连接问题或API服务暂时不可用</span>
                        </li>
                    </ul>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {onRetry && (
                        <button
                            onClick={onRetry}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 px-6 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                            </svg>
                            重试
                        </button>
                    )}

                    <a
                        href="https://osu.ppy.sh/home/account/edit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium py-3 px-6 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                        </svg>
                        检查API设置
                    </a>
                </div>

                {/* 检查清单 */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        请确保已正确配置 <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">.env.local</code> 文件
                    </p>
                </div>
            </div>
        </div>
    );
}
