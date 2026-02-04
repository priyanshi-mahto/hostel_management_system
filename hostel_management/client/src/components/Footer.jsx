import "../styles/footer.css"

export default function Footer(){
    return (
        <footer classname="footer">
            <div className="footer-container">
                <div className="footer-left">
                    <h3>IIT Indore</h3>
                    <p>Hostel Management System</p>
                </div>
                <div className="footer-center">
                    <a href="#">About</a>
                    <a href="#">Contact</a>
                    <a href="#">help</a>
                    <a href="#">Privacy</a>
                </div>

                <div className="footer-right">
                    <p>© {new Date().getFullYear} HMS</p>
                    <p>All Rights Reserved</p>
                </div>
            </div>
        </footer>
    );
}