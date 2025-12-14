// tosu WebSocket API v2 类型定义
// 基于 tosu.wiki/v2-websocket-api-response.md

export interface TosuState {
    number: number;
    name: string;
}

export interface TosuSession {
    playTime: number;
    playCount: number;
}

export interface TosuChatVisibilityStatus {
    number: number;
    name: string;
}

export interface TosuLeaderboardType {
    number: number;
    name: string;
}

export interface TosuLeaderboard {
    visible: boolean;
    type: TosuLeaderboardType;
}

export interface TosuProgressBar {
    number: number;
    name: string;
}

export interface TosuResolution {
    fullscreen: boolean;
    width: number;
    height: number;
    widthFullscreen: number;
    heightFullscreen: number;
}

export interface TosuClient {
    updateAvailable: boolean;
    branch: number;
    version: string;
}

export interface TosuScoreMeterType {
    number: number;
    name: string;
}

export interface TosuScoreMeter {
    type: TosuScoreMeterType;
    size: number;
}

export interface TosuCursor {
    useSkinCursor: boolean;
    autoSize: boolean;
    size: number;
}

export interface TosuMouse {
    rawInput: boolean;
    disableButtons: boolean;
    disableWheel: boolean;
    sensitivity: number;
}

export interface TosuMania {
    speedBPMScale: boolean;
    usePerBeatmapSpeedScale: boolean;
}

export interface TosuSort {
    number: number;
    name: string;
}

export interface TosuGroup {
    number: number;
    name: string;
}

export interface TosuSkin {
    useDefaultSkinInEditor: boolean;
    ignoreBeatmapSkins: boolean;
    tintSliderBall: boolean;
    useTaikoSkin: boolean;
    name: string;
}

export interface TosuMode {
    number: number;
    name: string;
}

export interface TosuVolume {
    master: number;
    music: number;
    effect: number;
}

export interface TosuOffset {
    universal: number;
}

export interface TosuAudio {
    ignoreBeatmapSounds: boolean;
    useSkinSamples: boolean;
    volume: TosuVolume;
    offset: TosuOffset;
}

export interface TosuBackground {
    dim: number;
    video: boolean;
    storyboard: boolean;
}

export interface TosuKeybinds {
    osu: {
        k1: string;
        k2: string;
        smokeKey: string;
    };
    fruits: {
        k1: string;
        k2: string;
        dash: string;
    };
    taiko: {
        innerLeft: string;
        innerRight: string;
        outerLeft: string;
        outerRight: string;
    };
    quickRetry: string;
}

export interface TosuSettings {
    interfaceVisible: boolean;
    replayUIVisible: boolean;
    chatVisibilityStatus: TosuChatVisibilityStatus;
    leaderboard: TosuLeaderboard;
    progressBar: TosuProgressBar;
    bassDensity: number;
    resolution: TosuResolution;
    client: TosuClient;
    scoreMeter: TosuScoreMeter;
    cursor: TosuCursor;
    mouse: TosuMouse;
    mania: TosuMania;
    sort: TosuSort;
    group: TosuGroup;
    skin: TosuSkin;
    mode: TosuMode;
    audio: TosuAudio;
    background: TosuBackground;
    keybinds: TosuKeybinds;
}

export interface TosuUserStatus {
    number: number;
    name: string;
}

export interface TosuBanchoStatus {
    number: number;
    name: string;
}

export interface TosuCountryCode {
    number: number;
    name: string;
}

export interface TosuProfile {
    userStatus: TosuUserStatus;
    banchoStatus: TosuBanchoStatus;
    id: number;
    name: string;
    mode: TosuMode;
    rankedScore: number;
    level: number;
    accuracy: number;
    pp: number;
    playCount: number;
    globalRank: number;
    countryCode: TosuCountryCode;
    backgroundColour: string;
}

export interface TosuTime {
    live: number;
    firstObject: number;
    lastObject: number;
}

export interface TosuBeatmapStatus {
    number: number;
}

export interface TosuStars {
    live: number;
    total: number;
}

export interface TosuAR {
    original: number;
    converted: number;
}

export interface TosuCS {
    original: number;
    converted: number;
}

export interface TosuOD {
    original: number;
    converted: number;
}

export interface TosuHP {
    original: number;
    converted: number;
}

export interface TosuBPM {
    common: number;
    min: number;
    max: number;
}

export interface TosuObjects {
    circles: number;
    sliders: number;
    spinners: number;
    holds: number;
    total: number;
}

