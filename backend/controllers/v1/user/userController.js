const { UserService } = require('../../../services');

class UserController {
  async register(req, res, next) {
    try {
      const user = await UserService.registerUser(req, res, next);
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const token = await UserService.loginUser(req, res, next);
      return res
        .status(200)
        .json({
          user: token,
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refresh_token } = req.body;
      if (!refresh_token) {
        return res.status(400).json({ error: 'Refresh token is required' });
      }
      const { access_token } =
        await UserService.generateAccessTokenFromRefreshToken(refresh_token);
      res.json({ access_token });
    } catch (error) {
      next(error);
    }
  }

  async getUserProfile(req, res, next) {
    try {
      const user = await UserService.getUserById(req, res, next);
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req, res, next) {
    try {
      const updatedUser = await UserService.updateUser(req, res, next);
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async getUserList(req, res, next) {
    try {
      const users = await UserService.getUserList(req, res, next);
      return res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
