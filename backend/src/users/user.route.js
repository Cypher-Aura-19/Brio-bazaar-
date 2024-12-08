//for admin and user
const express = require('express');
const router = express.Router();
const User = require('./user.model');
const Seller = require('../sellers/Seller');
const Product = require('../products/products.model');
const generateToken = require('../middleware/generateToken');
const verifyToken = require('../middleware/verifyToken');
require('dotenv').config()


// Register endpoint
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = new User({ email, password, username });
        await user.save();
        res.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send({ message: 'Registration failed' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        // Check if the user exists
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Verify password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Generate token for user (without expiration, as you requested)
        const token = await generateToken(user._id, 'user');

        // Send response with the token and user information
        res.cookie('token', token, { 
            httpOnly: true,
            secure: true,  // Ensure secure is true for HTTPS
            sameSite: 'None',
        });
        res.status(200).send({
            message: 'Logged in successfully',
            token,
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
            }
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).send({ message: 'Login failed' });
    }
});


// Logout endpoint (optional)
router.post('/logout', (req, res) => {
    res.clearCookie('token'); 
    res.status(200).send({ message: 'Logged out successfully' });
});


// all users 

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role').sort({ createdAt: -1 });
        res.status(200).send(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send({ message: 'Failed to fetch users' });
    }
});

// delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send({ message: 'Failed to delete user' });
    }
})

// update a user role
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        res.status(200).send({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error('Error updating user role:', error);
        res.status(500).send({ message: 'Failed to update user role' });
    }
});

// Edit Profile endpoint
router.patch('/edit-profile', async (req, res) => {
    try {
        // Destructure fields from the request body
        const { userId, username, profileImage, bio, profession } = req.body;

        // Check if userId is provided
        if (!userId) {
            return res.status(400).send({ message: 'User ID is required' });
        }

        // Find user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Update the user's profile with provided fields
        if (username !== undefined) user.username = username;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (bio !== undefined) user.bio = bio;
        if (profession !== undefined) user.profession = profession;

        // Save the updated user profile
        await user.save();

        // Send the updated user profile as the response
        res.status(200).send({
            message: 'Profile updated successfully',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession,
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).send({ message: 'Profile update failed' });
    }
});

router.post('/seller-login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find seller by email
        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(404).send({ message: 'Seller not found' });
        }

        // Verify password
        const isMatch = await seller.comparePassword(password);
        if (!isMatch) {
            return res.status(401).send({ message: 'Invalid credentials' });
        }

        // Check if seller is approved by admin
        if (!seller.isApproved) {
            return res.status(403).send({ message: 'Seller is not approved by admin' });
        }

        // Generate token for seller (passing 'seller' as the second parameter)
        const token = await generateToken(seller._id, 'seller');

        // Send response with the token and seller information
        res.cookie('token', token, { 
            httpOnly: true,
            secure: true, // Ensure this is true for HTTPS
            sameSite: 'None',
        });
        res.status(200).send({
            message: 'Logged in successfully',
            token,
            seller: {
                _id: seller._id,
                storeName: seller.storeName,
                email: seller.email,
                phone: seller.phone,
                isApproved: seller.isApproved,
            },
        });
    } catch (error) {
        console.error('Error logging in seller:', error);
        res.status(500).send({ message: 'Login failed' });
    }
});


router.post('/favorites', verifyToken, async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      if (!user.favorites.includes(productId)) {
        user.favorites.push(productId);
        await user.save();
      }
  
      res.status(200).json({ message: "Product added to favorites" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
  router.get('/favorites', verifyToken, async (req, res) => {
    const { userId } = req.query;
  
    try {
      const user = await User.findById(userId).populate('favorites');
      if (!user) return res.status(404).json({ message: "User not found" });
  
      res.status(200).json({ favorites: user.favorites.map((product) => product._id) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  
  router.delete('/favorites/remove', async (req, res) => {
    const { userId, productId } = req.body;
  
    try {
      // Find the user by userId
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Find the product by productId to ensure it exists
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
  
      // Check if the product is already in favorites
      const index = user.favorites.indexOf(productId);
      if (index === -1) {
        return res.status(400).json({ message: 'Product not in favorites' });
      }
  
      // Remove the product from the favorites array
      user.favorites.splice(index, 1);
  
      // Save the updated user
      await user.save();
  
      return res.status(200).json({ message: 'Product removed from favorites' });
    } catch (error) {
      console.error('Error removing product from favorites:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });



module.exports = router;