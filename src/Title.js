import { useUser } from './UserContext';
import './style/content.css'
const Title = () => {
    const {user, setUser} = useUser();
    
    const displayName = user && user.user_name ? user.user_name: '';

    return ( 
        <div>
            <p>This is title page</p>
            <p className = {displayName ? '': 'hide'}>Hello, {displayName}</p>
        </div>
     );
}
 
export default Title;