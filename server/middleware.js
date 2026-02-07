const admin = require('firebase-admin');

// Initialize Firebase Admin (assuming serviceAccount is set up env vars)
// admin.initializeApp();

/**
 * Express Middleware to Verify Admin Token
 * 
 * Usage:
 * app.use('/api/admin', verifyAdmin, adminRoutes);
 */
const verifyAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        // 1. Verify the ID token
        const decodedToken = await admin.auth().verifyIdToken(token);

        // 2. Check for Custom Claim 'admin'
        if (decodedToken.admin === true) {
            req.user = decodedToken;
            return next();
        } else {
            return res.status(403).json({ error: 'Forbidden: Admin privileges required' });
        }
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

/**
 * Rate Limiting Example (using express-rate-limit)
 * 
 * npm install express-rate-limit
 */
/*
const rateLimit = require('express-rate-limit');

const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

// app.post('/api/admin/login', adminLoginLimiter, loginHandler);
*/

module.exports = { verifyAdmin };
