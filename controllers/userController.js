const { google } = require('../config/config');
const db = require('../models');
const User = db.User;
const bcrypt = require('bcryptjs');

const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const {email, password} = req.body;
    try{
        const user = await User.findByPk(userId);
        if(!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        if(email && email !== user.email){
            const existingUser = await User.findOne({ where: { email } });
            if(existingUser && existingUser.id !== userId){
                return res.status(400).json({ message: 'Email already exists.' });
            }
            user.email = email;
        }

        if(password){
            user.password = password;
        }

        await user.save();

        res.status(200).json({
          message: "Profile Updated Successfully",
          user: {
            id: user.id,
            email: user.email,
            googleId: user.googleId,
          }
        });
    } catch(error) {
        console.log('Error While Updating User Profile.',error);
        res.status(500).json({ message: 'Server Error While Updating User Profile.', error: error.message });
    }
}

module.exports = {
    updateProfile,
}