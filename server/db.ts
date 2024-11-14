import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT as unknown as number,
});

// TODO: Return type
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

// TODO: Return type
export async function createStudioChannelTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS anal_studio_channels (
        channel_id TEXT NOT NULL,
        subs INTEGER NOT NULL,
        time TIMESTAMP NOT NULL
        );
    `;
    const indexQuery = `CREATE INDEX IF NOT EXISTS idx_channel_id ON anal_studio_channels(channel_id);`;

    try {
        await pool.query(query);
        await pool.query(indexQuery);
        console.log("Table and index created successfully");
    } catch (err) {
        console.error("Error creating table or index", err);
    }
}

// TODO: Return type
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

// TODO: Return type
export async function insertStudioChannel(
    channelId: string,
    subs: number,
    time: Date,
) {
    const query = `INSERT INTO anal_studio_channels (channel_id, subs, time) VALUES ($1, $2, $3)`;
    const values = [channelId, subs, time];

    try {
        await pool.query(query, values);
        console.log("Studio channel inserted successfully");
    } catch (err) {
        console.error("Error inserting studio channel", err);
    }
}

// TODO: Return type
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

export async function getAllChannelIds(): Promise<
    { channel_id: string; subs_api: number }[]
> {
    const query = `
        SELECT channel_id, subs_api
        FROM anal_channels
        WHERE (channel_id, subs_api_hit) IN (
            SELECT channel_id, MAX(subs_api_hit)
            FROM anal_channels
            GROUP BY channel_id
        )
    `;

    try {
        const res = await pool.query(query);

        return res.rows;
    } catch (err) {
        console.error("Error getting unique channel ids", err);

        return [];
    }
}

// TODO: Return type
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

// TODO: Return type
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

// TODO: Return type
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

// TODO: Return type
export async function insertVideoData(
    videoId: string,
    views: number,
    likes: number,
    comments: number,
    entryAdded: Date,
    is24hr: boolean,
) {
    const query = `INSERT INTO anal_video_history (video_id, views, likes, comments, entry_added, is_24hr) VALUES ($1, $2, $3, $4, $5, $6)`;
    const values = [videoId, views, likes, comments, entryAdded, is24hr];

    try {
        await pool.query(query, values);
        // console.log("Video history inserted successfully");
    } catch (err) {
        console.error("Error inserting video history", err);
    }
}

// TODO: Return type
export async function getAllStudioVideos() {
    const query = `SELECT * FROM anal_videos WHERE video_is_studio = TRUE`;

    try {
        const res = await pool.query(query);

        return res.rows;
    } catch (err) {
        console.error("Error getting studio videos", err);
    }
}

// TODO: Return type
export async function getAllVideoIds() {
    const query = `SELECT video_id FROM anal_videos`;

    try {
        const res = await pool.query(query);

        return res.rows.map((row) => row.video_id);
    } catch (err) {
        console.error("Error getting video ids", err);
    }
}

// TODO: Return type
export async function updateVideoData(
    videoId: string,
    views: number,
    likes: number,
    comments: number,
    lastUpdated: number,
) {
    const query = `UPDATE anal_videos SET views = $1, likes = $2, comments = $3, last_updated = $4 WHERE video_id = $5`;
    const values = [views, likes, comments, lastUpdated, videoId];

    try {
        await pool.query(query, values);
        console.log("Video updated successfully");
    } catch (err) {
        console.error("Error updating video", err);
    }
}
