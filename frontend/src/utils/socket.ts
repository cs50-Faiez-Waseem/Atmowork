import { io } from 'socket.io-client';

const URL : string  =  'http://localhost:8900';

export const socket = io(URL);