import Image from "next/image";
import Link from "next/link";

export default function Commands() {
    return (
        <div className="container bg-white mt-3 rounded pt-3 pb-2">
            <h2>Discord Help</h2>
            <hr />
            <div className="list-group" id="list-tab" role="tablist">
                <a className="list-group-item list-group-item-action active" id="list-clans-list" data-bs-toggle="list" href="#list-clans" role="tab">
                    Linking your Clan(s)
                </a>
                <a className="list-group-item list-group-item-action" id="list-player-list" data-bs-toggle="list" href="#list-player" role="tab">
                    Linking your Player Account
                </a>
                <a className="list-group-item list-group-item-action" id="list-recruiting-list" data-bs-toggle="list" href="#list-recruiting" role="tab">
                    Automated Recruiting through Discord
                </a>
                <a className="list-group-item list-group-item-action" id="list-leaderboards-list" data-bs-toggle="list" href="#list-leaderboards" role="tab">
                    Clan Leaderboards
                </a>
                <a className="list-group-item list-group-item-action" id="list-stats-list" data-bs-toggle="list" href="#list-stats" role="tab">
                    Stats
                </a>
                <hr className="mt-3" />
                <div className="tab-content" id="nav-tabContent">
                    <div className="tab-pane fade show active" id="list-clans" role="tabpanel" aria-labelledby="list-clans-list">
                        <h4><strong>Linking your Clan(s)</strong></h4>
                        <p>You may link up to <strong>3</strong> total clans.</p>
                        <h5>Usage:</h5>
                        <pre className="ps-2 pt-2 pb-2 rounded"><code>
                            ?setClan1 &lt;#TAG&gt; <br />
                            ?setClan2 &lt;#TAG&gt; <br />
                            ?setClan3 &lt;#TAG&gt;
                        </code></pre>
                        <p><em>Replace &lt;#TAG&gt; with your clan's tag.</em></p>
                        <h5>Example:</h5>
                        <Image src="/images/setClanExample.png" height="160" width="478" />
                    </div>
                    <div className="tab-pane fade" id="list-player" role="tabpanel" aria-labelledby="list-player-list">
                        <h4>
                            <strong>Linking your Player Account</strong>
                        </h4>
                        <p>Link your player tag once, so you can use the other commands seamlessly without a tag.</p>
                        <h5>Usage:</h5>
                        <pre className="ps-2 pt-2 pb-2">
                            <code> ?link &lt;#TAG&gt;</code>
                        </pre>
                        <p>
                            <em>Replace &lt;#TAG&gt; with your player tag.</em>
                        </p>
                        <h5>Example:</h5>
                        <Image src="/images/linkExample.png" height="162" width="421" />
                    </div>
                    <div className="tab-pane fade" id="list-recruiting" role="tabpanel" aria-labelledby="list-recruiting-list">
                        <h4><strong>Automated Recruiting through Discord</strong></h4>
                        <p>Allow Discord users to join your server, apply with their tag, and instantly see an overview of of their player profile.</p>
                        <h5>Step 1: <small className="text-muted">Set Apply Channel</small></h5>
                        <p>Set the channel where users will use <code>?apply</code> to apply with their tag upon joining the server.</p>
                        <pre className="ps-2 pt-2 pb-2"><code>
                            ?setApplyChannel
                        </code></pre>
                        <p><small><em>Use this command inside of the channel you would like to set.</em></small></p>
                        <h5>Step 2: <small className="text-muted">Set Applications Channel</small></h5>
                        <p>Set the channel where applications will be posted.</p>
                        <pre className="ps-2 pt-2 pb-2"><code>
                            ?setApplicationsChannel
                        </code></pre>
                        <p><small><em>Use this command inside of the channel you would like to set.</em></small></p>
                        <h5>Examples:</h5>
                        <Image src="/images/applyExample.png" height="162" width="578" /> <br />
                        <Image src="/images/applicationExample.png" height="475" width="403" />
                    </div>
                    <div className="tab-pane fade" id="list-leaderboards" role="tabpanel" aria-labelledby="list-leaderboards-list">
                        <h4>
                            <strong>Clan Leaderboards</strong>
                        </h4>
                        <p>View your clan's war leaderboard. Average is calculated from (up to) last 15 weeks.</p>
                        <h5>Usage:</h5>
                        <pre className="ps-2 pt-2 pb-2">
                            <code> ?lb &lt;1-3&gt; &lt;full&gt;</code>
                        </pre>
                        <h5>Parameters:</h5>
                        <p>
                            <code>1-3</code>: Specify the linked clan (optional) <br />
                            <code>full</code>: View the full leaderbaord (optional)
                        </p>
                        <h5>Example:</h5>
                        <Image src="/images/lbExample.png" height="397" width="456" />
                    </div>
                    <div className="tab-pane fade" id="list-stats" role="tabpanel" aria-labelledby="list-stats-list">
                        <h4>
                            <strong>Stats</strong>
                        </h4>
                        <p>View clan & player war stats.</p>
                        <h5>Usage:</h5>
                        <pre className="ps-2 pt-2 pb-2">
                            <code> ?stats &lt;#TAG / @DISCORD USER&gt;</code> <br />
                            <code> ?clan &lt;#TAG&gt;</code>
                        </pre>
                        <p><em>Replace &lt;#TAG&gt; with your player/clan's tag.</em></p>
                        <h5>Example:</h5>
                        <Image src="/images/statsExample.png" height="399" width="524" /> <br />
                        <Image src="/images/clanStatsExample.png" height="601" width="557" />
                    </div>
                </div>
            </div>
        </div >
    )
}