import type { NextApiRequest, NextApiResponse } from "next";

export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const reqVideoId = req.query.videoId as string;

    const fetchRes = await fetch(
        `http://localhost:5816/analytics/video/${reqVideoId}`,
    );
    const data = await fetchRes.json();

    return res.status(fetchRes.status).json(data);
}
