import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const currUser = localStorage.getItem(user)
        if(currUser) {
            setUser(JSON.parse(currUser));
        }
    }, [])

    return (
        <UserContext.Provider value={{user, setUser}}>
            { children }
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);