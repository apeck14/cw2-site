import Head from "next/head"
import Image from "next/image"
import { useMemo } from "react"
import { Breakpoint } from "react-socks"
import { formatRole, getClanBadge, getLastSeenStr } from "../data/functions"
import Table from "./Table"

export default function ClanHome({ data, router }) {
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
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-100 my-auto ms-2'>
                #{data.globalRank}
            </span>

        return <></>
    }

    const tableData = useMemo(() => {

    }, []);

    const columns = [];

    const mobileColumns = [];

    return (
        <>
            <Head>
                <title>{data.name} ({data.tag})</title>
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
                <Breakpoint medium down>
                    <Table data={tableData} columns={mobileColumns} />
                </Breakpoint>

                <Breakpoint large up>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Trophies</th>
                                <th>Player</th>
                                <th>Tag</th>
                                <th>Level</th>
                                <th>Role</th>
                                <th>Last Seen</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                data?.memberList.map((p, i) => {
                                    return (<tr>
                                        <td>{i + 1}</td>
                                        <td>{p.trophies}</td>
                                        <td>{p.name}</td>
                                        <td>{p.tag}</td>
                                        <td>{p.expLevel}</td>
                                        <td>{formatRole(p.role)}</td>
                                        <td>{getLastSeenStr(p.lastSeen)}</td>
                                    </tr>)
                                })
                            }
                        </tbody>
                    </table>
                </Breakpoint>
            </div>
        </>
    )
}