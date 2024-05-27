const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const PORT = process.env.PORT || 8001;

const { Server } = require('socket.io');
const { createServer } = require('node:http');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST"],
    credentials: true
  }
});

const AuthRouter = require('./routes/AuthRoute')
const UserRouter = require('./routes/UserRoutes')
const ChatsRouter = require('./routes/ChatRoutes')(io)
const uploadController = require('./controllers/UploadController')



mongoose.connect('mongodb://127.0.0.1:27017/atmowork')
.then(res => console.log('MongoDB Connected!'))
.catch(err => console.log('MongoDB Connection Failed' , err))

app.use("/",express.static(path.join(__dirname , 'public')))
app.use(cookieParser())
app.use(cors({
    origin: ["http://localhost:3000",],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }))
app.use(express.json({ limit : '50mb' }))
app.use(express.urlencoded({ extended : true ,  limit: '50mb'}))

app.use('/api/auth',AuthRouter)
app.use('/api/user' , UserRouter)
app.use('/api/project' , ChatsRouter )
app.use('/api/upload', uploadController)  

io.on('connection', (socket) => {
  console.log('a user connected' , socket.id);
});



server.listen(PORT, () => { console.log(`Listening on PORT http://localhost:${PORT}`) })
