import pg from "pg";

const pool = new pg.Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT as unknown as number,
});

export async function createChannelTable() {
    const query = `
    CREATE TABLE IF NOT EXISTS anal_channels (
        channel_id TEXT NOT NULL,
        subs_api INTEGER NOT NULL,
        subs_api_hit BIGINT NOT NULL
    );
    `;

    try {
        await pool.query(query);
        console.log("Table created successfully");
    } catch (err) {
        console.error("Error creating table", err);
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
