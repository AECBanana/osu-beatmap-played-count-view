import React from 'react';
import Image from 'next/image';
import { StatCard } from './StatCard';
import { ProgressBar } from './ProgressBar';

interface PlayerDashboardProps {
    data: {
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
    };
}

export function PlayerDashboard({ data }: PlayerDashboardProps) {
    const { player, stats, completion } = data;

    // 格式化大数字
    const formatNumber = (num: number): string => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    };

    // 格式化时间
    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days}天`;
        }
        return `${hours}小时`;
    };

    // 计算等级进度百分比
    const levelProgressPercentage = player.level_progress;

    return (
        <div className="space-y-8">
            {/* 玩家信息卡片 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Rank图通关进度卡片 */}
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 p-6 border border-pink-100 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        全排行图游玩进度
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    当前进度 ({completion.percentage.toFixed(1)}%)
                                </span>
                                <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                                    {completion.completed.toLocaleString()} / {completion.total.toLocaleString()}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                                <div
                                    className="bg-gradient-to-r from-pink-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                                    style={{ width: `${Math.min(100, completion.percentage)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                <div className="text-gray-500 dark:text-gray-400">已游玩</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {completion.completed.toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                <div className="text-gray-500 dark:text-gray-400">剩余数量</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {(completion.total - completion.completed).toLocaleString()}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                <div className="text-gray-500 dark:text-gray-400">完成百分比</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {completion.percentage.toFixed(1)}%
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                                <div className="text-gray-500 dark:text-gray-400">总谱面数</div>
                                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {completion.total.toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* 玩家头像 */}
                        <div className="relative">
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-pink-500">
                                {player.avatar_url ? (
                                    <Image
                                        src={player.avatar_url}
                                        alt={player.username}
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                                        <span className="text-white text-2xl font-bold">
                                            {player.username.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                                {player.country_code}
                            </div>
                        </div>

                        {/* 玩家基本信息 */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                                        {player.username}
                                    </h2>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-gray-600 dark:text-gray-400">
                                            {player.pp.toLocaleString()} PP
                                        </span>

                                    </div>
                                </div>
                            </div>

                            {/* 等级进度条 */}
                            <div className="mt-6">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Level {Math.floor(player.level)}
                                    </span>
                                    <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                                        {levelProgressPercentage}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                                        style={{ width: `${levelProgressPercentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 主要统计卡片网格 - 3x4布局 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {/* 等级卡片 */}
                <StatCard
                    title="PP"
                    value={`${Math.floor(player.pp)}`}
                    icon="⭐"
                    description={"PP"}
                    color="yellow"
                />
                <StatCard
                    title="Rank"
                    value={`#${player.rank}`}
                    icon="⭐"
                    description={"排行"}
                    color="yellow"
                />
                {/* 准确率 */}
                <StatCard
                    title="准确率"
                    value={`${stats.hit_accuracy.toFixed(2)}%`}
                    icon="🎯"
                    description="Hit Accuracy"
                    color="teal"
                />
                {/* 总游玩次数 */}
                <StatCard
                    title="总游玩次数"
                    value={stats.play_count.toLocaleString()}
                    icon="🎮"
                    description="Total Plays"
                    color="blue"
                />

                {/* 游玩时间 */}
                <StatCard
                    title="游玩时间"
                    value={formatTime(stats.play_time)}
                    icon="⏱️"
                    description={`${stats.play_time_hours} 小时`}
                    color="green"
                />

                {/* Ranked分数 */}
                <StatCard
                    title="Ranked分数"
                    value={formatNumber(stats.ranked_score)}
                    icon="🏆"
                    description="Ranked Score"
                    color="purple"
                />

                {/* 总分数 */}
                <StatCard
                    title="总分数"
                    value={formatNumber(stats.total_score)}
                    icon="💯"
                    description="Total Score"
                    color="pink"
                />


                {/* 每次游玩击打数 */}
                <StatCard
                    title="平均击打数"
                    value={stats.hits_per_play.toFixed(1)}
                    icon="👊"
                    description="Hits per Play"
                    color="orange"
                />

                {/* 最大连击 */}
                <StatCard
                    title="最大连击"
                    value={stats.maximum_combo.toLocaleString()}
                    icon="🔗"
                    description="Max Combo"
                    color="red"
                />

                {/* 回放被观看次数 */}
                <StatCard
                    title="回放观看"
                    value={stats.replays_watched_by_others.toLocaleString()}
                    icon="👁️"
                    description="Replays Watched"
                    color="indigo"
                />



                {/* 奖章数 */}
                <StatCard
                    title="奖章数"
                    value={stats.user_achievements_count.toLocaleString()}
                    icon="🏅"
                    description="Achievements"
                    color="amber"
                />

                {/* 已玩谱面数 */}
                <StatCard
                    title="已玩谱面"
                    value={stats.beatmap_playcounts_count.toLocaleString()}
                    icon="📊"
                    description="Unique Beatmaps"
                    color="lime"
                />
            </div>

            {/* 评分等级长卡片 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-blue-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    评分等级统计
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="bg-gradient-to-br from-gray-400 to-gray-600 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-white mb-1">SSH</div>
                        <div className="text-3xl font-bold text-white">{stats.grade_counts.ssh || 0}</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-white mb-1">SS</div>
                        <div className="text-3xl font-bold text-white">{stats.grade_counts.ss || 0}</div>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-300 to-amber-400 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-white mb-1">S</div>
                        <div className="text-3xl font-bold text-white">{stats.grade_counts.s || 0}</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-400 to-pink-500 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-white mb-1">SH</div>
                        <div className="text-3xl font-bold text-white">{stats.grade_counts.sh || 0}</div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-400 to-cyan-500 p-4 rounded-xl text-center">
                        <div className="text-2xl font-bold text-white mb-1">A</div>
                        <div className="text-3xl font-bold text-white">{stats.grade_counts.a || 0}</div>
                    </div>

                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">300Hit</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.count_300}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">100Hit</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.count_100}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">50Hit</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.count_50}</div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">Miss</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{stats.count_miss}</div>
                    </div>
                </div>
            </div>


        </div>
    );
}
