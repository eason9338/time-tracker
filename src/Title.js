import { useUser } from './UserContext';
import './content.css'
const Title = () => {
    const {user, setUser} = useUser();
    
    const displayName = user && user.Name ? user.Name: '';

    return ( 
        <div>
            <p>This is title page</p>
            <p className = {displayName ? '': 'hide'}>Hello, {displayName}</p>
        </div>
     );
}
 
export default Title;