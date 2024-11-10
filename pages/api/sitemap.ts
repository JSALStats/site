import { promises as fs } from "fs";
import path from "path";

import { NextApiRequest, NextApiResponse } from "next";

const BASE_URL = "https://alpha.jsalstats.xyz";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const filePath = path.join(process.cwd(), "public", "channels.json");
    const fileContents = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(fileContents);

    const channels = data.all;

    const sitemap = channels
        .map((channelId: string) => {
            return `
                <url>
                    <loc>${BASE_URL}/channel/${channelId}</loc>
                    <lastmod>${new Date().toISOString()}</lastmod>
                </url>
            `;
        })
        .join("");

    const xmlResponse = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemap}
    </urlset>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xmlResponse);
}
