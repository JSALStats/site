import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import NumberFlow from "@number-flow/react";
import Image from "next/image";

import DefaultLayout from "@/layouts/default";
import { ChannelData } from "@/types/data";
import { subtitle } from "@/components/primitives";

interface PageState {
    hasError: boolean;
    isLoading: boolean;
    odometerSubs: number;
    studioSubsChartOptions: any;
    analChartOptions: any;
    channelId: string;
    data: ChannelData | null;
    channelIsStudio: boolean;
}

class IndexPage extends Component<{}, PageState> {
    interval: NodeJS.Timeout | null = null;

    constructor(props: any | Readonly<{}>) {
        super(props);

        this.state = {
            hasError: false,
            isLoading: true,
            odometerSubs: 0,
            channelId: props.channelId,
            data: props.data,
            channelIsStudio: props.channelIsStudio,
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
                        name: "Subscribers",
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
                        name: "Subscribers",
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

    fetchData = () => {
        if (
            this.state.channelIsStudio == false ||
            this.state.channelId == null ||
            !this.state.channelIsStudio
        ) {
            return;
        } else {
            fetch(`https://studio.jsalstats.xyz/subcount`)
                .then((response) => response.json())
                .then((data) => {
                    const subs = data[this.state.channelId];

                    // Update the chart data
                    this.setState((prevState) => {
                        const newDataPoint = [Date.now(), subs];
                        let updatedData = [
                            ...prevState.studioSubsChartOptions.series[0].data,
                            newDataPoint,
                        ];

                        if (updatedData.length > 1800) {
                            updatedData.shift();
                        }
                        if (updatedData.length == 2) {
                            console.log(updatedData[1]);
                            if (updatedData[1][0] < updatedData[0][0] + 1000) {
                                updatedData.shift();
                            }
                        }

                        return {
                            odometerSubs: subs,
                            studioSubsChartOptions: {
                                ...prevState.studioSubsChartOptions,
                                series: [
                                    {
                                        ...prevState.studioSubsChartOptions
                                            .series[0],
                                        data: updatedData,
                                    },
                                ],
                            },
                            isLoading: false,
                        };
                    });
                })
                .catch((error) => {
                    console.log(error);
                    this.setState({ isLoading: false });
                });
        }
    };

    fetchAnal = async () => {
        if (this.state.channelId == null || this.state.data == null) {
            return;
        } else {
            try {
                const response = await fetch(
                    `/api/channel/${this.state.channelId}`,
                );

                if (response.status === 200) {
                    const data = await response.json();
                    const updatedData = data
                        .filter((entry: any, index: number, array: any[]) => {
                            const entryDate = new Date(entry.subs_api_hit);
                            const nextEntryDate =
                                index < array.length - 1
                                    ? new Date(array[index + 1].subs_api_hit)
                                    : null;

                            return (
                                !nextEntryDate ||
                                entryDate.getHours() !==
                                    nextEntryDate.getHours() ||
                                entryDate.getDate() !== nextEntryDate.getDate()
                            );
                        })
                        .map((entry: any) => [
                            new Date(entry.subs_api_hit).getTime(),
                            entry.subs_api,
                        ])
                        .sort(
                            (a: [number, number], b: [number, number]) =>
                                a[0] - b[0],
                        );

                    // Add the current timestamp to the data
                    updatedData.push([
                        new Date().getTime(),
                        this.state.data?.data.subsApi || 0,
                    ]);

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
                        odometerSubs: this.state.data?.data.subsApi || 0,
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
        this.fetchAnal();
        this.fetchData();
        setInterval(this.fetchData, 5000);
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
    }

    render() {
        if (this.state.channelId == null || this.state.data == null) {
            // Redirect to 404
            if (typeof window != "undefined") {
                window.location.href = "/404";
            }

            return null;
        }

        if (this.state.data) {
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
                                        className="w-20 h-20 rounded-full mr-4 opacity-100 border-red-500 border-4"
                                        height={174}
                                        src={this.state.data?.info.channelIcon}
                                        width={174}
                                    />
                                ) : null}
                                <div>
                                    <h2
                                        className="text-white text-lg font-semibold  opacity-100"
                                        style={{ fontSize: "32px" }}
                                    >
                                        {this.state.data?.info.name.length > 30
                                            ? `${this.state.data?.info.name.slice(0, 30)}...`
                                            : this.state.data?.info.name}
                                    </h2>
                                    <p
                                        className="text-gray-500  opacity-100"
                                        style={{ fontSize: "16px" }}
                                    >
                                        {this.state.channelId}
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
                                    value={this.state.odometerSubs}
                                />
                            </div>
                            <div className="text-gray-400 mt-2 center-text">
                                Subscribers
                            </div>
                        </div>

                        {/* Realtime Studio Subs */}
                        {this.state.channelIsStudio && (
                            <div className="w-full bg-gray-800 p-4 rounded-lg flex flex-col justify-center items-center">
                                <div
                                    className={subtitle({
                                        class: "text-center text-white",
                                    })}
                                >
                                    Studio Count
                                </div>
                                <div className="w-full">
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={
                                            this.state.studioSubsChartOptions
                                        }
                                    />
                                    <p className="text-danger text-small mt-2">
                                        Studio counts update every 5 seconds!
                                    </p>
                                </div>
                            </div>
                        )}

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
        const res = await fetch(`https://api.jsalstats.xyz/channel/${id}`);
        const channelIsStudio = await fetch(`http://localhost:5816/channels`)
            .then((res) => res.json())
            .then((data) => {
                return data.studio.includes(id);
            });

        if (!res.ok) {
            return {
                props: {
                    channelId: id,
                    data: null,
                    channelIsStudio: false,
                },
            };
        }

        const data = await res.json();

        return {
            props: {
                channelId: id,
                data: data,
                channelIsStudio: channelIsStudio,
            },
        };
    } catch (error) {
        console.error("Error fetching server:", error);

        return {
            props: {
                channelId: id,
                data: null,
                channelIsStudio: false,
            },
        };
    }
}

export default IndexPage;
