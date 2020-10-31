import UserModel from '../database/models/user-model';
import { Response } from 'express';

class UserService {
  getUser(userId: number, res: Response) {
    let self = this;

    return UserModel.getUser(userId).then((user) => {
      if (!user) {
        return res.status(404).send(`User ${userId} was not found`);
      }

      return res.send(self.mapToClientModel(user));
    });
  }

  // Currently not in use
  // private mapToDbModel = function(user) {
  //     return {
  //         email: user.email,
  //         password: user.password,
  //         role: user.role,
  //         isActive: user.isActive
  //     };
  // }

  private mapToClientModel = function (user) {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    };
  };
}

export default new UserService();
