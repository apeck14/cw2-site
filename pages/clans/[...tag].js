import React from 'react';
import { apiRequest } from '../../data/functions'
import { useRouter } from 'next/router'
import ClanHome from '../../components/ClanHome';
import ClanRiverRace from '../../components/ClanRiverRace';

export default function ClanData({ data }) {
    const router = useRouter();

    if (router.query.tag.length === 1) return <ClanHome data={data} router={router} />
    if (router.query.tag.length === 2) {
        if (router.query.tag[1].toLowerCase() === 'riverrace') return <ClanRiverRace data={data} router={router} />
    }
}

export async function getServerSideProps({ params }) {

    if (params.tag.length > 2) {
        return { //404
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    if (params.tag.length === 1) { // /clans/[tag]
        const url = `https://proxy.royaleapi.dev/v1/clans/%23${params.tag[0]}`;
        const lb_url = `https://proxy.royaleapi.dev/v1/locations/global/rankings/clanwars/?limit=100`;

        const [data, lb] = await Promise.all([apiRequest(url), apiRequest(lb_url)]);

        if (!data.tag) {
            if (data.reason === "notFound") {
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
                },
            }
        }

        let globalRank = lb.items.findIndex(c => c.tag === data.tag) + 1;
        if (globalRank === 0) globalRank = null;

        data.globalRank = globalRank;

        return {
            props: {
                data
            }
        }
    }

    if (params.tag.length === 2) { // /clans/[tag]/[riverrace || log || analytics]
        if (params.tag[1].toLowerCase() === 'riverrace') {
            const url = `https://proxy.royaleapi.dev/v1/clans/%23${params.tag[0]}/currentriverrace`;
            const members_url = `https://proxy.royaleapi.dev/v1/clans/%23${params.tag[0]}/members`;
            const [data, memberList] = await Promise.all([apiRequest(url), apiRequest(members_url)]);

            if (!data.clan?.tag) {
                if (data.reason === "notFound") {
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
                    },
                }
            }

            data.clan.memberList = memberList.items;

            return {
                props: {
                    data
                }
            }
        }
    }
}
