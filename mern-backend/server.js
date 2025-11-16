const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);

// 1. MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected successfully');
    } catch (err) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};
connectDB();

// 2. Middleware
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000' }));

// 3. Socket.io Setup - The Real-Time Engine
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', 
        methods: ['GET', 'POST', 'PUT']
    }
});

io.on('connection', (socket) => {
    console.log(`A User Connected: ${socket.id}`);
    
    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

// 4. Routes
// Load the authentication routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks')(io));

// 5. Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));