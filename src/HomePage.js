import {useUser} from './UserContext';

const HomePage = () => {
    const {user, setUser} = useUser();

    return (
            <div>{ user.Name }</div>
    );
}
 
export default HomePage;