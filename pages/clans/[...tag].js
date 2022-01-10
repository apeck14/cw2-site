import Head from 'next/head'
import Image from 'next/image';
import React from 'react';
import { formatRole, getClanBadge, getLastSeenStr } from '../../data/functions'

export default function ClanData({ data, globalRank }) {
    const getBadge = () => {
        if (!globalRank) return <></>

        if (globalRank === 1)
            return <span className='badge rounded-pill bg-primary bg-1 my-auto ms-2'>Top 1</span>
        if (globalRank === 2)
            return <span className='badge rounded-pill bg-primary bg-2 my-auto ms-2'>Top 2</span>
        if (globalRank === 3)
            return <span className='badge rounded-pill bg-primary bg-3 my-auto ms-2'>Top 3</span>
        if (globalRank <= 10)
            return <span className='badge rounded-pill bg-primary bg-10 my-auto ms-2'>Top 10</span>
        if (globalRank <= 25)
            return <span className='badge rounded-pill bg-primary bg-25 my-auto ms-2'>Top 25</span>
        if (globalRank <= 100)
            return <span className='badge rounded-pill bg-primary bg-100 my-auto ms-2'>Top 100</span>

        return <></>
    }
    return (
        <>
            <Head>
                <title>{data.name} ({data.tag})</title>
            </Head>

            <div className="container bg-white mt-3 rounded pt-3 pb-2">

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <a className="nav-link active" href="#">
                            <i className="bi bi-house-door-fill"></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">River Race</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Log</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">Analytics</a>
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
                            data.memberList.map((p, i) => {
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
            </div>
        </>
    )
}

export async function getServerSideProps({ params }) {
    //top 100 (green gradient), top 25 (purple gradient), top 10 (blue gradient), 3 (bronze), 2 (silver), 1 (gold)
    const url = `https://proxy.royaleapi.dev/v1/clans/%23${params.tag[0]}`;
    const lb_url = `https://proxy.royaleapi.dev/v1/locations/global/rankings/clanwars/?limit=100`;

    const options = {
        headers: {
            'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
    }
    const [res, lb_res] = await Promise.all([fetch(url, options), fetch(lb_url, options)]);
    const [data, lb] = await Promise.all([res.json(), lb_res.json()]);

    if (!data.tag) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            },
        }
    }

    let globalRank = lb.items.findIndex(c => c.tag === data.tag) + 1;
    if (globalRank === 0) globalRank = null;

    return {
        props: {
            data,
            globalRank
        }
    }
}
