import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import NumberFlow from "@number-flow/react";
import Image from "next/image";

import DefaultLayout from "@/layouts/default";
import { subtitle } from "@/components/primitives";

interface PageState {
    hasError: boolean;
    isLoading: boolean;
    odometerViews: number;
    studioSubsChartOptions: any;
    analChartOptions: any;
    videoId: string;
    // TODO: resVideoData, type
    data: any | null;
    videoIsValid: boolean;
}

class IndexPage extends Component<{}, PageState> {
    interval: NodeJS.Timeout | null = null;

    constructor(props: any | Readonly<{}>) {
        super(props);

        this.state = {
            hasError: false,
            isLoading: true,
            odometerViews: 0,
            videoId: props.videoId,
            data: props.videoData,
            videoIsValid: props.videoIsValid,
            studioSubsChartOptions: {
                chart: {
                    backgroundColor: "transparent",
                    type: "line",
                    zoomType: "x",
                },
                title: {
                    text: "Subscribers",
                    style: {
                        color: "gray",
                        font: "Roboto Medium",
                    },
                },
                xAxis: {
                    type: "datetime",
                    tickPixelInterval: 150,
                    labels: {
                        style: {
                            color: "gray",
                            font: "Roboto Medium",
                        },
                    },
                    visible: true,
                },
                yAxis: {
                    gridLineColor: "gray",
                    title: {
                        text: "",
                    },
                    labels: {
                        style: {
                            color: "gray",
                            font: "Roboto Medium",
                        },
                    },
                    visible: true,
                },
                plotOptions: {
                    series: {
                        threshold: null,
                        fillOpacity: 0.25,
                        animation: false,
                        lineWidth: 3,
                    },
                    area: {
                        fillOpacity: 0.25,
                    },
                },
                credits: {
                    enabled: true,
                    text: "",
                    href: "#uwu",
                },
                time: {
                    useUTC: false,
                },
                tooltip: {
                    shared: true,
                    formatter(this: any) {
                        if (!this.points || this.points.length === 0) return "";

                        const point = this.points[0];

                        const index = point.series.xData.indexOf(point.x);
                        const lastY = point.series.yData[index - 1];
                        const dif = point.y - lastY;

                        let r =
                            Highcharts.dateFormat(
                                "%A %b %e, %H:%M:%S",
                                new Date(point.x).getTime(),
                            ) +
                            '<br><span style="color:black">\u25CF </span>' +
                            point.series.name +
                            ": <b>" +
                            Number(point.y).toLocaleString();

                        if (dif < 0) {
                            r +=
                                '<span style="color:#ff0000;font-weight:bold;"> (' +
                                Number(dif).toLocaleString() +
                                ")</span>";
                        }
                        if (dif > 0) {
                            r +=
                                '<span style="color:#00bb00;font-weight:bold;"> (+' +
                                Number(dif).toLocaleString() +
                                ")</span>";
                        }

                        return r;
                    },
                },
                series: [
                    {
                        name: "Views",
                        data: [],
                        showInLegend: false,
                        marker: { enabled: false },
                        color: "#ff0000",
                        lineColor: "#ff0000",
                        lineWidth: 4,
                        type: "areaspline",
                        fillOpacity: 0.1,
                    },
                ],
            },
            analChartOptions: {
                chart: {
                    backgroundColor: "transparent",
                    type: "line",
                    zoomType: "x",
                },
                title: {
                    text: "Views",
                    style: {
                        color: "gray",
                        font: "Roboto Medium",
                    },
                },
                xAxis: {
                    type: "datetime",
                    tickPixelInterval: 150,
                    labels: {
                        style: {
                            color: "gray",
                            font: "Roboto Medium",
                        },
                    },
                    visible: true,
                },
                yAxis: {
                    gridLineColor: "gray",
                    title: {
                        text: "",
                    },
                    labels: {
                        style: {
                            color: "gray",
                            font: "Roboto Medium",
                        },
                    },
                    visible: true,
                },
                plotOptions: {
                    series: {
                        threshold: null,
                        fillOpacity: 0.25,
                        animation: false,
                        lineWidth: 3,
                    },
                    area: {
                        fillOpacity: 0.25,
                    },
                },
                credits: {
                    enabled: true,
                    text: "jsalstats.xyz",
                    href: "",
                },
                time: {
                    useUTC: false,
                },
                tooltip: {
                    shared: true,
                    formatter(this: any) {
                        if (!this.points || this.points.length === 0) return "";

                        const point = this.points[0];

                        const index = point.series.xData.indexOf(point.x);
                        const lastY = point.series.yData[index - 1];
                        const dif = point.y - lastY;

                        let r =
                            Highcharts.dateFormat(
                                "%A %b %e, %H:%M:%S",
                                new Date(point.x).getTime(),
                            ) +
                            '<br><span style="color:black">\u25CF </span>' +
                            point.series.name +
                            ": <b>" +
                            Number(point.y).toLocaleString();

                        if (dif < 0) {
                            r +=
                                '<span style="color:#ff0000;font-weight:bold;"> (' +
                                Number(dif).toLocaleString() +
                                ")</span>";
                        }
                        if (dif > 0) {
                            r +=
                                '<span style="color:#00bb00;font-weight:bold;"> (+' +
                                Number(dif).toLocaleString() +
                                ")</span>";
                        }

                        return r;
                    },
                },
                series: [
                    {
                        name: "Views",
                        data: [],
                        showInLegend: false,
                        marker: { enabled: false },
                        color: "#ff0000",
                        lineColor: "#ff0000",
                        lineWidth: 4,
                        type: "areaspline",
                        fillOpacity: 0.1,
                    },
                ],
            },
        };
    }

