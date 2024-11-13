import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT as unknown as number,
});

//#region Channels
export async function createChannelTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS anal_channels (
        channel_id TEXT NOT NULL,
        subs_api INTEGER NOT NULL,
        subs_api_hit BIGINT NOT NULL
    );
    `;

    const indexQuery = `CREATE INDEX IF NOT EXISTS idx_channel_id ON anal_channels(channel_id);`;

    try {
        await pool.query(query);
        await pool.query(indexQuery);
        console.log("Table and index created successfully");
    } catch (err) {
        console.error("Error creating table or index", err);
    }
}

export async function insertChannel(
    channelId: string,
    subsApi: number,
    subsApiHit: number,
) {
    const query = `INSERT INTO anal_channels (channel_id, subs_api, subs_api_hit) VALUES ($1, $2, $3)`;
    const values = [channelId, subsApi, subsApiHit];

    try {
        await pool.query(query, values);
        console.log("Channel inserted successfully");
    } catch (err) {
        console.error("Error inserting channel", err);
    }
}

export async function getChannelData(channelId: string) {
    const query = `SELECT subs_api, subs_api_hit FROM anal_channels WHERE channel_id = $1`;
    const values = [channelId];

    try {
        const res = await pool.query(query, values);

        return res.rows.map((row) => ({
            subs_api: row.subs_api,
            subs_api_hit: parseInt(row.subs_api_hit, 10),
        }));
    } catch (err) {
        console.error("Error getting channel data", err);
    }
}
//#endregion

//#region Videos
export async function createVideoTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS anal_videos (
        video_id TEXT NOT NULL,
        channel_id TEXT NOT NULL,
        video_uploaded TIMESTAMP NOT NULL,
        views INTEGER NOT NULL,
        likes INTEGER NOT NULL,
        comments INTEGER NOT NULL,
        last_updated BIGINT NOT NULL,
        video_is_studio BOOLEAN NOT NULL DEFAULT FALSE
    );
    `;

    const indexQuery = `
    CREATE INDEX IF NOT EXISTS idx_video_id ON anal_videos(video_id);
    CREATE INDEX IF NOT EXISTS idx_channel_id ON anal_videos(channel_id);
    `;

    try {
        await pool.query(query);
        await pool.query(indexQuery);
        console.log("Table and indices created successfully");
    } catch (err) {
        console.error("Error creating table or indices", err);
    }
}

export async function createVideoHistoryTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS anal_video_history (
        video_id TEXT NOT NULL,
        views INTEGER NOT NULL,
        likes INTEGER NOT NULL,
        comments INTEGER NOT NULL,
        entry_added TIMESTAMP NOT NULL,
        is_24hr BOOLEAN NOT NULL DEFAULT FALSE
    );
    `;

    const indexQuery = `
    CREATE INDEX IF NOT EXISTS idx_video_id ON anal_video_history(video_id);
    `;

    try {
        await pool.query(query);
        await pool.query(indexQuery);
        console.log("Table and indices created successfully");
    } catch (err) {
        console.error("Error creating table or indices", err);
    }
}

export async function insertNewVideo(
    videoId: string,
    channelId: string,
    videoUploaded: number,
    views: number,
    likes: number,
    comments: number,
    lastUpdated: number,
    videoIsStudio: boolean,
) {
    const query = `INSERT INTO anal_videos (video_id, channel_id, video_uploaded, views, likes, comments, last_updated, video_is_studio) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
    const values = [
        videoId,
        channelId,
        videoUploaded,
        views,
        likes,
        comments,
        lastUpdated,
        videoIsStudio,
    ];

    try {
        await pool.query(query, values);
        console.log("Video inserted successfully");
    } catch (err) {
        console.error("Error inserting video", err);
    }
}
//#endregion
