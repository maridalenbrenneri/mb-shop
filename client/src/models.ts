export interface IAddress {
  name: string;
  street1: string;
  street2: string;
  zipCode: string;
  place: string;
  country: string;
}

export interface ICustomer {
  customerNumber: number;
  email: string;
  phone: string;
  name: string;
  organizationNumber: string;
  contactPerson: string;
  address: IAddress;
}

export interface IProductVariation {
  name: string;
  price: number;
  weight: number;
}

export interface IProduct {
  id: number;
  category: string;
  data: any;
  productVariations: Array<IProductVariation>;
  vatGroup: string;
  isActive: boolean;
  isInStock: boolean;
}

export interface IOrder {
  id?: number;
  status: string;
  orderDate: Date;
  deliveryDate: Date;
  customer: ICustomer;
  items: Array<IOrderItem>;
  notes?: Array<any>;
  subscriptionParentOrderId?: number; // is renewal order, this id referes to parent subscription order
  subscriptionData?: ISubscriptionData; // if set, order is a parent subscription
}

export interface IOrderItem {
  product: IProduct;
  productVariation: IProductVariation;
  quantity: number;
  price: number; // from variation or custom
}

export interface ISubscriptionData {
  status: string;
  frequence: number;
}
