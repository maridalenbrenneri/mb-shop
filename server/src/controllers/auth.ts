import { Response, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import UserModel from '../database/models/user-model';
import userService from '../services/user-service';

class AuthController {
  /**
   * AUTH
   */
  authenticate = async function (req: Request, res: Response) {
    const user = await UserModel.getUserByEmail(req.body.email);

    if (!user) return res.status(401).send();

    if (req.body.password === user.password) {
      // todo: bcrypt...

      let userInfo = {
        id: user.id,
        role: user.role,
      };

      let token = jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: 86400 * 365, // 1 year
      });

      return res.send({
        token: token,
        email: user.email,
      });
    }
  };

  /**
   * GET /users/me
   */
  getMe = function (req: Request, res: Response) {
    return userService.getUser(req.user.id, res);
  };

  /**
   * POST /api/users
   */
  registerUser = function (req: Request, res: Response) {
    return res.status(403);

    // todo: We do nothing until full user registration is implemented

    // todo: check auth if role != customer

    // todo: bcrypt password...

    // let user = req.body;
    // user.role = 'customer';
    // user.isActive = true;

    // UserRepo.createUser(req.body).then(user => {
    //     return res.send(user);

    // }).catch(Sequelize.ValidationError, function (err) {
    //     return res.status(422).send(err.errors);
    // });
  };
}

export default new AuthController();
