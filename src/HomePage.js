import {useUser} from './UserContext';

const HomePage = () => {
    const {user, setUser} = useUser();

    return (
            <div>{ user }</div>
    );
}
 
export default HomePage;