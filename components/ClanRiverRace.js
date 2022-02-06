import Head from "next/head"
import Image from "next/image"
import { useMemo } from "react";
import { getClanBadge, hexToRgbA } from "../data/functions"
import { getAvgFame, getBestFinish, getCurrentPlacements, getMaxFame, getMinFame, getProjFame, getProjFinish, getWorstFinish, placementStr } from "../data/raceFunctions";
import Table from "./Table";
import { Breakpoint } from 'react-socks';
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    LineElement,
    Filler
);

export default function ClanRiverRace({ data, router }) {
    const { clan, clans } = data;

    const isColosseum = data.periodType === 'colosseum';
    const dayOfWeek = data.periodIndex % 7; // 0-6 (0,1,2 TRAINING, 3,4,5,6 BATTLE)
    const movementPtsAccessor = (isColosseum) ? 'periodPoints' : 'fame';
    const fameAccessor = (isColosseum) ? 'fame' : 'periodPoints';

    const columnsLarge = useMemo(() => [
        {
            Header: 'Player',
            accessor: 'name',
            title: 'Player'
        },
        {
            Header: 'Decks Today',
            accessor: 'decksUsedToday',
            title: 'Decks Used Today',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: 'Total Decks',
            accessor: 'decksUsed',
            title: 'Total Decks Used (includes Training days)',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: 'Boats',
            accessor: 'boatAttacks',
            title: 'Total Boat Attacks',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: 'Medals',
            accessor: 'fame',
            title: 'Medals',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
    ], []);

    const columnsSmall = useMemo(() => [
        {
            Header: 'Player',
            accessor: 'name',
            title: 'Player'
        },
        {
            Header: <Image src="/images/icons/decksRemaining.png" height={20} width={20} className="img" />,
            accessor: 'decksUsedToday',
            title: 'Decks Used Today',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: <Image src="/images/icons/decks.png" height={20} width={20} className="img" />,
            accessor: 'decksUsed',
            title: 'Total Decks Used (includes Training days)',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: <Image src="/images/icons/boat-attack-points.png" height={20} width={20} className="img" />,
            accessor: 'boatAttacks',
            title: 'Total Boat Attacks',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: <Image src="/images/icons/fame.png" height={20} width={15} className="img" />,
            accessor: 'fame',
            title: 'Medals',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
    ], []);

    const hexColors = ["#8250C4", "#438FFF", "#D82C20", "#478F48", "#FFA500"];

    const chartData = {
        data: {
            labels: data?.periodLogs.map(() => ''),
            datasets: clans.map((c, i) => ({
                label: c.name,
                data: data.periodLogs.map(p => p.items.find(cl => cl.clan.tag === c.tag).pointsEarned),
                fill: c.tag === clan.tag,
                borderColor: hexColors[i],
                backgroundColor: (c.tag === clan.tag) ? hexToRgbA(hexColors[i]) : 'transparent',
                tension: 0.08
            }))
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: "War Cycle Daily Scores"
                },
                legend: {
                    display: true,
                    position: "top"
                }
            },
            scales: {
                y: {
                    suggestedMin: 35000,
                    max: 45000
                }
            }
        }
    }

    const tableData = useMemo(() => clan.participants.filter(p => clan.memberList.find(m => m.tag === p.tag) || p.fame > 0).sort((a, b) => b.fame - a.fame).map(p => ({
        ...p,
        rowClass: (clan.memberList.find(m => m.tag === p.tag)) ? '' : 'not-in-clan'
    })), [clan.participants]);

    const clanStats = [
        {
            title: 'Total Battles Remaining',
            value: 200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0)
        },
        {
            title: 'Duels Remaining',
            value: 50 - clan.participants.filter(p => p.decksUsedToday >= 2).length
        },
        {
            title: "Projected Medals",
            value: (data.periodType === 'training') ? 0 : getProjFame(clan, isColosseum, dayOfWeek)
        },
        {
            title: "Maximum Possible Medals",
            value: (data.periodType === 'training') ? 0 : getMaxFame(clan, isColosseum, dayOfWeek)
        },
        {
            title: "Minimum Possible Medals",
            value: (data.periodType === 'training') ? 0 : getMinFame(clan, isColosseum, dayOfWeek)
        },
        {
            title: "Projected Place",
            value: (data.periodType === 'training') ? "N/A" : getProjFinish(data, isColosseum, dayOfWeek)
        },
        {
            title: "Best Possible Place",
            value: (data.periodType === 'training') ? "N/A" : getBestFinish(data, isColosseum, dayOfWeek)
        },
        {
            title: "Worst Possible Place",
            value: (data.periodType === 'training') ? "N/A" : getWorstFinish(data, isColosseum, dayOfWeek)
        }
    ];

    const currentPlacements = getCurrentPlacements(clans.map(c => ({ tag: c.tag, fame: c[fameAccessor] })), isColosseum);

    clans.forEach(c => { //add placement image paths
        const placement = currentPlacements.find(cl => c.tag === cl.tag).placement;
        c.placementImgPath = (placement === Infinity) ? null : `/images/icons/${placementStr(placement)}.png`
    });

    clans.sort((a, b) => { //sort by placement
        const placementA = currentPlacements.find(cl => a.tag === cl.tag).placement;
        const placementB = currentPlacements.find(cl => b.tag === cl.tag).placement;

        if (placementB === -1) return -1;

        return placementA - placementB;
    });

    return (
        <>
            <Head>
                <title>{clan.name} - River Race</title>
                <meta content="website" property="og:type" />
                <meta content="CW Stats" property="og:site_name" />
                <meta content={`${clan.name} - River Race`} property="og:title" />
                <meta content={`View river race details & projections.`} property="og:description" />
                <meta content={`https://www.cwstats.com${router.asPath}`} property="og:url" />
                <meta content={`${getClanBadge(clan.badgeId, clan.clanScore)}`} property="og:image" />
                <meta content="#ff237a" data-react-helmet="true" name="theme-color" />
            </Head>

            <div className="container bg-white mt-3 rounded pt-3 pb-2">

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <a className="nav-link" href={`/clans/${router.query.tag[0]}`}>
                            <i className="bi bi-house-door-fill"></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link active" href={`${router.asPath}/riverrace`}>River Race</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href={`${router.asPath}/riverrace`}>Log</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled">Analytics</a>
                    </li>
                </ul>

                <div>
                    {
                        clans.map(c => {
                            const placementImage = (c.placementImgPath) ? <Image src={c.placementImgPath} layout="fixed" width={30} height={30} /> : null;
                            return (
                                <div className={`row py-2 ps-0 cr-row rounded mb-1 mx-1 ${(c.tag === clan.tag) ? `active` : ``}`} onClick={() => router.push(`/clans/${c.tag.substr(1)}/riverrace`)}>
                                    <Breakpoint medium down>
                                        <div className="row">
                                            {(placementImage) ?
                                                <span className="col-auto d-flex align-items-center mx-1">{placementImage}</span> :
                                                null
                                            }
                                            <div className="col">
                                                <div className="d-flex align-items-center">
                                                    <Image src={getClanBadge(c.badgeId, c.clanScore)} layout="fixed" height="30" width="30" />
                                                    <strong>{c.name}</strong>
                                                </div>
                                                <div className="col d-flex align-items-center">
                                                    <Image src="/images/icons/fame.png" height="20" width="16" />
                                                    <small className="riverRaceText mx-1 px-2 rounded">{c[fameAccessor]}</small>
                                                    <Image src="/images/icons/battle.png" height="20" width="20" />
                                                    <small className="riverRaceText mx-1 px-2 rounded">{getAvgFame(c, isColosseum, dayOfWeek).toFixed(1)}</small>
                                                    <Image src="/images/icons/boat-movement.png" height="18" width="22" />
                                                    <small className="riverRaceText ms-1 px-2 rounded">{c[movementPtsAccessor]}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </Breakpoint>

                                    <Breakpoint large up>
                                        <div className="d-flex align-items-center">
                                            {(placementImage) ?
                                                <span className="col-auto d-flex align-items-center me-1">{placementImage}</span> :
                                                null
                                            }
                                            <Image src={getClanBadge(c.badgeId, c.clanScore)} layout="fixed" height="30" width="30" />
                                            <strong>{c.name}</strong>
                                            <div className="d-flex align-items-center ms-auto me-0">
                                                <Image src="/images/icons/boat-movement.png" height="20" width="24" />
                                                <strong className="riverRaceText mx-1 px-2 rounded">{c[movementPtsAccessor]}</strong>
                                                <Image src="/images/icons/battle.png" height="22" width="22" />
                                                <strong className="riverRaceText mx-1 px-2 rounded">{getAvgFame(c, isColosseum, dayOfWeek).toFixed(1)}</strong>
                                                <Image src="/images/icons/fame.png" height="20" width="16" />
                                                <strong className="riverRaceText ms-1 px-2 rounded">{c[fameAccessor]}</strong>
                                            </div>
                                        </div>
                                    </Breakpoint>
                                </ div>
                            )
                        })
                    }
                </div>

                <hr />


                <Breakpoint medium up>
                    <div className="row gx-3">
                        <div className="col-auto d-flex align-items-center">
                            <Image src={getClanBadge(clan.badgeId, clan.clanScore)} height="40" width="40" />
                            <h4 className="my-auto">{clan.name}</h4>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <Image src="/images/icons/boat-movement.png" height="20" width="24" />
                            <strong className="ms-1 rounded">{clan[movementPtsAccessor]}</strong>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <Image src="/images/icons/battle.png" height="22" width="22" />
                            <strong className="ms-1 rounded">{getAvgFame(clan, isColosseum, dayOfWeek).toFixed(1)}</strong>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <Image src="/images/icons/fame.png" height="20" width="16" />
                            <strong className="ms-1 rounded">{clan[fameAccessor]}</strong>
                        </div>
                    </div>
                </Breakpoint>

                <Breakpoint small down>
                    <div className="row">
                        <div className="col d-flex align-items-center">
                            <Image src={getClanBadge(clan.badgeId, clan.clanScore)} height="40" width="40" />
                            <h4 className="my-auto">{clan.name}</h4>
                        </div>
                    </div>

                    <div className="row gx-3">
                        <div className="col-auto d-flex align-items-center">
                            <Image src="/images/icons/fame.png" height="20" width="16" />
                            <strong className="ms-1 rounded">{clan[fameAccessor]}</strong>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <Image src="/images/icons/battle.png" height="22" width="22" />
                            <strong className="ms-1 rounded">{getAvgFame(clan, isColosseum, dayOfWeek).toFixed(1)}</strong>
                        </div>
                        <div className="col-auto d-flex align-items-center">
                            <Image src="/images/icons/boat-movement.png" height="20" width="24" />
                            <strong className="ms-1 rounded">{clan[movementPtsAccessor]}</strong>
                        </div>
                    </div>
                </Breakpoint>



                <div className="my-2">
                    {
                        clanStats.map(s => {
                            return (
                                <div className="row align-items-center justify-content-between border-bottom py-1">
                                    <div className="col">{s.title}</div>
                                    <div className="col text-end">{s.value}</div>
                                </div>
                            )
                        })
                    }
                </div>

                <small><em>All calculations assume 100% participation.</em></small>

                <hr />

                {/* Table */}
                <Breakpoint medium up>
                    <Table data={tableData} columns={columnsLarge} />

                </Breakpoint>

                <Breakpoint small down>
                    <Table data={tableData} columns={columnsSmall} />
                </Breakpoint>

                <div className="graph-container">
                    <Line data={chartData.data} options={chartData.options} />
                </div>

                <p><small className="fst-italic">Click on clan names to toggle view</small></p>

            </div>
        </>
    )
}