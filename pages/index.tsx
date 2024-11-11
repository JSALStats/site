import { Link } from "@nextui-org/link";
import { button as buttonStyles } from "@nextui-org/theme";
import { SiYoutube, SiYoutubestudio } from "react-icons/si";
import Image from "next/image";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon, TwitterIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { ChannelData } from "@/types/data";
import { abbreviateNum } from "@/utils/abbreviateNum";

const fetchChannelData = async (id: string) => {
    const response = await fetch(`https://api.jsalstats.xyz/channel/${id}`);

    let data = (await response.json()) as ChannelData;

    data.info.channelId = id;

    return data;
};

export async function getStaticProps() {
    const fs = require("fs").promises;
    const path = require("path");
    const filePath = path.join(process.cwd(), "public", "channels.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const channels = JSON.parse(fileContents);

    const studioChannelsData = await Promise.all(
        channels.studio.map((id: string) => fetchChannelData(id)),
    );

    const nonStudioChannelsData = await Promise.all(
        channels.nonstudio.map((id: string) => fetchChannelData(id)),
    );

    return {
        props: {
            channels: {
                studio: studioChannelsData,
                nonstudio: nonStudioChannelsData,
            },
        },
    };
}

export default function IndexPage({
    channels,
}: {
    channels: { studio: ChannelData[]; nonstudio: ChannelData[] };
}) {
    return (
        <DefaultLayout>
            <section className="flex flex-col items-center justify-center gap-4 mt-4">
                <div className="inline-block max-w-xl text-center justify-center">
                    <span className={title({ color: "cyan" })}>JSALStats </span>
                    <span className={title()}>Site</span>
                    <div className={subtitle({ class: "mt-4" })}>
                        YouTube Analytics for one YouTuber
                    </div>
                </div>

                <div className="flex gap-3">
                    <Link
                        isExternal
                        className={buttonStyles({
                            color: "primary",
                            radius: "full",
                            variant: "shadow",
                        })}
                        href={siteConfig.links.twitter}
                    >
                        <TwitterIcon size={20} />
                        Follow Me!
                    </Link>
                    <Link
                        isExternal
                        className={buttonStyles({
                            variant: "bordered",
                            radius: "full",
                        })}
                        href={siteConfig.links.github}
                    >
                        <GithubIcon size={20} />
                        GitHub
                    </Link>
                </div>

                <div className="mt-8">
                    <h2
                        className={title()}
                        style={{ display: "flex", alignItems: "center" }}
                    >
                        <SiYoutubestudio
                            color="#ff0000"
                            style={{ marginRight: "12px" }}
                        />
                        Studio Channels
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {channels.studio
                            .sort((a, b) => b.data.subsApi - a.data.subsApi)
                            .map((channel) => (
                                <Link
                                    key={channel.info.name}
                                    isExternal
                                    className={buttonStyles({
                                        color: "danger",
                                        radius: "full",
                                        variant: "shadow",
                                        class: "flex items-center",
                                    })}
                                    href={`/channel/${channel.info.channelId}`}
                                >
                                    <Image
                                        alt={channel.info.name}
                                        className="w-10 h-10 rounded-full mr-2"
                                        height={256}
                                        src={channel.info.channelIcon}
                                        width={256}
                                    />
                                    {channel.info.name.length > 30
                                        ? `${channel.info.name.substring(0, 30)}...`
                                        : channel.info.name}{" "}
                                    &bull; {abbreviateNum(channel.data.subsApi)}
                                </Link>
                            ))}
                    </div>
                    <h2
                        className={title()}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: "2rem",
                        }}
                    >
                        <SiYoutube
                            color="#ff0000"
                            style={{ marginRight: "12px" }}
                        />
                        Non-Studio Channels
                    </h2>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                        {channels.nonstudio
                            .sort((a, b) => b.data.subsApi - a.data.subsApi)
                            .map((channel) => (
                                <Link
                                    key={channel.info.name}
                                    isExternal
                                    className={buttonStyles({
                                        color: "primary",
                                        radius: "full",
                                        variant: "shadow",
                                        class: "flex items-center",
                                    })}
                                    href={`/channel/${channel.info.channelId}`}
                                >
                                    <Image
                                        alt={channel.info.name}
                                        className="w-10 h-10 rounded-full mr-2"
                                        height={256}
                                        src={channel.info.channelIcon}
                                        width={256}
                                    />
                                    {channel.info.name.length > 30
                                        ? `${channel.info.name.substring(0, 30)}...`
                                        : channel.info.name}{" "}
                                    &bull; {abbreviateNum(channel.data.subsApi)}
                                </Link>
                            ))}
                    </div>
                </div>
            </section>
        </DefaultLayout>
    );
}
