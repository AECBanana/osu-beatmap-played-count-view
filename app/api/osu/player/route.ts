import { NextRequest, NextResponse } from 'next/server';
import { getPlayerInfo, getPlayerPlayCounts, getRankedBeatmapCompletion } from '@/lib/osu-api';

export async function GET(request: NextRequest) {
    try {
        // 获取玩家基本信息
        const playerInfo = await getPlayerInfo();

        // 获取游玩次数
        const playCounts = await getPlayerPlayCounts();

        // 获取rank图通关情况
        const completion = await getRankedBeatmapCompletion();

        // 获取玩家统计数据
        const stats = playerInfo.statistics;

        // 计算每次游玩击打数
        const hits_per_play = stats.play_count > 0 ? stats.total_hits / stats.play_count : 0;

        // 组合数据
        const responseData = {
            player: {
                id: playerInfo.id,
                username: playerInfo.username,
                avatar_url: playerInfo.avatar_url,
                country_code: playerInfo.country_code,
                rank: playerInfo.statistics?.global_rank || null,
                level: playerInfo.statistics?.level?.current || 0,
                level_progress: playerInfo.statistics?.level?.progress || 0,
                pp: playerInfo.statistics?.pp || 0,
            },
            stats: {
                // 基础统计
                play_count: playCounts.total_playcount,
                beatmap_playcounts_count: playCounts.beatmap_playcounts_count || 0,
                ranked_score: playCounts.ranked_score,
                total_score: playCounts.total_score,
                play_time: playCounts.play_time,
                play_time_hours: Math.round(playCounts.play_time / 3600),

                // 准确率和击打
                hit_accuracy: stats.hit_accuracy || 0,
                total_hits: stats.total_hits || 0,
                hits_per_play: parseFloat(hits_per_play.toFixed(1)),
                count_300: stats.count_300 || 0,
                count_100: stats.count_100 || 0,
                count_50: stats.count_50 || 0,
                count_miss: stats.count_miss || 0,

                // 连击和回放
                maximum_combo: stats.maximum_combo || 0,
                replays_watched_by_others: stats.replays_watched_by_others || 0,

                // 评分等级
                grade_counts: stats.grade_counts || {},

                // 奖章数
                user_achievements_count: playerInfo.user_achievements?.length || 0,
            },
            completion: {
                completed: completion.completed,
                total: completion.total,
                percentage: completion.percentage,
            },
            last_updated: new Date().toISOString(),
        };

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('API路由错误:', error);

        // 返回错误响应
        return NextResponse.json(
            {
                error: '获取玩家数据失败',
                message: error instanceof Error ? error.message : '未知错误',
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}
