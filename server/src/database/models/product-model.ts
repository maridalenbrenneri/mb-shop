import { Sequelize, Model, STRING, BOOLEAN, TEXT } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

export default class ProductModel extends Model {
  public static getProduct = function(productId: Number) {
    return ProductModel.findByPk(productId as any);
  };

  public static getProducts = function(filter) {
    filter = filter || {};
    filter.isDeleted = false;

    return ProductModel.findAll({ where: filter });
  };

  public static createProduct = function(product) {
    return ProductModel.create(product);
  };

  public static updateProduct = function(productId, product) {
    return ProductModel.findByPk(productId).then(dbProduct => {
      return dbProduct.update(product);
    });
  };
}

ProductModel.init(
  {
    category: { type: STRING, allowNull: false },
    data: { type: TEXT },
    productVariations: { type: TEXT },
    infoUrl: { type: STRING },
    vatGroup: { type: STRING, allowNull: false },
    isActive: { type: BOOLEAN, allowNull: false, defaultValue: true },
    isInStock: { type: BOOLEAN, allowNull: false },
    portfolioImageKey: { type: STRING },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "product"
  }
);
