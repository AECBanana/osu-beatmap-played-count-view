'use client';

import { useState, useEffect, useRef } from 'react';
import { TosuClient, TosuGameState } from '@/lib/tosu-client';
import { SimplifiedTosuState } from '@/lib/tosu-types';
import { hasPlayerBeatmapScore } from '@/lib/osu-api';

// OBS页面数据类型
interface OBSData {
    completed: number;
    total: number;
    percentage: number;
}

// 检查mods是否包含auto
function checkForAutoMod(mods?: { number: number; name: string }): boolean {
    if (!mods) {
        return false;
    }

    // auto mod的数字值是8192
    // 检查mods.number是否包含8192（使用位运算）
    const autoModValue = 8192;
    const hasAutoByNumber = (mods.number & autoModValue) !== 0;

    // 同时检查mods.name是否包含"Auto"或"auto"
    const hasAutoByName = mods.name.toLowerCase().includes('auto');

    return hasAutoByNumber || hasAutoByName;
}

export default function SimpleOBSPage() {
    const [data, setData] = useState<OBSData | null>(null);
    const [loading, setLoading] = useState(true);
    const [tosuState, setTosuState] = useState<SimplifiedTosuState | null>(null);
    const [isTosuConnected, setIsTosuConnected] = useState(false);
    const [tempCompleted, setTempCompleted] = useState(0); // 临时增加的完成计数

    const tosuClientRef = useRef<TosuClient | null>(null);
    const apiCompletedRef = useRef<number>(0); // 从API获取的基准完成数
    const beatmapScoreCacheRef = useRef<Map<number, boolean>>(new Map()); // 谱面分数缓存：谱面ID -> 是否有分数
    const beatmapSkipCacheRef = useRef<Map<number, boolean>>(new Map()); // 谱面跳过缓存：谱面ID -> 是否跳过计数（因为有auto mod）

    useEffect(() => {
        // 初始化时获取API数据
        fetchData();

        // 初始化 tosu 客户端
        const tosuClient = new TosuClient({
            url: 'ws://127.0.0.1:24050/websocket/v2',
            autoReconnect: true,
            reconnectInterval: 5000,
            onStateChange: (state) => {
                setTosuState(state);
            },
            onPlayStarted: async (beatmapId, mods) => {
                console.log(`Play状态开始，谱面ID: ${beatmapId}, Mods:`, mods);

                if (beatmapId === 0) {
                    console.log('谱面ID为0，跳过检查');
                    return;
                }

                // 检查mods是否包含auto
                const hasAutoMod = checkForAutoMod(mods);
                if (hasAutoMod) {
                    console.log(`检测到auto mod，谱面 ${beatmapId} 将跳过计数`);
                    beatmapSkipCacheRef.current.set(beatmapId, true);
                    // 即使有新谱面，有auto mod也不计数
                    return;
                } else {
                    // 没有auto mod，清除跳过缓存
                    beatmapSkipCacheRef.current.delete(beatmapId);
                }

                // 检查玩家是否已经有这个谱面的分数
                try {
                    console.log(`检查谱面 ${beatmapId} 是否已有分数...`);
                    const hasScore = await hasPlayerBeatmapScore(beatmapId);
                    console.log(`谱面 ${beatmapId} 已有分数: ${hasScore}`);

                    // 缓存结果
                    beatmapScoreCacheRef.current.set(beatmapId, hasScore);

                    if (!hasScore) {
                        console.log(`谱面 ${beatmapId} 是新谱面，完成后将增加计数`);
                    } else {
                        console.log(`谱面 ${beatmapId} 已有分数，完成后不增加计数`);
                    }
                } catch (error) {
                    console.error(`检查谱面 ${beatmapId} 分数失败:`, error);
                    // 如果检查失败，保守起见假设已有分数（不增加计数）
                    beatmapScoreCacheRef.current.set(beatmapId, true);
                }
            },
            onSongCompleted: async (beatmapId, isNewCompletion) => {
                console.log(`歌曲完成，谱面ID: ${beatmapId}`);

                if (beatmapId === 0) {
                    console.log('谱面ID为0，跳过计数');
                    return;
                }

                // 检查是否因为auto mod而跳过计数
                const shouldSkip = beatmapSkipCacheRef.current.get(beatmapId);
                if (shouldSkip) {
                    console.log(`谱面 ${beatmapId} 有auto mod，跳过计数`);
                    // 清除跳过缓存，以便下次重新检查
                    beatmapSkipCacheRef.current.delete(beatmapId);
                    return;
                }

                // 从缓存中获取谱面分数检查结果
                const hasScore = beatmapScoreCacheRef.current.get(beatmapId);

                if (hasScore === undefined) {
                    console.log(`谱面 ${beatmapId} 没有缓存结果，重新检查...`);
                    try {
                        const hasScoreResult = await hasPlayerBeatmapScore(beatmapId);
                        beatmapScoreCacheRef.current.set(beatmapId, hasScoreResult);

                        if (!hasScoreResult) {
                            console.log('增加临时计数（新谱面）');
                            setTempCompleted(prev => prev + 1);
                        } else {
                            console.log('谱面已有分数，不增加计数');
                        }
                    } catch (error) {
                        console.error('检查谱面分数失败:', error);
                        // 如果检查失败，保守起见不增加计数
                    }
                } else if (!hasScore) {
                    // 玩家没有这个谱面的分数，增加临时计数
                    console.log('增加临时计数（新谱面）');
                    setTempCompleted(prev => prev + 1);

                    // 更新缓存，现在玩家已经有分数了
                    beatmapScoreCacheRef.current.set(beatmapId, true);
                } else {
                    console.log('谱面已有分数，不增加计数');
                }
            },
            onConnected: () => {
                console.log('tosu 已连接');
                setIsTosuConnected(true);
            },
            onDisconnected: () => {
                console.log('tosu 已断开');
                setIsTosuConnected(false);
                // 清空缓存
                beatmapScoreCacheRef.current.clear();
            },
            onError: (error) => {
                console.error('tosu 连接错误:', error);
            }
        });

        tosuClientRef.current = tosuClient;

        // 连接 tosu
        tosuClient.connect();

        // 清理函数
        return () => {
            if (tosuClientRef.current) {
                tosuClientRef.current.disconnect();
                tosuClientRef.current = null;
            }
            // 清空缓存
            beatmapScoreCacheRef.current.clear();
        };
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

            // 保存API获取的基准完成数
            apiCompletedRef.current = result.completion.completed;

            // 重置临时计数（因为API返回的是最新数据）
            setTempCompleted(0);

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
                    <div className="mt-4 text-sm text-gray-400">
                        正在连接到 tosu...
                    </div>
                </div>
            </div>
        );
    }

    // 计算总完成数（API基准 + 临时增加）
    const totalCompleted = data.completed + tempCompleted;
    const totalPercentage = data.total > 0 ? Math.min(100, (totalCompleted / data.total) * 100) : 0;

    return (
        <div className="min-h-screen bg-transparent text-white font-mono">
            <div className="flex flex-col items-center justify-center min-h-screen p-4">
                {/* tosu 状态指示器 */}
                <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${isTosuConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <span className="text-sm text-gray-400">
                        {isTosuConnected ? 'tosu 已连接' : 'tosu 未连接'}
                    </span>
                </div>

                {/* 当前游戏状态显示 */}
                {tosuState && (
                    <div className="absolute top-4 left-4 text-sm text-gray-400">
                        <div>状态: {tosuState.gameState}</div>
                        {tosuState.currentBeatmap && (
                            <div className="mt-1">
                                {tosuState.currentBeatmap.artist} - {tosuState.currentBeatmap.title}
                            </div>
                        )}
                    </div>
                )}

                {/* 主要进度显示 - 超大字体 */}
                <div className="text-center mb-4">
                    <div className="text-7xl font-bold tracking-tight6 flex flex-row items-end">
                        <div className="relative">
                            {totalCompleted.toLocaleString()}
                            {tempCompleted > 0 && (
                                <span className="absolute -top-4 -right-4 text-lg text-green-500 font-bold">
                                    +{tempCompleted}
                                </span>
                            )}
                        </div>
                        <span className="text-gray-400">/</span>
                        <div className="text-4xl font-bold">{data.total.toLocaleString()}</div>
                        <div className="text-2xl font-bold text-pink-500 tracking-tight">
                            ({totalPercentage.toFixed(1)}%)
                        </div>
                    </div>

                    {/* 临时计数提示 */}
                    {tempCompleted > 0 && (
                        <div className="mt-2 text-sm text-green-400">
                            直播中已完成 {tempCompleted} 首歌曲
                        </div>
                    )}
                </div>

                {/* 进度条 */}
                <div className="w-full max-w-md">
                    <div className="w-full bg-gray-800/50 rounded-full h-1">
                        <div
                            className="bg-white h-1 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, totalPercentage)}%` }}
                        ></div>
                    </div>
                </div>

                {/* 底部信息 */}
                <div className="mt-8 text-center text-sm text-gray-500">
                    <div>数据源: {isTosuConnected ? 'tosu 实时数据' : 'osu! API'}</div>
                    <div className="mt-1">最后更新: {new Date().toLocaleTimeString()}</div>
                </div>
            </div>
        </div>
    );
}
