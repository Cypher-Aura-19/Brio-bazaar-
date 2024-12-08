// for admin
const jwt = require('jsonwebtoken');
const User = require('../users/user.model');
const Seller = require('../sellers/Seller'); // Import the Seller model

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Updated generateToken function to support both User and Seller, without expiration
const generateToken = async (userId, userType = 'user') => {
    try {
        let user;
        
        // Depending on the userType (either 'user' or 'seller'), query the appropriate model
        if (userType === 'user') {
            user = await User.findById(userId);
        } else if (userType === 'seller') {
            user = await Seller.findById(userId);
        }

        if (!user) {
            throw new Error(`${userType.charAt(0).toUpperCase() + userType.slice(1)} not found`);
        }

        // Generate token with user data, without expiration
        const token = jwt.sign(
            { userId: user._id, role: user.role },  // Payload with user ID and role
            JWT_SECRET
        );

        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw error;
    }
};

module.exports = generateToken;
