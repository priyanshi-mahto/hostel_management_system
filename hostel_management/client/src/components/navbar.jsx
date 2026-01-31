import "../styles/navbar.css";
import {Link} from "react-router-dom";

export default function Navbar(){
    return(
        <nav className="navbar">
            <div className="nav-left">
                <h2 className="logo">IIT Indore</h2>
                <span className="sub">Halls of Residence</span>
            </div>

            <div className="nav-right">
                <a href="#">Contact</a>
                <a href="">Dev Team</a>
                <a href="">GitHub</a>

                <Link to="/login">
                  <button className="login-btn">Login</button>
                </Link>
            </div>
        </nav>
    );
}