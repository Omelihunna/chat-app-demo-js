import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
	return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [onlineUsers, setOnlineUsers] = useState([]);
	const { authUser } = useAuthContext();

	console.log(authUser)

	useEffect(() => {
		console.log("testing")
		if (authUser) {
			const socket = io("http://localhost:2929", {
				query: {
					userId: authUser._id
				}
			});

			console.log("Attempting to connect to server...");

			setSocket(socket);

			socket.on("connect", () => {
				console.log("Connected to server:", socket.id);
			});

			socket.on("getOnlineUsers", (users) => {
				setOnlineUsers(users);
			});

			return () => socket.close();
		} else {
			if (socket) {
				socket.close();
				setSocket(null);
			}
		}
	}, [authUser]);

	console.log("hello")

	return <SocketContext.Provider value={{ socket, onlineUsers }}>{children}</SocketContext.Provider>;
};
