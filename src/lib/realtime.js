
import ioClient from "socket.io-client";
const ENDPOINT = "http://localhost:80";
const socket = ioClient(ENDPOINT, { transports: ["websocket"] });
console.log(socket);
export const io = socket;


