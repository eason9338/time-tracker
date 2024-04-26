import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                console.log("沒有找到 token");
                return;
            }
    
            try {
                const response = await fetch("http://localhost:8000/api/auto-login", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                }
            } catch (error) {
                console.error("獲取用戶資訊時發生錯誤：", error);
            }
        };
    
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            { children }
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);