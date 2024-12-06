export interface ChannelData {
    success: boolean;
    info: {
        name: string;
        channelIcon: string;
        channelId: string | null;
    };
    data: {
        subsApi: number;
        subsApiLastHit: number;
    };
}
