/**
 * Note if you're using this code:
 * The messageHandler.ts file is not included in this repo as it contains messages that are not meant to be public.
 * Please remove the import statement below and all its calls if you're using this code.
 *
 * This repo is open-source so you can look at the code, however this file is not meant to be public
 * as it's also shared with the studio project, which contains private information from Jack's Studio
 */
import cron from "cron";

import {
    getAllChannelIds,
    insertStudioChannel,
    getAllVideoIds,
    insertVideoData,
    updateVideoData,
    insertChannel,
} from "./db";
// serverOnline();

const CronJob = cron.CronJob;
const jobChannels = new CronJob("*/5 * * * * *", updateChannels);
const jobChannelsStudio = new CronJob("0 * * * *", updateChannelsStudio);
const jobVideos = new CronJob("0 * * * *", updateAllVideos);

jobChannels.start();
jobChannelsStudio.start();
jobVideos.start();

// updateChannels();
// updateChannelsStudio();
// updateAllVideos();

async function updateChannels() {
    console.log("Updating channels");
    const channels = await getAllChannelIds();
    const channelIds = channels.map((channel) => channel.channel_id).join(",");
    const data = await fetch(
        `https://youtube.googleapis.com/youtube/v3/channels?part=statistics&id=${channelIds}&key=${process.env.YOUTUBE_API_KEY}`,
    ).then((res) => res.json());

    for (const channel of channels) {
        const channelData = data.items.find(
            (item: any) => item.id === channel.channel_id,
        );
        const currentSubs = channelData?.statistics?.subscriberCount;

        console.log(
            `Channel ID: ${channel.channel_id}, Old Subs: ${channel.subs_api}, New Subs: ${currentSubs}`,
        );

        if (currentSubs && currentSubs != channel.subs_api) {
            insertChannel(channel.channel_id, currentSubs, Date.now());
        }
    }
}

async function updateChannelsStudio() {
    const date = new Date();
    const channelIds = [
        "UCrZKnWgOaYTTc7sc1KsVXZw",
        "UCUXNOmIdsoyd5fh5TZHHO5Q",
        "UCxLIJccyaRQDeyu6RzUsPuw",
        "UCd15dSPPT-EhTXekA7_UNAQ",
        "UCewMTclBJZPaNEfbf-qYMGA",
    ];

    const data = await fetch("https://studio.jsalstats.xyz/subcount").then(
        (res) => {
            return res.json();
        },
    );

    for (const channelId of channelIds) {
        insertStudioChannel(channelId, data[channelId], date);
    }
}

async function updateAllVideos() {
    const videos = await getAllVideoIds();
    const chunks: any = [];

    videos?.forEach((_video, index) => {
        if (index % 50 === 0) {
            chunks.push(videos.slice(index, index + 50));
        }
    });

    chunks.forEach(async (chunk: any) => {
        const videoIds = chunk.join(",");

        await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${process.env.YOUTUBE_API_KEY}`,
        )
            .then((res) => res.json())
            .then((data) => {
                data.items.forEach((item: any) => {
                    const videoId = item.id;
                    const views = item.statistics.viewCount || 0;
                    const likes = item.statistics.likeCount || 0;
                    const comments = item.statistics.commentCount || 0;

                    console.log(videoId, views, likes, comments);

                    insertVideoData(
                        videoId,
                        views,
                        likes,
                        comments,
                        new Date(),
                        false,
                    );
                    updateVideoData(
                        videoId,
                        views,
                        likes,
                        comments,
                        new Date().getTime(),
                    );
                });
            });
    });
}
