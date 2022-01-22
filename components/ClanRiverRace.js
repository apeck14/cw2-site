import Head from "next/head"
import Image from "next/image"
import { useMemo } from "react";
import { getClanBadge } from "../data/functions"
import { getAvgFame, getBestFinish, getCurrentPlacements, getMaxFame, getMinFame, getProjFame, getProjFinish, getWorstFinish, placementStr } from "../data/raceFunctions";
import Table from "./Table";

export default function ClanRiverRace(props) {
    const { data, router } = props;
    const { clan, clans } = data;

    const isColosseum = data.periodType === 'colosseum';

    const columns = useMemo(() => [
        {
            Header: 'Player',
            accessor: 'name'
        },
        {
            Header: 'Today',
            accessor: 'decksUsedToday'
        },
        {
            Header: 'Total',
            accessor: 'decksUsed'
        },
        {
            Header: <Image src='/images/icons/boat-attack-points.png' height={20} width={20} className="h-100 d-inline-block" />,
            accessor: 'boatAttacks'
        },
        {
            Header: <Image src='/images/icons/fame.png' height={20} width={15} />,
            accessor: 'fame'
        },
    ], []);

    const tableData = useMemo(() => clan.participants.filter(p => clan.memberList.find(m => m.tag === p.tag) || p.fame > 0).sort((a, b) => b.fame - a.fame), [clan.participants]);

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
            value: getProjFame(clan, isColosseum)
        },
        {
            title: "Maximum Possible Medals",
            value: getMaxFame(clan, isColosseum)
        },
        {
            title: "Minimum Possible Medals",
            value: getMinFame(clan, isColosseum)
        },
        {
            title: "Projected Place",
            value: getProjFinish(data)
        },
        {
            title: "Best Possible Place",
            value: getBestFinish(data)
        },
        {
            title: "Worst Possible Place",
            value: getWorstFinish(data)
        }
    ];

    const currentPlacements = getCurrentPlacements(clans.map(c => ({ tag: c.tag, fame: c.periodPoints })));

    clans.forEach(c => {
        const placement = currentPlacements.find(cl => c.tag === cl.tag).placement;
        c.placementImgPath = (placement < 0) ? null : `/images/icons/${placementStr(placement)}.png`
    });

    clans.sort((a, b) => { //sort by placement
        const placementA = currentPlacements.find(cl => a.tag === cl.tag).placement;
        const placementB = currentPlacements.find(cl => b.tag === cl.tag).placement;

        return placementA - placementB;
    })

    return (
        <>
            <Head>
                <title>{clan.name} - River Race</title>
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
                            const placementImage = (c.placementImgPath) ? <Image src={c.placementImgPath} height={30} width={30} /> : null;
                            return (
                                <div className={`row cr-row mb-2 py-2 mw-100 mx-auto rounded ${(c.tag === clan.tag) ? `active` : ``}`} onClick={() => router.push(`/clans/${c.tag.substr(1)}/riverrace`)}>
                                    <div className="col-sm d-flex align-items-center">
                                        {placementImage}
                                        <Image className="ms-1" src={getClanBadge(c.badgeId, c.clanScore)} height="30" width="30" />
                                        <strong className="ms-1">{c.name}</strong>
                                    </div>
                                    <div className="col-2 d-flex align-items-center rr-col">
                                        <Image src="/images/icons/boat-movement.png" height="20" width="24" />
                                        <strong className="riverRaceText ms-1 px-2 rounded">{c.fame}</strong>
                                    </div>
                                    <div className="col-2 d-flex align-items-center rr-col">
                                        <Image src="/images/icons/battle.png" height="22" width="22" />
                                        <strong className="riverRaceText ms-1 px-2 rounded">{getAvgFame(c).toFixed(1)}</strong>
                                    </div>
                                    <div className="col-2 d-flex align-items-center rr-col">
                                        <Image src="/images/icons/fame.png" height="20" width="16" />
                                        <strong className="riverRaceText ms-1 px-2 rounded">{c.periodPoints}</strong>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>

                <hr />

                <div className="row gx-3">
                    <div className="col-auto d-flex align-items-center">
                        <Image src={getClanBadge(clan.badgeId, clan.clanScore)} height="40" width="40" />
                        <h4 className="my-auto">{clan.name}</h4>
                    </div>
                    <div className="col-auto d-flex align-items-center">
                        <Image src="/images/icons/boat-movement.png" height="20" width="24" />
                        <strong className="ms-1 rounded">{clan.fame}</strong>
                    </div>
                    <div className="col-auto d-flex align-items-center">
                        <Image src="/images/icons/battle.png" height="22" width="22" />
                        <strong className="ms-1 rounded">{getAvgFame(clan).toFixed(1)}</strong>
                    </div>
                    <div className="col-auto d-flex align-items-center">
                        <Image src="/images/icons/fame.png" height="20" width="16" />
                        <strong className="ms-1 rounded">{clan.periodPoints}</strong>
                    </div>
                </div>

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

                <Table data={tableData} columns={columns} />

            </div>
        </>
    )
}