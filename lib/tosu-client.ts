import { TosuWebSocketResponse, SimplifiedTosuState } from './tosu-types';

export type TosuGameState = 'Menu' | 'Playing' | 'ResultsScreen' | 'Editing' | 'SongSelect' | 'Watching' | 'Unknown';

export interface TosuClientOptions {
    url?: string;
    autoReconnect?: boolean;
    reconnectInterval?: number;
    onStateChange?: (state: SimplifiedTosuState) => void;
    onPlayStarted?: (beatmapId: number, mods?: { number: number; name: string }) => void;
    onSongCompleted?: (beatmapId: number, isNewCompletion: boolean) => void;
    onConnected?: () => void;
    onDisconnected?: () => void;
    onError?: (error: Error) => void;
}

export class TosuClient {
    private ws: WebSocket | null = null;
    private url: string;
    private autoReconnect: boolean;
    private reconnectInterval: number;
    private reconnectTimer: NodeJS.Timeout | null = null;
    private isConnecting = false;
    private lastState: TosuGameState = 'Unknown';
    private currentState: SimplifiedTosuState = {
        gameState: 'Unknown',
        isPlaying: false,
        isResultsScreen: false,
    };

    // 事件回调
    private onStateChange?: (state: SimplifiedTosuState) => void;
    private onPlayStarted?: (beatmapId: number, mods?: { number: number; name: string }) => void;
    private onSongCompleted?: (beatmapId: number, isNewCompletion: boolean) => void;
    private onConnected?: () => void;
    private onDisconnected?: () => void;
    private onError?: (error: Error) => void;

    constructor(options: TosuClientOptions = {}) {
        this.url = options.url || 'ws://127.0.0.1:24050/websocket/v2';
        this.autoReconnect = options.autoReconnect !== false;
        this.reconnectInterval = options.reconnectInterval || 5000;

        this.onStateChange = options.onStateChange;
        this.onPlayStarted = options.onPlayStarted;
        this.onSongCompleted = options.onSongCompleted;
        this.onConnected = options.onConnected;
        this.onDisconnected = options.onDisconnected;
        this.onError = options.onError;
    }

