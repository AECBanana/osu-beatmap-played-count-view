'use client';

import localFont from 'next/font/local'

const PoiretOne = localFont({
    src: './PoiretOne-Regular.ttf',
    display: 'swap',
})

import { useState, useEffect, useRef } from 'react';
import { TosuClient, TosuGameState } from '@/lib/tosu-client';
import { SimplifiedTosuState } from '@/lib/tosu-types';

// OBS页面数据类型
interface OBSData {
    completed: number;
    total: number;
    percentage: number;
}

// 检查mods是否包含auto
function checkForAutoMod(mods?: { number: number; name: string }): boolean {
    console.log('检查mods是否包含auto:', mods);

    if (!mods) {
        console.log('mods为空，返回false');
        return false;
    }

    // auto mod的数字值是8192
    // 检查mods.number是否包含8192（使用位运算）
    const autoModValue = 8192;
    const hasAutoByNumber = (mods.number & autoModValue) !== 0;
    console.log('通过数字检查auto mod:', hasAutoByNumber, 'mods.number:', mods.number);

    // 同时检查mods.name是否包含"Auto"或"auto"
    const hasAutoByName = mods.name.toLowerCase().includes('auto');
    console.log('通过名称检查auto mod:', hasAutoByName, 'mods.name:', mods.name);

    const result = hasAutoByNumber || hasAutoByName;
    console.log('最终结果:', result);
    return result;
}

export default function SimpleOBSPage() {
    const [data, setData] = useState<OBSData | null>(null);
    const [loading, setLoading] = useState(true);
    const [tosuState, setTosuState] = useState<SimplifiedTosuState | null>(null);
    const [isTosuConnected, setIsTosuConnected] = useState(false);
    const [tempCompleted, setTempCompleted] = useState(0); // 临时增加的完成计数

    const tosuClientRef = useRef<TosuClient | null>(null);
    const apiCompletedRef = useRef<number>(0); // 从API获取的基准完成数
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
            },
            onSongCompleted: async (beatmapId, isNewCompletion) => {
                console.log(`歌曲完成，谱面ID: ${beatmapId}, 是否是新完成: ${isNewCompletion}`);

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

                // 如果TosuClient检测到是新完成，增加临时计数
                if (isNewCompletion) {
                    console.log('增加临时计数（新谱面）');
                    setTempCompleted(prev => prev + 1);
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
                // 清空跳过缓存
                beatmapSkipCacheRef.current.clear();
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
            // 清空跳过缓存
            beatmapSkipCacheRef.current.clear();
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
        <div className="w-[1920px] h-[1080px] bg-transparent text-white overflow-hidden">

            {/* 当前游戏状态显示 */}
            {tosuState && (
                <div className="absolute bottom-4 left-4 text-xl text-white text-blob px-3 py-1 bg-black/50 rounded-md">
                    {/* <div>{tosuState.gameState}</div> */}
                    {tosuState.currentBeatmap && (
                        <div className="mt-1 flex flex-col">
                            <div className="text-gray-400 font-mono">BID {tosuState.currentBeatmap.id}</div>
                            <div>
                                {tosuState.currentBeatmap.artist} - {tosuState.currentBeatmap.title} [{tosuState.currentBeatmap.version}]
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 主要进度显示 - 超大字体 - 固定在右下角 */}
            <div className={`absolute bottom-8 right-8 text-right ${PoiretOne.className}`}>
                <div className="text-8xl font-bold tracking-tight flex flex-row items-end justify-end">
                    <div className="relative">
                        {totalCompleted.toLocaleString()}
                        {tempCompleted > 0 && (
                            <span className="absolute -top-6 -right-6 text-xl text-green-500 font-bold">
                                +{tempCompleted}
                            </span>
                        )}
                    </div>
                    <span className="text-gray-400 text-5xl mx-2">/</span>
                    <div className="text-5xl font-bold text-gray-200 flex flex-col">
                        <span className="text-xl font-bold text-pink-500 tracking-tight ml-2">{totalPercentage.toFixed(1)}%</span>
                        <span>{data.total.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* 进度条 - 也放在右下角，在数字下方 */}
            <div className="absolute bottom-4 right-8 w-96">
                <div className="w-full bg-gray-800/50 rounded-full h-2">
                    <div
                        className="bg-white h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min(100, totalPercentage)}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}
