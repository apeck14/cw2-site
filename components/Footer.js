export default function Footer() {
    return (
        <div className="footer mt-auto">

            <footer className="mt-4 bg-dark text-center text-white">

                <div className="container pt-4">
                    <section className="mb-4">
                        <a className="btn btn-floating m-1 circular paypal" href="#!" role="button">
                            <i className="bi bi-paypal"></i>
                        </a>
                    </section>
                </div>

                <div className="text-center pb-3">
                    <small className="footerText">
                        This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it. For more information see Supercell’s Fan Content Policy.
                    </small>
                    <br />
                    <small>©2022 CWStats.com. All rights reserved.</small>
                </div>

            </footer>

        </div>
    )
}