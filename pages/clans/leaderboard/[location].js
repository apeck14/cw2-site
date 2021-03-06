import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { apiRequest, getClanBadge } from '../../../data/functions'
import styled from 'styled-components';
import { useRouter } from 'next/router';

const locations = require('../../../data/locations.json');

const HighlightLink = styled.a`
    text-decoration: none;
    color: black;

    &:hover {
        color: black;
        background-color: gray;
    }
`

const TableRow = styled.tr`
    &:hover {
        background-color: lightgray;
        cursor: pointer;
    }
`

export default function Leaderboard({ data, region }) {
    const router = useRouter();
    const [rows, setRows] = useState(25); //25 50 100 500

    const updateLocation = e => {
        const locationExists = locations.find(l => l.name === e.target.value);

        if (locationExists) {
            router.replace(`/clans/leaderboard/${locationExists.key.toLowerCase()}`)
        }
    }

    return (
        <>
            <Head>
                <title>{region} War Leaderboard</title>
            </Head>

            <div className="container bg-white mt-3 rounded pt-3 pb-2">
                <div className='pt-4 pb-3 text-white mb-1 ps-3 lb-header'>
                    <h2>{region} War Leaderboard</h2>
                </div>

                <div className="row mt-4 mb-4">
                    <div className="col-auto">

                        <div className="dropdown">
                            <a className="btn btn-secondary dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                                <i className="bi bi-table"></i>
                            </a>

                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                                <li><a className="dropdown-item" onClick={() => setRows(25)}>25</a></li>
                                <li><a className="dropdown-item" onClick={() => setRows(50)}>50</a></li>
                                <li><a className="dropdown-item" onClick={() => setRows(100)}>100</a></li>
                                <li><a className="dropdown-item" onClick={() => setRows(500)}>500</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col">
                        {
                            <>
                                <input className="form-control" list="datalistOptions" placeholder="Filter by Country" onChange={updateLocation} />
                                <datalist id="datalistOptions">
                                    {locations.map(l => (
                                        <option value={l.name} key={l.key} />
                                    ))}
                                </datalist>
                            </>
                        }
                    </div>
                </div>

                <table className="table table-striped">
                    <tbody>
                        {
                            data?.slice(0, rows).map((c, index) => {
                                const regionURL = `/clans/leaderboard/${locations.find(l => l.name === c.location.name).key}`;
                                const clanURL = `/clans/${c.tag.substr(1)}`;
                                return (
                                    <TableRow key={index} className='rounded'>
                                        <td scope="row">{c.rank}</td>
                                        <td>{c.clanScore}</td>
                                        <td>
                                            <div className='badge-wrapper'>
                                                <Image src={getClanBadge(c.badgeId, c.clanScore)} height="30" width="30" />
                                            </div>
                                        </td>
                                        <td>
                                            <strong>
                                                <Link href={clanURL}>
                                                    <HighlightLink>{c.name}</HighlightLink>
                                                </Link>
                                            </strong>
                                            <small className="tag"> {c.tag}</small>
                                        </td>
                                        <td>
                                            <Link href={regionURL}>
                                                <HighlightLink>{c.location.name}</HighlightLink>
                                            </Link>
                                        </td>
                                    </TableRow>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export async function getServerSideProps({ params }) {
    let url;
    let region;

    if (params.location === "global") {
        url = `https://proxy.royaleapi.dev/v1/locations/global/rankings/clanwars/?limit=500`;
        region = 'Global'
    }
    else {
        const locationExists = locations.find(l => l.key === params.location.toUpperCase());

        region = locationExists?.name;
        url = `https://proxy.royaleapi.dev/v1/locations/${locationExists?.id}/rankings/clanwars/?limit=500`;
    }

    const data = await apiRequest(url);

    if (!data.items) {
        if (data?.reason === 'badRequest') {
            return { //404
                redirect: {
                    destination: '/',
                    permanent: false
                }
            }
        }

        return { //500
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    return {
        props: {
            data: data.items,
            region: region
        }
    }
}
