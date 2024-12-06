import { promises as fs } from "fs";
import path from "path";

import { insertNewVideo } from "./db";

const filePath = path.join(process.cwd(), "public", "channels.json");

const data = await fs.readFile(filePath, "utf-8");
const channels = JSON.parse(data).all;
let total = 0;

for (const channelId of channels) {
    console.log(`\nGetting all videos for ${channelId}`);

    let pageToken = "";

    while (true) {
        let url = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${channelId.replace("UC", "UU")}&key=${process.env.YOUTUBE_API_KEY}&pageToken=${pageToken}`;

        const res = await fetch(url);
        const json = await res.json();

        console.log(json.items.length, channelId, pageToken, total);
        total += json.items.length;

        pageToken = json.nextPageToken;

        const videoIds = json.items
            .map(
                (item: { contentDetails: { videoId: any } }) =>
                    item.contentDetails.videoId,
            )
            .join(",");

        const statsUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`;
        const statsRes = await fetch(statsUrl);
        const statsJson = await statsRes.json();

        for (const item of json.items) {
            const stats = statsJson.items.find(
                (stat: { id: any }) => stat.id === item.contentDetails.videoId,
            ).statistics;

            await insertNewVideo(
                item.contentDetails.videoId,
                channelId,
                item.snippet.publishedAt,
                stats.viewCount || 0,
                stats.likeCount || 0,
                stats.commentCount || 0,
                Date.now(),
                [
                    "UCrZKnWgOaYTTc7sc1KsVXZw",
                    "UCUXNOmIdsoyd5fh5TZHHO5Q",
                    "UCewMTclBJZPaNEfbf-qYMGA",
                    "UCxLIJccyaRQDeyu6RzUsPuw",
                    "UCd15dSPPT-EhTXekA7_UNAQ",
                ].includes(channelId),
            );
        }

        if (json.nextPageToken === undefined) {
            break;
        }
    }
}
