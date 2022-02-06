export function battleDaysCompleted(isColosseum, dayOfWeek) {
    if (!isColosseum || dayOfWeek <= 3) return 0;
    else return dayOfWeek - 3;
}

export function getAvgFame(data, isColosseum, dayOfWeek) {
    const attacksCompletedToday = data.participants.reduce((a, b) => a + b.decksUsedToday, 0);
    const currentFame = (isColosseum) ? data.fame : data.periodPoints;
    const battleDaysComp = battleDaysCompleted(isColosseum, dayOfWeek);

    if (isColosseum) {
        if (attacksCompletedToday === 0 && battleDaysComp === 0) return 0;
        return currentFame / (attacksCompletedToday + (200 * battleDaysComp));
    }

    if (attacksCompletedToday === 0) return 0;
    return totalFame / attacksCompletedToday;
}

export function getProjFame(clan, isColosseum, dayOfWeek) {
    const movementPoints = (isColosseum) ? clan.periodPoints : clan.fame;
    const fame = (isColosseum) ? clan.fame : clan.periodPoints;

    if (!isColosseum && movementPoints >= 10000) return 0;

    const maxDuelsCompletedToday = clan.participants.filter(p => p.decksUsedToday >= 2).length;
    const attacksCompletedToday = clan.participants.reduce((a, b) => a + b.decksUsedToday, 0);
    const totalPossibleFame = getMaxFame(clan, isColosseum, dayOfWeek);
    let currentPossibleFame = (maxDuelsCompletedToday * 500) + ((attacksCompletedToday - (maxDuelsCompletedToday * 2)) * 200);
    let winRate = fame / currentPossibleFame;

    if (isColosseum) {
        const battleDaysComp = battleDaysCompleted(isColosseum, dayOfWeek);

        if (attacksCompletedToday === 0 && battleDaysComp === 0) return 0;

        currentPossibleFame += 45000 * battleDaysComp;
        winRate = fame / currentPossibleFame;

        const projFame = fame + ((totalPossibleFame - fame) * winRate);

        return (projFame > 180000) ? 180000 : Math.ceil(projFame / 50) * 50;
    }

    if (attacksCompletedToday === 0) return 0;
    const projFame = fame + ((totalPossibleFame - fame) * winRate);

    return (projFame > 45000) ? 45000 : Math.ceil(projFame / 50) * 50;
}

export function getMaxFame(clan, isColosseum, dayOfWeek) {
    const movementPoints = (isColosseum) ? clan.periodPoints : clan.fame;
    const fame = (isColosseum) ? clan.fame : clan.periodPoints;

    if (!isColosseum && movementPoints >= 10000) return 0;

    const duelsRemainingToday = 50 - clan.participants.filter(p => p.decksUsedToday >= 2).length;
    const totalAttacksRemaining = 200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0); //today
    let maxPossibleFame = fame + (duelsRemainingToday * 500) + ((totalAttacksRemaining - (duelsRemainingToday * 2)) * 200); //max fame today

    if (isColosseum) {
        const battleDaysComp = battleDaysCompleted(isColosseum, dayOfWeek);
        maxPossibleFame += 45000 * (3 - battleDaysComp);
        return (maxPossibleFame > 180000) ? 180000 : maxPossibleFame;
    }

    return (maxPossibleFame > 45000) ? 45000 : maxPossibleFame;
}

export function getMinFame(clan, isColosseum, dayOfWeek) {
    const movementPoints = (isColosseum) ? clan.periodPoints : clan.fame;
    const fame = (isColosseum) ? clan.fame : clan.periodPoints;

    if (!isColosseum && movementPoints >= 10000) return 0;

    let totalAttacksRemaining = 200 - clan.participants.reduce((a, b) => a + b.decksUsedToday, 0);

    if (isColosseum) totalAttacksRemaining += 200 * (3 - battleDaysCompleted(isColosseum, dayOfWeek));

    return fame + (totalAttacksRemaining * 100);
}

export function getBestFinish(data, isColosseum, dayOfWeek) {
    const movementPtsAccessor = (isColosseum) ? 'periodPoints' : 'fame';

    if (data.clan[movementPtsAccessor] >= 10000) return 'N/A';

    const clanProjections = data.clans.map(c => {
        if (c.tag === data.clan.tag)
            return {
                tag: c.tag,
                fame: getMaxFame(c, isColosseum, dayOfWeek)
            }
        else return {
            tag: c.tag,
            fame: getMinFame(c, isColosseum, dayOfWeek)
        }
    });

    const projPlacements = getCurrentPlacements(clanProjections, isColosseum);

    const placement = projPlacements.find(c => c.tag === data.clan.tag).placement;

    return placementStr(placement);
}

export function getWorstFinish(data, isColosseum, dayOfWeek) {
    const movementPtsAccessor = (isColosseum) ? 'periodPoints' : 'fame';

    if (data.clan[movementPtsAccessor] >= 10000) return 'N/A';

    const clanProjections = data.clans.map(c => {
        if (c.tag === data.clan.tag)
            return {
                tag: c.tag,
                fame: getMinFame(c, isColosseum, dayOfWeek)
            }
        else return {
            tag: c.tag,
            fame: getMaxFame(c, isColosseum, dayOfWeek)
        }
    }
    );

    const projPlacements = getCurrentPlacements(clanProjections, isColosseum);

    const placement = projPlacements.find(c => c.tag === data.clan.tag).placement;

    return placementStr(placement);
}

export function getProjFinish(data, isColosseum, dayOfWeek) {
    const clanProjections = data.clans.map(c => (
        {
            tag: c.tag,
            fame: getProjFame(c, isColosseum, dayOfWeek)
        }
    ));

    const projPlacements = getCurrentPlacements(clanProjections, isColosseum);

    const placement = projPlacements.find(c => c.tag === data.clan.tag).placement;

    return placementStr(placement);
}

export function getCurrentPlacements(race, isColosseum) {
    // {tag: '', fame: 0}
    // return {tag: '', fame: 0, placement: 1}
    const newRace = [...race];
    const fameAccessor = (isColosseum) ? 'fame' : 'periodPoints';

    newRace.filter(c => c[fameAccessor] === 0).forEach(c => {
        newRace.find(cl => c.tag === cl.tag).placement = Infinity;
    });

    const clansWithPointsSorted = newRace.filter(cl => cl[fameAccessor] > 0).sort((a, b) => b[fameAccessor] - a[fameAccessor]);
    let place = 1;

    for (let i = 0; i < clansWithPointsSorted.length; i++) {
        const clansWithSameFame = [clansWithPointsSorted[i].tag];

        for (let x = i + 1; x < clansWithPointsSorted.length; x++) {
            if (clansWithPointsSorted[x][fameAccessor] === clansWithPointsSorted[i][fameAccessor]) clansWithSameFame.push(clansWithPointsSorted[x].tag)
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