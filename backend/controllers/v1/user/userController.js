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
      return res.status(200).json({ token });
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
      const updatedUser = await UserService.updateUser(
        req,res, next
      );
      return res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