    fetchAnal = async () => {
        if (this.state.videoId == null || !this.state.videoIsValid) {
            return;
        } else {
            try {
                const response = await fetch(
                    `/api/video/${this.state.videoId}`,
                );

                if (response.status === 200) {
                    const data = await response.json();
                    const updatedData = data
                        .filter((entry: any, index: number, array: any[]) => {
                            const entryDate = new Date(entry.time);
                            const nextEntryDate =
                                index < array.length - 1
                                    ? new Date(array[index + 1].time)
                                    : null;

                            return (
                                !nextEntryDate ||
                                entryDate.getHours() !==
                                    nextEntryDate.getHours() ||
                                entryDate.getDate() !== nextEntryDate.getDate()
                            );
                        })
                        .map((entry: any) => [
                            new Date(entry.time).getTime(),
                            entry.views,
                        ])
                        .sort(
                            (a: [number, number], b: [number, number]) =>
                                a[0] - b[0],
                        );

                    this.setState((prevState) => ({
                        analChartOptions: {
                            ...prevState.analChartOptions,
                            series: [
                                {
                                    ...prevState.analChartOptions.series[0],
                                    data: updatedData,
                                },
                            ],
                        },
                        odometerViews:
                            this.state.data.data.items[0].statistics.viewCount,
                    }));
                } else {
                    this.setState({
                        analChartOptions: null,
                    });
                }
            } catch (error) {
                console.error(error);
                this.setState({
                    analChartOptions: null,
                });
            }
        }
    };

    componentDidMount() {
        // this.fetchData();
        this.fetchAnal();
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        if (this.state.videoId == null || !this.state.videoIsValid) {
            // Redirect to 404
            if (typeof window != "undefined") {
                window.location.href = "/404";
            }
        }

        if (this.state.videoIsValid) {
            return (
                <DefaultLayout>
                    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 max-w-[100%] ml-auto mr-auto">
                        <div className="relative w-full p-4 rounded-lg flex flex-col justify-center items-center">
                            {/* <Image
                                alt="Banner"
                                className="absolute inset-0 w-full h-full object-cover rounded-lg z-0 blur-sm"
                                height={500}
                                src={""}
                                width={1500}
                            /> */}
                            <div className="relative z-10 flex items-center bg-gray-900 p-6 rounded-full bg-opacity-90">
                                {this.state.data ? (
                                    <Image
                                        alt="User Avatar"
                                        className="mr-4 opacity-100 border-red-500 border-4"
                                        height={174}
                                        src={`https://i.ytimg.com/vi/${this.state.videoId}/maxresdefault.jpg`}
                                        width={174}
                                    />
                                ) : null}
                                <div>
                                    <h2
                                        className="text-white text-lg font-semibold  opacity-100"
                                        style={{ fontSize: "32px" }}
                                    >
                                        {
                                            this.state.data?.data.items[0]
                                                .snippet.title
                                        }
                                    </h2>
                                    <p
                                        className="text-gray-500  opacity-100"
                                        style={{ fontSize: "16px" }}
                                    >
                                        {
                                            this.state.data?.data.items[0]
                                                .snippet.channelTitle
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full bg-gray-800 p-4 rounded-lg flex flex-col justify-center items-center">
                            <div className="text-white text-6xl sm:text-5xl md:text-6xl lg:text-7xl">
                                <NumberFlow
                                    transformTiming={{
                                        duration: 2000,
                                        easing: "ease-out",
                                    }}
                                    value={this.state.odometerViews}
                                />
                            </div>
                            <div className="text-gray-400 mt-2 center-text">
                                Views
                            </div>
                        </div>

                        <div className="w-full bg-gray-800 p-4 rounded-lg flex flex-col justify-center items-center">
                            <div
                                className={subtitle({
                                    class: "text-center text-white",
                                })}
                            >
                                Analytics
                            </div>
                            <div className="w-full">
                                {this.state.analChartOptions && (
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={this.state.analChartOptions}
                                    />
                                )}
                                <p className="text-primary text-large mt-2">
                                    Data is still being added and collected :3
                                </p>
                            </div>
                        </div>
                    </section>
                </DefaultLayout>
            );
        }
    }
}
export async function getServerSideProps(context: { query: { id: string } }) {
    const { id } = context.query;

    try {
        const res = await fetch(`http://localhost:5816/checkvideo/${id}`);
        const videoIsValid = res.ok;

        const resVideoData = await fetch(
            `http://localhost:5817/videos?part=snippet,statistics&id=${id}`,
        ).then((res) => res.json());

        return {
            props: {
                videoId: id,
                videoIsValid,
                videoData: resVideoData,
            },
        };
    } catch (error) {
        console.error("Error fetching server:", error);

        return {
            props: {
                videoId: id,
                videoIsValid: false,
                videoData: null,
            },
        };
    }
}

export default IndexPage;
