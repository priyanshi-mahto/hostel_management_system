import Navbar from "../components/navbar.jsx";
import Footer from "../components/Footer.jsx";
import {Link} from "react-router-dom";
import "../styles/welcome.css";

export default function Welcome(){
    return(
        <>
        <div className="welcome">
            <Navbar/>
            <div className="hero-center">
                <h1>
                    Welcome to <br/>
                    <span>Hostel Management System</span>
                </h1>
                <p>
                    Access all hostel services and resources in one place.
                    Manage accommodation, complaints, leave requests and visitors easily.
                </p>
                <Link to="/login">
                <button className="primary-btn">
                    Login Now 
                </button>
                </Link>
            </div>
        </div>
            <Footer/>
         </>
    )
}
