export function battleDaysCompleted(data) {
    const isCololsseum = data.periodType === 'colosseum';
    const dayOfWeek = data.periodIndex % 7; // 0-6 (0,1,2 TRAINING, 3,4,5,6 BATTLE)

    if (!isCololsseum || dayOfWeek <= 3) return 0;
    else return dayOfWeek - 3;
}

export function getAvgFame(data) {
    const isCololsseum = data.periodType === 'colosseum';
    const attacksCompletedToday = data.participants.reduce((a, b) => a + b.decksUsedToday, 0);
    const totalFame = data.periodPoints;

    if (isCololsseum) {
        if (attacksCompletedToday === 0 && battleDaysCompleted(data) === 0) return 0;
        return totalFame / (attacksCompletedToday + (200 * battleDaysCompleted(data)));
    }

    if (attacksCompletedToday === 0) return 0;
    return totalFame / attacksCompletedToday;
}

export function getProjFame(clan, isColosseum) {
    if (clan.fame >= 10000) return 0;
    const maxDuelsCompletedToday = clan.participants.filter(p => p.decksUsedToday >= 2).length;
    const attacksCompletedToday = clan.participants.reduce((a, b) => a + b.decksUsedToday, 0);
    const currentFame = clan.periodPoints;
    const currentPossibleFame = (maxDuelsCompletedToday * 500) + ((attacksCompletedToday - (maxDuelsCompletedToday * 2)) * 200);
    const totalPossibleFame = getMaxFame(clan, isColosseum);
    const winRate = currentFame / currentPossibleFame;

    if (isColosseum) {
        const battleDaysCompleted = battleDaysCompleted(date);

        if (attacksCompletedToday === 0 && battleDaysCompleted === 0) return 0;

        return 0;
    }

    if (attacksCompletedToday === 0) return 0;
    const projFame = currentFame + ((totalPossibleFame - currentFame) * winRate);

    return (projFame > 45000) ? 45000 : Math.ceil(projFame / 50) * 50;
}

export function getMaxFame(clan, isColosseum) {
    if (clan.fame >= 10000) return 0;
    const currentFame = clan.periodPoints;
    const totalAttacksRemaining = 200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0);
    const duelsRemaining = 50 - clan.participants.filter(p => p.decksUsedToday >= 2).length;

    const maxFame = currentFame + (duelsRemaining * 500) + ((totalAttacksRemaining - (duelsRemaining * 2)) * 200);

    return (maxFame > 45000) ? 45000 : maxFame;
}

export function getMinFame(clan, isColosseum) {
    if (clan.fame >= 10000) return 0;
    const currentFame = clan.periodPoints;
    const totalAttacksRemaining = 200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0);

    return currentFame + (totalAttacksRemaining * 100);
}

export function getBestFinish(data) {
    if (data.clan.fame >= 10000) return 'N/A';
    const isColosseum = data.periodType === "colosseum";
    const clanProjections = data.clans.map(c => {
        if (c.tag === data.clan.tag)
            return {
                tag: c.tag,
                fame: getMaxFame(c, isColosseum)
            }
        else return {
            tag: c.tag,
            fame: getMinFame(c, isColosseum)
        }
    }
    );

    const projPlacements = getCurrentPlacements(clanProjections);

    const placement = projPlacements.find(c => c.tag === data.clan.tag).placement;

    return placementStr(placement);
}

export function getWorstFinish(data) {
    if (data.clan.fame >= 10000) return 'N/A';
    const isColosseum = data.periodType === "colosseum";
    const clanProjections = data.clans.map(c => {
        if (c.tag === data.clan.tag)
            return {
                tag: c.tag,
                fame: getMinFame(c, isColosseum)
            }
        else return {
            tag: c.tag,
            fame: getMaxFame(c, isColosseum)
        }
    }
    );

    const projPlacements = getCurrentPlacements(clanProjections);

    const placement = projPlacements.find(c => c.tag === data.clan.tag).placement;

    return placementStr(placement);
}

export function getProjFinish(data) {
    const isColosseum = data.periodType === "colosseum";
    const clanProjections = data.clans.map(c => (
        {
            tag: c.tag,
            fame: getProjFame(c, isColosseum)
        }
    ));

    const projPlacements = getCurrentPlacements(clanProjections);

    const placement = projPlacements.find(c => c.tag === data.clan.tag).placement;

    return placementStr(placement);
}

export function getCurrentPlacements(race) {
    // {tag: '', fame: 0}
    // return {tag: '', fame: 0, placement: 1}
    const newRace = [...race];

    newRace.filter(c => c.fame === 0).forEach(c => {
        newRace.find(cl => c.tag === cl.tag).placement = Infinity;
    });

    const clansWithPointsSorted = newRace.filter(cl => cl.fame > 0).sort((a, b) => b.fame - a.fame);
    let place = 1;

    for (let i = 0; i < clansWithPointsSorted.length; i++) {
        const clansWithSameFame = [clansWithPointsSorted[i].tag];

        for (let x = i + 1; x < clansWithPointsSorted.length; x++) {
            if (clansWithPointsSorted[x].fame === clansWithPointsSorted[i].fame) clansWithSameFame.push(clansWithPointsSorted[x].tag)
        }

        for (const c of clansWithSameFame) {
            newRace.find(cl => c === cl.tag).placement = place;
        }

        i += clansWithSameFame.length - 1;
        place += clansWithSameFame.length;
    }

    return newRace;
}

export function placementStr(placement) {
    if (placement === 1) return '1st';
    else if (placement === 2) return '2nd';
    else if (placement === 3) return '3rd';
    else if (placement === 4) return '4th';
    else if (placement === 5) return '5th';
    else return 'N/A';
}