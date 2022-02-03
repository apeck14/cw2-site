import Head from "next/head"
import Image from "next/image"
import { useMemo } from "react"
import { Breakpoint } from "react-socks"
import { formatRole, getClanBadge, getLastSeenStr, parseDate } from "../data/functions"
import PlayerCellMobile from "./PlayerCellMobile"
import Table from "./Table"
const arenas = require('../data/arenas.json');

export default function ClanHome({ data, router }) {
    console.log(data)
    const getBadge = () => {
        if (!data.globalRank) return <></>

        if (data.globalRank === 1)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-1 my-auto ms-2'>#1</span>
        if (data.globalRank === 2)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-2 my-auto ms-2'>#2</span>
        if (data.globalRank === 3)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-3 my-auto ms-2'>#3</span>
        if (data.globalRank <= 10)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-10 my-auto ms-2'>#{data.globalRank}</span>
        if (data.globalRank <= 25)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-25 my-auto ms-2'>#{data.globalRank}</span>
        if (data.globalRank <= 100)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-100 my-auto ms-2'>#{data.globalRank}</span>

        return <></>
    }

    const tableData = useMemo(() => data.memberList.map(p => ({
        ...p,
        role: formatRole(p.role)
    })), []);

    const columns = useMemo(() => [
        {
            Header: '#',
            accessor: 'clanRank',
            title: 'Rank',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: <i class="bi bi-trophy-fill"></i>,
            accessor: 'trophies',
            title: 'Trophies',
            Cell: ({ row, value }) => <div className="d-flex justify-content-center">
                <Image src={`/images/arenas/${arenas.find(a => a.id === row.original.arena.id).key}.png`} height="25" width="25" />
                {value}
            </div>
        },
        {
            Header: 'Player',
            accessor: 'name',
            title: 'Player',
            Cell: ({ row }) => <div>
                {row.original.name}
                <small className="text-secondary"> {row.original.tag}</small>
            </div>
        },
        {
            Header: 'Level',
            accessor: 'expLevel',
            title: 'Rank',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: 'Role',
            accessor: 'role',
            title: 'Role',
            sortType: useMemo(() => (rowA, rowB, colId) => {
                const roles = ["Leader", "Co-Leader", "Elder", "Member"];
                const a = roles.indexOf(rowA.values[colId]);
                const b = roles.indexOf(rowB.values[colId]);
                return a > b ? -1 : 1;
            }, [])
        },
        {
            Header: 'Last Seen',
            accessor: 'lastSeen',
            title: 'Last Seen',
            sortType: useMemo(() => (rowA, rowB, colId) => {
                const dateA = parseDate(rowA.values[colId]);
                const dateB = parseDate(rowB.values[colId]);

                return dateA > dateB ? 1 : -1;
            }, []),
            Cell: ({ value }) => getLastSeenStr(value)
        },
    ], []);

    const mobileColumns = useMemo(() => [
        {
            Header: '#',
            accessor: 'clanRank',
            title: 'Rank',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        },
        {
            Header: <i class="bi bi-trophy-fill"></i>,
            accessor: 'trophies',
            title: 'Trophies',
            Cell: ({ row, value }) => <div className="d-flex justify-content-center align-items-center">
                <Image src={`/images/arenas/${arenas.find(a => a.id === row.original.arena.id).key}.png`} height="25" width="25" />
                {value}
            </div>
        },
        {
            Header: 'Player',
            accessor: 'name',
            title: 'Player',
            Cell: ({ row }) => <PlayerCellMobile name={row.original.name} role={row.original.role} lastSeen={row.original.lastSeen} />
        },
        {
            Header: 'Level',
            accessor: 'expLevel',
            title: 'Level',
            Cell: ({ value }) => <div className="text-center">{value}</div>
        }
    ], []);

    return (
        <>
            <Head>
                <title>{data.name} ({data.tag})</title>
                <meta content="website" property="og:type" />
                <meta content="CW Stats" property="og:site_name" />
                <meta content={`${data.name} (${data.tag})`} property="og:title" />
                <meta content={`${data.description}`} property="og:description" />
                <meta content={`https://www.cwstats.com${router.asPath}`} property="og:url" />
                <meta content={`${getClanBadge(data.badgeId, data.clanScore)}`} property="og:image" />
                <meta content="#ff237a" data-react-helmet="true" name="theme-color" />
            </Head>

            <div className="container bg-white mt-3 rounded pt-3 pb-2">

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <a className="nav-link active" href={`/clans/${router.query.tag[0]}`}>
                            <i className="bi bi-house-door-fill"></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href={`${router.asPath}/riverrace`}>River Race</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href={`${router.asPath}/riverrace`}>Log</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled">Analytics</a>
                    </li>
                </ul>

                <div className="row">
                    <div className="col d-flex align-items-center justify-content-start">
                        <Image src={getClanBadge(data.badgeId, data.clanWarTrophies)} height="50" width="50" />
                        <h3 className="my-auto">{data.name}</h3>
                        <small className="ms-1 my-auto">{data.tag}</small>
                        {getBadge()}
                    </div>
                </div>

                <div className="row mt-1">
                    <div className="col">
                        <p>{data.description}</p>
                    </div>
                </div>

                <div className='row'>
                    <div className='col d-flex align-items-center justify-content-start'>
                        <Image src="/images/icons/cw-trophy.png" height={20} width={20} />
                        <p className='my-auto me-4 ms-1'>{data.clanWarTrophies}</p>
                        <Image src="/images/icons/trophy.png" height={20} width={20} />
                        <p className='my-auto me-4 ms-1'>{data.clanScore}</p>
                        <i className="bi bi-people-fill"></i>
                        <p className='my-auto ms-1'>{data.members}/50</p>
                    </div>
                </div>

                <hr />

                {/*roster*/}
                <Breakpoint medium up>
                    <Table data={tableData} columns={columns} />
                </Breakpoint>

                <Breakpoint small down>
                    <Table data={tableData} columns={mobileColumns} />
                </Breakpoint>

            </div>
        </>
    )
}