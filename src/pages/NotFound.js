import { Link, useNavigate } from "react-router-dom";
import '../style/content.css';
import { useEffect } from "react";

const NotFound = () => {

    const navigate = useNavigate();
    useEffect(() => {
        setTimeout(() => {
            navigate('/');
        }, 5000)
    })

    return (
        <div className="not-found">
            <h2>Page not found</h2>
            <p>The page your heading to was not found</p>
            <br />
            <p>Auto redirecting to home page in 5 seconds...</p>
        </div>
    );
}
 
export default NotFound;