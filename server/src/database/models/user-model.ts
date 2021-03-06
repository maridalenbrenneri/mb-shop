import { Sequelize, Model, STRING, INTEGER, BOOLEAN } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
  dialectOptions: {},
});

export default class UserModel extends Model {
  public static getUser = function (userId: Number) {
    return UserModel.findByPk(userId as any);
  };

  public static getUserByEmail = function (email: String) {
    return UserModel.findOne({ where: { email: email as any } });
  };

  public static createUser = function (user: UserModel) {
    return UserModel.create(user);
  };

  public id: number;
  public email: string;
  public password: string;
  public role: string;
  public customerId: string;
  public isActive: boolean;
  public isDeleted: boolean;
}

UserModel.init(
  {
    email: { type: STRING, unique: true },
    password: { type: STRING, allowNull: false },
    role: { type: STRING, allowNull: false }, // admin, super-user, private-customer, business-customer
    customerId: { type: INTEGER, allowNull: true },
    isActive: { type: BOOLEAN, allowNull: false },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false },
  },
  {
    sequelize,
    modelName: 'users',
  }
);
