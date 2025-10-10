const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
// const http = require('http');
// const connectdb = require('./config/db');
// const userRoutes = require('./routes/userRoutes');
// const complaintRoutes = require('./routes/complaintRoutes');

dotenv.config()

const app=express();

// const server=http.createServer(app);

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    // connectdb()
    console.log(`Server is running on http://localhost:${PORT}`);
})