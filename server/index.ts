import fs from "fs/promises";

import express from "express";
import cors from "cors";

import {
    createChannelTable,
    createStudioChannelTable,
    createVideoHistoryTable,
    createVideoTable,
    getChannelData,
} from "./db";
const channelsData = JSON.parse(
    await fs.readFile("public/channels.json", "utf-8"),
);

const app = express();

app.use(cors());

const port = process.env.PORT || 5816;

await createChannelTable();
await createStudioChannelTable();
await createVideoTable();
await createVideoHistoryTable();

import "./cron";

app.get("/channels", (req, res) => {
    res.status(200).json(channelsData);
});

app.get("/analytics/:channelId", async (req, res) => {
    const channelId = req.params.channelId;

    if (
        !channelsData.studio.includes(channelId) &&
        !channelsData.nonstudio.includes(channelId)
    ) {
        res.status(404).json({ error: "Channel not found" });

        return;
    }

    const data = await getChannelData(channelId);

    res.status(200).json(data);

    return;
});
app.get("*", (req, res) => {
    res.status(404).send();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