    /**
     * 连接到 tosu WebSocket 服务器
     */
    public connect(): void {
        if (this.ws?.readyState === WebSocket.OPEN || this.isConnecting) {
            return;
        }

        this.isConnecting = true;

        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = this.handleOpen.bind(this);
            this.ws.onmessage = this.handleMessage.bind(this);
            this.ws.onclose = this.handleClose.bind(this);
            this.ws.onerror = this.handleError.bind(this);
        } catch (error) {
            this.isConnecting = false;
            this.handleError(error as Error);
        }
    }

    /**
     * 断开连接
     */
    public disconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }

        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }

        this.isConnecting = false;
    }

    /**
     * 获取当前状态
     */
    public getCurrentState(): SimplifiedTosuState {
        return { ...this.currentState };
    }

    /**
     * 检查是否已连接
     */
    public isConnected(): boolean {
        return this.ws?.readyState === WebSocket.OPEN;
    }

    /**
     * 处理 WebSocket 连接打开
     */
    private handleOpen(): void {
        this.isConnecting = false;
        console.log('tosu WebSocket 连接已建立');

        if (this.onConnected) {
            this.onConnected();
        }
    }

    /**
     * 处理 WebSocket 消息
     */
    private handleMessage(event: MessageEvent): void {
        try {
            const data: TosuWebSocketResponse = JSON.parse(event.data);
            this.processTosuData(data);
        } catch (error) {
            console.error('解析 tosu 数据失败:', error);
        }
    }

    /**
     * 处理 WebSocket 连接关闭
     */
    private handleClose(): void {
        console.log('tosu WebSocket 连接已关闭');

        if (this.onDisconnected) {
            this.onDisconnected();
        }

        this.ws = null;
        this.isConnecting = false;

        // 自动重连
        if (this.autoReconnect) {
            this.scheduleReconnect();
        }
    }

    /**
     * 处理 WebSocket 错误
     */
    private handleError(error: Error | Event): void {
        const errorObj = error instanceof Error ? error : new Error('WebSocket 错误');
        console.error('tosu WebSocket 错误:', errorObj);

        if (this.onError) {
            this.onError(errorObj);
        }

        // 自动重连
        if (this.autoReconnect && !this.isConnecting) {
            this.scheduleReconnect();
        }
    }

    /**
     * 调度重连
     */
    private scheduleReconnect(): void {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
        }

        this.reconnectTimer = setTimeout(() => {
            console.log('尝试重新连接到 tosu...');
            this.connect();
        }, this.reconnectInterval);
    }

    /**
     * 处理 tosu 数据并检测状态变化
     */
    private processTosuData(data: TosuWebSocketResponse): void {
        const newGameState = data.state.name as TosuGameState;
        const prevGameState = this.lastState;

        // 更新最后状态
        this.lastState = newGameState;

        // 构建简化状态
        const simplifiedState: SimplifiedTosuState = {
            gameState: newGameState,
            isPlaying: newGameState === 'Playing',
            isResultsScreen: newGameState === 'ResultsScreen',
        };

        // 添加谱面信息
        if (data.beatmap && data.beatmap.title) {
            simplifiedState.currentBeatmap = {
                title: data.beatmap.title,
                artist: data.beatmap.artist,
                mapper: data.beatmap.mapper,
                version: data.beatmap.version,
                stars: data.beatmap.stats?.stars?.total || 0,
            };
        }

        // 添加游玩信息
        if (data.play && data.play.playerName) {
            simplifiedState.currentPlay = {
                accuracy: data.play.accuracy,
                score: data.play.score,
                combo: data.play.combo.current,
                rank: data.play.rank.current,
            };
        }

        // 添加玩家信息
        if (data.profile && data.profile.name) {
            simplifiedState.profile = {
                name: data.profile.name,
                pp: data.profile.pp,
                accuracy: data.profile.accuracy,
                globalRank: data.profile.globalRank,
            };
        }

        // 更新当前状态
        this.currentState = simplifiedState;

        // 检测play状态开始事件
        if (prevGameState !== 'Playing' && newGameState === 'Playing') {
            console.log('检测到play状态开始！');
            if (this.onPlayStarted) {
                // 获取谱面ID，如果没有则使用0
                const beatmapId = data.beatmap?.id || 0;
                // 获取mods信息
                const mods = data.play?.mods;
                this.onPlayStarted(beatmapId, mods);
            }
        }

        // 检测歌曲完成事件
        if (prevGameState === 'Playing' && newGameState === 'ResultsScreen') {
            console.log('检测到歌曲完成！');
            if (this.onSongCompleted) {
                // 获取谱面ID，如果没有则使用0
                const beatmapId = data.beatmap?.id || 0;
                // 简化逻辑：假设每次完成都是新的（实际应该检查玩家是否已有此谱面的分数）
                // 这里我们无法知道玩家是否已经有此谱面的分数，所以暂时假设是新的
                const isNewCompletion = true;
                this.onSongCompleted(beatmapId, isNewCompletion);
            }
        }

        // 触发状态变化回调
        if (this.onStateChange) {
            this.onStateChange(simplifiedState);
        }
    }

    /**
     * 简化 tosu 数据用于显示
     */
    public static simplifyTosuData(data: TosuWebSocketResponse): SimplifiedTosuState {
        const gameState = data.state.name as TosuGameState;

        const simplified: SimplifiedTosuState = {
            gameState,
            isPlaying: gameState === 'Playing',
            isResultsScreen: gameState === 'ResultsScreen',
        };

        if (data.beatmap && data.beatmap.title) {
            simplified.currentBeatmap = {
                title: data.beatmap.title,
                artist: data.beatmap.artist,
                mapper: data.beatmap.mapper,
                version: data.beatmap.version,
                stars: data.beatmap.stats?.stars?.total || 0,
            };
        }

        if (data.play && data.play.playerName) {
            simplified.currentPlay = {
                accuracy: data.play.accuracy,
                score: data.play.score,
                combo: data.play.combo.current,
                rank: data.play.rank.current,
            };
        }

        if (data.profile && data.profile.name) {
            simplified.profile = {
                name: data.profile.name,
                pp: data.profile.pp,
                accuracy: data.profile.accuracy,
                globalRank: data.profile.globalRank,
            };
        }

        return simplified;
    }
}
