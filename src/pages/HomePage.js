import { useUser } from '../context/UserContext'
import {useNavigate} from 'react-router-dom';
import '../style/homepage.css';

const HomePage = () => {
    const {user, setUser} = useUser();
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/log-in');
        setUser(null);
        console.log("登出成功");
    }

    const NavToManagePage = () => {
        navigate('/home-page/manage-tag');
    }

    return (
            <div className="personal-page">
                <h2>Hello, {user ? user.user_name: ''}</h2>
                    <br />
                    <h3>Personal Information</h3>
                    <div className="personal-info">
                        <p>Email:  </p>
                        <p className="personal-content">{user ? user.user_email: ''}</p>
                    </div>
                    <div className="personal-info">
                        <p>User Name: </p>
                        <p className='personal-content'>{user ? user.user_name: ''}</p>
                    </div>

                    <h3>Manage Tags</h3>
                    <button onClick={NavToManagePage}>Manage</button>
                    <br />
                    <h3>Account Setting</h3>
                    <button onClick={handleSubmit}>Log out</button>
            </div>
    );
}
 
export default HomePage;