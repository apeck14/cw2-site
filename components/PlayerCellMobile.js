import { getLastSeenStr } from "../data/functions";

export default function PlayerCellMobile({ name, role, lastSeen }) {
    return <div>
        <span className="fw-bold">{name} </span>
        <small className="text-secondary">{getLastSeenStr(lastSeen)}</small>
        <br />
        <small>{role}</small>
    </div>
}