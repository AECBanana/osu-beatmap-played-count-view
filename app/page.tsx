'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { PlayerDashboard } from '@/app/components/PlayerDashboard';
import { LoadingSpinner } from '@/app/components/LoadingSpinner';
import { ErrorDisplay } from '@/app/components/ErrorDisplay';

// 玩家数据类型
interface PlayerData {
  player: {
    id: number;
    username: string;
    avatar_url: string;
    country_code: string;
    rank: number | null;
    level: number;
    level_progress: number;
    pp: number;
  };
  stats: {
    // 基础统计
    play_count: number;
    beatmap_playcounts_count: number;
    ranked_score: number;
    total_score: number;
    play_time: number;
    play_time_hours: number;

    // 准确率和击打
    hit_accuracy: number;
    total_hits: number;
    hits_per_play: number;
    count_300: number;
    count_100: number;
    count_50: number;
    count_miss: number;

    // 连击和回放
    maximum_combo: number;
    replays_watched_by_others: number;

    // 评分等级
    grade_counts: {
      ss?: number;
      ssh?: number;
      s?: number;
      sh?: number;
      a?: number;
    };

    // 奖章数
    user_achievements_count: number;
  };
  completion: {
    completed: number;
    total: number;
    percentage: number;
  };
  last_updated: string;
}

export default function Home() {
  const [playerData, setPlayerData] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchPlayerData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/osu/player');

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.message || '获取数据失败');
      }

      setPlayerData(data);
    } catch (err) {
      console.error('获取玩家数据失败:', err);
      setError(err instanceof Error ? err.message : '未知错误');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    fetchPlayerData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black font-sans">


      <main className="container mx-auto px-4 py-8">
        {/* 页面标题 */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            进度追踪器
          </h2>

        </div>

        {/* 主要内容区域 */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <ErrorDisplay message={error} onRetry={handleRetry} />
          </div>
        ) : playerData ? (
          <PlayerDashboard data={playerData} />
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500 dark:text-gray-400">暂无数据</p>
          </div>
        )}


      </main>
    </div>
  );
}
