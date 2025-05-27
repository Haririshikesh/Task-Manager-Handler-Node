const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');


//...DotENV Setup...

dotenv.config(); // Load environment variables from .env file


//...Database SetUp...

const db = require('./models');

db.sequelize.sync({ force: false }) // Overrides Tables
.then(() => {
  console.log('✅ Database synced successfully. Tables are ready.');
})
.catch(err => {
    console.error('❌ Error syncing database:', err);
    process.exit(1);
});
  
//...Express Setup & CORS Setup...
const app = express();

app.use(express.json()); // Req.Body

app.use(express.urlencoded({extended : true}));

// app.use(cors());
app.use(cors({
    origin : process.env.CLIENT_URL || 'http://localhost:3000',
    credentials : true
}));

app.use(cookieParser());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // Prevents the session from being saved back to the session store if it hasn't been modified.
    saveUninitialized: false, // Prevents a session from being saved to the store if it's new and hasn't been modified.
    cookie: {
        secure: process.env.NODE_ENV === 'production', 
        httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie.
        maxAge: 24 * 60 * 60 * 1000 
    }
}));

app.use(passport.initialize());

app.use(passport.session());

require('./config/passport')(passport);

//Routes & Error Handlers
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/user', userRoutes);

app.use('/',(req, res)=>{
    res.send('Welcome🙏🏾')
})

app.use((req, res, next) => {
    const error = new Error('🚫🔍 Not Found');
    error.status(404);
    next(error);
})
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        message: error.message,
        stack: process.env.NODE_ENV ? error.stack : {}
    });
});

const PORT = process.env.PORT || 5000 ;
app.listen(PORT, ()=>{
    console.log(`🚀 Server is running on port ${PORT}🚀`);
})