export interface TosuBeatmapStats {
    stars: TosuStars;
    ar: TosuAR;
    cs: TosuCS;
    od: TosuOD;
    hp: TosuHP;
    bpm: TosuBPM;
    objects: TosuObjects;
    maxCombo: number;
}

export interface TosuBeatmap {
    time: TosuTime;
    status: TosuBeatmapStatus;
    checksum: string;
    id: number;
    set: number;
    artist: string;
    artistUnicode: string;
    title: string;
    titleUnicode: string;
    mapper: string;
    version: string;
    stats: TosuBeatmapStats;
}

export interface TosuHealthBar {
    normal: number;
    smooth: number;
}

export interface TosuHits {
    "0": number;
    "50": number;
    "100": number;
    "300": number;
    geki: number;
    katu: number;
    sliderBreaks: number;
}

export interface TosuCombo {
    current: number;
    max: number;
}

export interface TosuMods {
    number: number;
    name: string;
}

export interface TosuRank {
    current: string;
    maxThisPlay: string;
}

export interface TosuPP {
    current: number;
    fc: number;
    maxAchievedThisPlay: number;
}

export interface TosuPlay {
    playerName: string;
    mode: TosuMode;
    score: number;
    accuracy: number;
    healthBar: TosuHealthBar;
    hits: TosuHits;
    hitErrorArray: number[];
    combo: TosuCombo;
    mods: TosuMods;
    rank: TosuRank;
    pp: TosuPP;
    unstableRate: number;
}

export interface TosuAccuracyGraph {
    "95": number;
    "96": number;
    "97": number;
    "98": number;
    "99": number;
    "100": number;
}

export interface TosuGraph {
    series: number[];
    xaxis: number[];
}

export interface TosuPerformance {
    accuracy: TosuAccuracyGraph;
    graph: TosuGraph;
}

export interface TosuResultsScreen {
    playerName: string;
    mode: TosuMode;
    score: number;
    accuracy: number;
    hits: {
        "0": number;
        "50": number;
        "100": number;
        "300": number;
        geki: number;
        katu: number;
    };
    mods: TosuMods;
    rank: string;
    maxCombo: number;
    pp: {
        current: number;
        fc: number;
    };
    createdAt: string;
}

export interface TosuFolders {
    game: string;
    skin: string;
    songs: string;
    beatmap: string;
}

export interface TosuFiles {
    beatmap: string;
    background: string;
    audio: string;
}

export interface TosuDirectPath {
    beatmapFile: string;
    beatmapBackground: string;
    beatmapAudio: string;
    beatmapFolder: string;
    skinFolder: string;
}

export interface TosuTourneyUser {
    id: number;
    name: string;
    country: string;
    accuracy: number;
    rankedScore: number;
    playCount: number;
    globalRank: number;
    totalPP: number;
}

export interface TosuTourneyPlay {
    playerName: string;
    mode: TosuMode;
    score: number;
    accuracy: number;
    healthBar: TosuHealthBar;
    hits: TosuHits;
    hitErrorArray: number[];
    mods: TosuMods;
    combo: TosuCombo;
    rank: TosuRank;
    pp: TosuPP;
    unstableRate: number;
}

export interface TosuTourneyClient {
    team: string;
    user: TosuTourneyUser;
    play: TosuTourneyPlay;
}

export interface TosuTourney {
    scoreVisible: boolean;
    starsVisible: boolean;
    ipcState: number;
    bestOF: number;
    team: {
        left: string;
        right: string;
    };
    points: {
        left: number;
        right: number;
    };
    chat: any[];
    totalScore: {
        left: number;
        right: number;
    };
    clients: TosuTourneyClient[];
}

// 完整的 tosu WebSocket v2 响应类型
export interface TosuWebSocketResponse {
    state: TosuState;
    session: TosuSession;
    settings: TosuSettings;
    profile: TosuProfile;
    beatmap: TosuBeatmap;
    play: TosuPlay;
    leaderboard: any[];
    performance: TosuPerformance;
    resultsScreen: TosuResultsScreen;
    folders: TosuFolders;
    files: TosuFiles;
    directPath: TosuDirectPath;
    tourney: TosuTourney;
}

// 简化的 tosu 状态类型，用于 OBS 页面
export interface SimplifiedTosuState {
    gameState: string;
    isPlaying: boolean;
    isResultsScreen: boolean;
    currentBeatmap?: {
        title: string;
        artist: string;
        mapper: string;
        version: string;
        stars: number;
    };
    currentPlay?: {
        accuracy: number;
        score: number;
        combo: number;
        rank: string;
    };
    profile?: {
        name: string;
        pp: number;
        accuracy: number;
        globalRank: number;
    };
}
