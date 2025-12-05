/**
 * Admin Password Protection Middleware
 * 
 * Adds an additional layer of password protection for admin.affynix.ai
 * This works in conjunction with the existing API-based authentication
 */

// This would be used in a serverless function or edge middleware
// For Vercel, we'll use Vercel's built-in password protection instead

export function requireAdminPassword(req, res, next) {
  // Check for password in session or cookie
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionPassword = req.cookies?.admin_password;
  
  if (!adminPassword) {
    // No password set, skip protection
    return next();
  }
  
  if (sessionPassword === adminPassword) {
    // Password matches, allow access
    return next();
  }
  
  // Check if password is provided in request
  const providedPassword = req.headers['x-admin-password'] || req.query.password;
  
  if (providedPassword === adminPassword) {
    // Set cookie for future requests
    res.cookie('admin_password', adminPassword, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return next();
  }
  
  // Password required
  return res.status(401).json({
    error: 'Admin password required',
    message: 'Please provide the admin password to access this resource',
  });
}

