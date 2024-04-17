import './style/navbar.css'
import {Link} from 'react-router-dom';
import { useUser } from './UserContext';

const Navbar = () => {
    const {user, setUser} = useUser();
    return (
        <nav className="navbar">
            <div className="home-link">
                <Link to='/'>Pomodoro</Link>
            </div>
            <div className="links">
                <Link to='/timer'>Timer</Link>
                <Link to='/plan'>Plan</Link>
                <Link to='/analysis'>Analysis</Link>
                {
                    user
                    ? <Link to='/home-page'>Home Page</Link>
                    : <Link to='/log-in'>Log In</Link>
                }
            </div>
        </nav>
    );
}
 
export default Navbar;