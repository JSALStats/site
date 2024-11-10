import type { NextApiRequest, NextApiResponse } from "next";

export default async function Handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    // const videoId = req.query.videoId as string;

    return res.status(404).send(null);
}
