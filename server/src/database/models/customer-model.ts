import { Sequelize, Model, STRING, BOOLEAN, TEXT } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  dialectOptions: {}
});

export default class CustomerModel extends Model {
  public static getCustomer = function(customerId) {
    let customer = CustomerModel.findByPk(customerId);
    return this.mapToClientModel(customer);
  };

  public static getCustomers = function(filter) {
    filter = filter || {};
    filter.isDeleted = false;

    let dbCustomers = CustomerModel.findAll({ where: filter });

    return dbCustomers.map(customer => this.mapToClientModel(customer));
  };

  public static createCustomer = function(customer) {
    return CustomerModel.create(this.mapToDbModel(customer));
  };

  public static updateCustomer = function(customerId, customer) {
    return CustomerModel.findByPk(customerId).then(dbCustomer => {
      return dbCustomer.update(CustomerModel.mapToDbModel(customer));
    });
  };

  static mapToDbModel = function(customer) {
    return {
      email: customer.email,
      name: customer.name,
      organizationNumber: customer.organizationNumber,
      phone: customer.phone,
      contactPerson: customer.contactPerson,
      isActive: customer.isActive,
      deliveryAddress: JSON.stringify(customer.deliveryAddress),
      invoiceAddress: JSON.stringify(customer.invoiceAddress),
      note: JSON.stringify(customer.note),
      type: customer.type
    };
  };

  static mapToClientModel = function(customer) {
    return {
      id: customer.id,
      email: customer.email,
      name: customer.name,
      organizationNumber: customer.organizationNumber,
      phone: customer.phone,
      contactPerson: customer.contactPerson,
      isActive: customer.isActive,
      deliveryAddress: JSON.parse(customer.deliveryAddress),
      invoiceAddress: JSON.parse(customer.invoiceAddress),
      note: JSON.parse(customer.note),
      type: customer.type
    };
  };
}

CustomerModel.init(
  {
    email: { type: STRING, unique: true, allowNull: false },
    name: { type: STRING, allowNull: false },
    organizationNumber: { type: STRING },
    phone: { type: STRING },
    contactPerson: { type: STRING },
    deliveryAddress: { type: TEXT },
    invoiceAddress: { type: TEXT },
    note: { type: STRING },
    type: { type: STRING },
    isActive: { type: BOOLEAN, allowNull: false, defaultValue: true },
    isDeleted: { type: BOOLEAN, allowNull: false, defaultValue: false }
  },
  {
    sequelize,
    modelName: "customer"
  }
);
