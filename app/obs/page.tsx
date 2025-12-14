'use client';

import { useState, useEffect } from 'react';

// OBS页面数据类型
interface OBSData {
    completed: number;
    total: number;
    percentage: number;
}

export default function SimpleOBSPage() {
    const [data, setData] = useState<OBSData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 360000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const response = await fetch('/api/osu/player');

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const result = await response.json();

            if (result.error) {
                throw new Error(result.message || '获取数据失败');
            }

            setData({
                completed: result.completion.completed,
                total: result.completion.total,
                percentage: result.completion.percentage,
            });
        } catch (err) {
            console.error('获取OBS数据失败:', err);
            // 出错时保持原有数据
        } finally {
            setLoading(false);
        }
    };

    // 加载状态
    if (loading || !data) {
        return (
            <div className="min-h-screen bg-transparent text-white flex items-center justify-center font-mono">
                <div className="text-center">
                    <div className="text-4xl font-bold">加载中...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent text-white font-mono">
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                {/* 主要进度显示 - 超大字体 */}
                <div className="text-center mb-4">
                    <div className="text-7xl font-bold tracking-tight6 flex flex-row items-end">
                        {data.completed.toLocaleString()}<span className="text-gray-400">/</span><div className="text-4xl font-bold">{data.total.toLocaleString()}</div>
                        <div className="text-2xl font-bold text-pink-500 tracking-tight">
                            ({data.percentage.toFixed(1)}%)
                        </div>
                    </div>
                </div>
                {/* 进度条 */}
                <div className="w-full max-w-md ">
                    <div className="w-full bg-gray-800/50 rounded-full h-1">
                        <div
                            className="bg-white h-1 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, data.percentage)}%` }}
                        ></div>
                    </div>
                </div>

            </div>
        </div>
    );
}
