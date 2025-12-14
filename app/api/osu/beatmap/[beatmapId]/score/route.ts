import { NextRequest, NextResponse } from 'next/server';
import { hasPlayerBeatmapScore } from '@/lib/osu-api';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ beatmapId: string }> }
) {
    try {
        const params = await context.params;
        const beatmapId = parseInt(params.beatmapId);

        if (isNaN(beatmapId) || beatmapId <= 0) {
            return NextResponse.json(
                { error: '无效的谱面ID', beatmapId: params.beatmapId, hasScore: false },
                { status: 400 }
            );
        }

        // 检查玩家是否有此谱面的分数
        const hasScore = await hasPlayerBeatmapScore(beatmapId);

        return NextResponse.json({
            beatmapId,
            hasScore,
            timestamp: new Date().toISOString()
        });
    } catch (error) {

        return NextResponse.json(
            {
                error: '检查谱面分数失败',
                message: error instanceof Error ? error.message : '未知错误',
                hasScore: false,
                details: process.env.NODE_ENV === 'development' ? error : undefined
            },
            { status: 500 }
        );
    }
}
