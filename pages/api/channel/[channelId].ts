import type { NextApiRequest, NextApiResponse } from "next";

export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const reqChannelId = req.query.channelId as string;

    const fetchRes = await fetch(
        `http://localhost:5816/analytics/${reqChannelId}`,
    );
    const data = await fetchRes.json();

    return res.status(fetchRes.status).json(data);
}
