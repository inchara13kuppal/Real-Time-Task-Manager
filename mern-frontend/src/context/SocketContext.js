// mern-frontend/src/context/SocketContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext'; // Need AuthContext for token

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { isAuthenticated } = useContext(AuthContext); // Check if user is logged in

    useEffect(() => {
        if (isAuthenticated) {
            // Connect to the backend Socket.io server
            const newSocket = io('http://localhost:5000'); 
            
            newSocket.on('connect', () => {
                console.log('Socket.io connected:', newSocket.id);
            });

            setSocket(newSocket);

            return () => {
                newSocket.close();
                console.log('Socket.io disconnected');
            };
        } else {
            // Disconnect if the user logs out
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [isAuthenticated]); // Re-run effect when authentication state changes

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};