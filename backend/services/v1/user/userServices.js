const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../../models'); // Adjust path as needed
const { log } = require('../../../utils/debugger');
const {
  registerSchema,
  loginSchema,
  updateUserSchema,
} = require('../../../validators');

class UserService {
  constructor() {
    this.salt = Number(process.env.PASSWORD_SALT) || 10; // Default salt if not set
    this.jwtAccessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
    this.jwtAccessTokenLife = process.env.JWT_ACCESS_TOKEN_LIFE || '1d';
    this.jwtRefreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
    this.jwtRefreshTokenLife = process.env.JWT_REFRESH_TOKEN_LIFE || '30d';
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, this.salt);
  }

  async comparePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  // Register new user
  async registerUser(req, res, next) {
    try {
      let { name, email, password } = req.body;

      const { error } = registerSchema.validate({ name, email, password });
      if (error) throw new Error(error.details[0].message);
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      await user.save();

      return { success: true, userId: user._id };
    } catch (err) {
      throw err;
    }
  }

  // Login user and return JWT token
  async loginUser(req, res, next) {
    try {
      let { email, password } = req.body;

      const { error } = loginSchema.validate({ email, password });
      if (error) throw new Error(error.details[0].message);

      const user = await User.findOne({ email });
      if (!user) throw new Error('Invalid email or password');

      const isMatch = await this.comparePassword(password, user.password);
      if (!isMatch) throw new Error('Invalid email or password');

      // Create JWT payload
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        this.jwtAccessTokenSecret,
        { expiresIn: this.jwtAccessTokenLife }
      );

      return { token, userId: user._id, name: user.name, email: user.email };
    } catch (err) {
      throw err;
    }
  }

  // Get user info by ID (for profile or auth validation)
  async getUserById(req, res, next) {
    try {
      const userId = req.params?.id || req.user?.userId || null; // Use ID from request params or authenticated user
      if (!userId) throw new Error('User ID is required');
      const user = await User.findById(userId).select('-password');
      if (!user) throw new Error('User not found');
      return user;
    } catch (err) {
      throw err;
    }
  }

  // Update user info (name, email etc.)
  async updateUser(req, res, next) {
    try {
      const userId = (req.params?.id || req.user?.userId) ?? null; // Use ID from request params or authenticated user
      if (!userId) throw new Error('User ID is required');
      let updateData = req.body;
      const { error } = updateUserSchema.validate(updateData);
      if (error) throw new Error(error.details[0].message);
      const allowedUpdates = ['name', 'email', 'password'];
      const updates = {};

      for (const key of Object.keys(updateData)) {
        if (allowedUpdates.includes(key)) {
          updates[key] = updateData[key];
        }
      }

      // If password update requested, hash it
      if (updates.password) {
        updates.password = await this.hashPassword(updates.password);
      }

      const user = await User.findByIdAndUpdate(userId, updates, {
        new: true,
        runValidators: true,
        select: '-password',
      });

      if (!user) throw new Error('User not found');

      return user;
    } catch (err) {
      throw err;
    }
  }

  // Get list of users with pagination
  async getUserList(req, res, next) {
    try {
      // Default page & limit if not provided
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;

      if (page < 1 || limit < 1) {
        throw new Error('Page and limit must be positive integers');
      }

      const skip = (page - 1) * limit;

      // Fetch users with pagination, exclude password
      const [users, totalUsers] = await Promise.all([
        User.find()
          .select('-password')
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 }),
        User.countDocuments(),
      ]); // Newest first


      return {
        users,
        pagination: {
          currentPage: page,
          pageSize: limit,
          totalUsers,
          totalPages: Math.ceil(totalUsers / limit),
        },
      };
    } catch (err) {
      throw err;
    }
  }
}

module.exports = new UserService();
