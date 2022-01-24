import Head from "next/head"
import Image from "next/image"
import { formatRole, getClanBadge, getLastSeenStr } from "../data/functions"

export default function ClanHome(props) {
    const getBadge = () => {
        if (!props.data.globalRank) return <></>

        if (props.data.globalRank === 1)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-1 my-auto ms-2'>#1</span>
        if (props.data.globalRank === 2)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-2 my-auto ms-2'>#2</span>
        if (props.data.globalRank === 3)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-3 my-auto ms-2'>#3</span>
        if (props.data.globalRank <= 10)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-10 my-auto ms-2'>#{props.data.globalRank}</span>
        if (props.data.globalRank <= 25)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-25 my-auto ms-2'>#{props.data.globalRank}</span>
        if (props.data.globalRank <= 100)
            return <span title="Global Rank" className='badge rounded-pill bg-primary bg-100 my-auto ms-2'>
                #{props.data.globalRank}
            </span>

        return <></>
    }

    return (
        <>
            <Head>
                <title>{props.data.name} ({props.data.tag})</title>
            </Head>

            <div className="container bg-white mt-3 rounded pt-3 pb-2">

                <ul className="nav nav-tabs mb-3">
                    <li className="nav-item">
                        <a className="nav-link active" href={`/clans/${props.router.query.tag[0]}`}>
                            <i className="bi bi-house-door-fill"></i>
                        </a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href={`${props.router.asPath}/riverrace`}>River Race</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href={`${props.router.asPath}/riverrace`}>Log</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link disabled">Analytics</a>
                    </li>
                </ul>

                <div className="row">
                    <div className="col d-flex align-items-center justify-content-start">
                        <Image src={getClanBadge(props.data.badgeId, props.data.clanWarTrophies)} height="50" width="50" />
                        <h3 className="my-auto">{props.data.name}</h3>
                        <small className="ms-1 my-auto">{props.data.tag}</small>
                        {getBadge()}
                    </div>
                </div>

                <div className="row mt-1">
                    <div className="col">
                        <p>{props.data.description}</p>
                    </div>
                </div>

                <div className='row'>
                    <div className='col d-flex align-items-center justify-content-start'>
                        <Image src="/images/icons/cw-trophy.png" height={20} width={20} />
                        <p className='my-auto me-4 ms-1'>{props.data.clanWarTrophies}</p>
                        <Image src="/images/icons/trophy.png" height={20} width={20} />
                        <p className='my-auto me-4 ms-1'>{props.data.clanScore}</p>
                        <i className="bi bi-people-fill"></i>
                        <p className='my-auto ms-1'>{props.data.members}/50</p>
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
                            props?.data?.memberList.map((p, i) => {
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