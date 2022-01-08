import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark sticky-top">
            <Link href="/">
                <a className="navbar-brand ms-3">
                    <Image src="/images/logo.png" alt="CW Stats logo" width="30" height="30" />
                    <span className="ms-1">CW Stats</span>
                </a>
            </Link>

            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNavDropdown">
                <ul className="navbar-nav ms-auto me-2">
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link"><i className="bi bi-search"></i></a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link">Players</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link">Clans</a>
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link href="/">
                            <a className="nav-link">Cards</a>
                        </Link>
                    </li>
                    <li className="nav-item dropdown">
                        <Link href="/">
                            <a className="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                Discord Bot
                            </a>
                        </Link>
                        <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdownMenuLink">
                            <a className="dropdown-item" target="_blank" rel="noopener noreferrer" href="https://discord.com/oauth2/authorize?client_id=869761158763143218&permissions=1074056272&scope=bot">Invite to Server</a>
                            <Link href="/help"><a className="dropdown-item">Help</a></Link>
                            <div className="dropdown-divider"></div>
                            <a className="dropdown-item" target="_blank" rel="noopener noreferrer" href="https://top.gg/bot/869761158763143218">Leave a Review</a>
                        </div>
                    </li>
                </ul>
            </div>
        </nav >
    )
}