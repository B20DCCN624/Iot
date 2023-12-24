// socketManager.js
import io from 'socket.io-client';
let socket;
let url = 'http://localhost:3005'

export const getSocket = () => {
    console.log('connecting...')
        socket = io(url,{
            reconnectionDelay: 5000,
        });
        socket.on('connect', () => {
            console.log('Connected to server!');
        });
    return socket;
};

export function disconnectSocket() {
    if(socket) {
        socket.disconnect()
    }
}
