import {useUser} from './UserContext';
import {useNavigate} from 'react-router-dom';

const HomePage = () => {
    const {user, setUser} = useUser();
    const navigate = useNavigate();

    const handleSubmit = () => {
        navigate('/log-in');
        setUser(null);
        console.log("登出成功");
    }

    return (
            <div>
                <h3>This is your page, {user.Name}</h3>
                <button onClick={handleSubmit}>Log out</button>
            </div>
    );
}
 
export default HomePage;