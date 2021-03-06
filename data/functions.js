const badges = require('./badges.json')

export function getClanBadge(badgeId, trophyCount) {
    if (badgeId === -1 || badgeId === null) return '/images/allBadges/no_clan'; //no clan

    const badgeName = badges.find(b => b.id === badgeId).name;
    let league;

    if (trophyCount >= 5000) league = 'legendary-3';
    else if (trophyCount >= 4000) league = 'legendary-2';
    else if (trophyCount >= 3000) league = 'legendary-1';
    else if (trophyCount >= 2500) league = 'gold-3';
    else if (trophyCount >= 2000) league = 'gold-2';
    else if (trophyCount >= 1500) league = 'gold-1';
    else if (trophyCount >= 1200) league = 'silver-3';
    else if (trophyCount >= 900) league = 'silver-2';
    else if (trophyCount >= 600) league = 'silver-1';
    else if (trophyCount >= 400) league = 'bronze-3';
    else if (trophyCount >= 200) league = 'bronze-2';
    else league = 'bronze-1';

    return `/images/allBadges/${badgeName}_${league}.png`;
}

export function formatRole(role) {
    if (role === 'member') return 'Member';
    if (role === 'elder') return 'Elder';
    if (role === 'coLeader') return 'Co-Leader';
    if (role === 'leader') return 'Leader';
}

export function parseDate(date) {
    if (date instanceof Date) return date;
    return new Date(Date.UTC(
        date.substr(0, 4),
        date.substr(4, 2) - 1,
        date.substr(6, 2),
        date.substr(9, 2),
        date.substr(11, 2),
        date.substr(13, 2),
    ));
}

export function getLastSeenStr(timestamp) {
    if (!timestamp) return '0m';
    const now = new Date();
    const date = parseDate(timestamp);

    let ms = now - date;
    let str = '';

    const days = Math.floor(ms / 1000 / 60 / 60 / 24);
    if (days) {
        str += `${days}d `;
        ms -= days * 1000 * 60 * 60 * 24;
    }

    const hours = Math.floor(ms / 1000 / 60 / 60);
    if (hours) {
        str += `${hours}h `;
        ms -= hours * 1000 * 60 * 60;
    }

    const mins = Math.floor(ms / 1000 / 60);
    if (mins) {
        str += `${mins}m `;
        ms -= mins * 1000 * 60;
    }

    if (!days && !hours && !mins) return '0m';

    return str.trim();
}

export async function apiRequest(url) {
    const options = {
        headers: {
            'Authorization': `Bearer ${process.env.API_TOKEN}`
        }
    }

    const res = await fetch(url, options);
    return await res.json();
}

export function hexToRgbA(hex) {
    let c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',0.5)';
    }
    return 'rgba(255, 255, 255, 0.5)'; //transparent white
}
