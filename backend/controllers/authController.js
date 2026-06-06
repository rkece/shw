const User = require('../models/User');

// @POST /api/auth/register
exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        if (!name || !email || !password || !phone) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }
        const user = await User.create({ name, email, password, phone });
        const token = user.generateToken();
        res.status(201).json({
            success: true,
            message: 'Account created successfully!',
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }
        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }
        const token = user.generateToken();
        res.json({
            success: true,
            message: 'Login successful!',
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @POST /api/auth/google
exports.googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;
        if (!credential) {
            return res.status(400).json({ success: false, message: 'Google credential token is required' });
        }

        // Verify ID token via Google Tokeninfo API
        const tokenVerifyUrl = `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`;
        const response = await fetch(tokenVerifyUrl);
        const data = await response.json();

        if (data.error_description || data.error) {
            return res.status(400).json({ success: false, message: data.error_description || 'Invalid Google token' });
        }

        const { sub: googleId, email, name } = data;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            // Update googleId if it wasn't saved before
            if (!user.googleId) {
                user.googleId = googleId;
                await user.save();
            }
        } else {
            // Create user
            user = await User.create({
                name: name || 'Google User',
                email: email,
                googleId,
                password: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
                phone: 'Not provided',
            });
        }

        const token = user.generateToken();
        res.json({
            success: true,
            message: 'Login successful via Google!',
            token,
            user: { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role },
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
