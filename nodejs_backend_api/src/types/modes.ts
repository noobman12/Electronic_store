import {ObjectId, Model, SchemaDefinitionProperty, Schema} from 'mongoose';

export enum  EnumOrderStatus {
  Pending = 'pending',
  Confirmed = 'confirmed',
  Canceled = 'canceled',
  PrepareShipping = 'prepareShipping',
  Shipping = 'shipping',
  CancelShipping = 'cancelShipping',
  Shipped = 'shipped',
  PendingPaid = 'pendingPaid',
  Paid = 'paid',
  Refund = 'refund',
  Finished = 'finished'
}

export enum  EnumPayments {
  Cash = 'CASH',
  Credit = 'CREDIT',
  Cod = 'COD'
}

export enum  EnumRole {
  Admin = 'admin',
  SubAdmin = 'subAdmin',
  User = 'user'
}

export enum  EnumBoolean {
  Yes = 'true',
  No = 'false',
}


export type TfindAllProduct = {
  page: number; 
  limit: number;
}

export type TStaff = {
  _id?: ObjectId;
  avatar?: string;
  first_name: string;
  last_name: string;
  phone: string;        
  email: string;
  password: string;
  active?: boolean,
  role?: string;
}

export type TCustomer = {
  _id?: ObjectId;
  avatar?: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip_code?: string;
  password: string;
  active?: boolean;
  isDelete?: boolean;
}
export type TOrderItems = {
  product: ObjectId;
  product_name: string;
  quantity: number;
  price: number;
  discount: number;
  price_end: number;
  thumbnail?: string;
  name: string;
}

export type TActionOrder = {
  staff: ObjectId;
  action: string;
  orderStatus: string,
  note: string;
}
export interface IOrder {
  customer?: ObjectId;
  staff?: ObjectId;
  order_date: Date,
  require_date?: Date,
  shipping_date?: Date,
  order_status: number,
  street: string,
  city: string,
  state: string,
  zip_code?: string,
  payment_type: number,
  order_note?: string,
  order_itemts: TOrderItems[],
  createdAt?: Date,
  order_items?: SchemaDefinitionProperty<ObjectId | undefined, IOrder> | undefined,
  isDelete?: boolean
}

export interface IPayloadOrder {
  orderItems: TOrderItems[],
  orderNote?: string,
  paymentType: EnumPayments,
  customer: {
      customerId?: string,
      firstName: string,
      lastName: string,
      email: string,
      phone: string,
      address: string,
      district: string,
      yard: string,
      province: string,
  }
 
}
// Models and schemas
export type OrderModelType = Model<IOrder>;

export type TPayloadBrand = {
  id: ObjectId,
  brand_name: string,
  description?: string,
  slug: string,
  logo_url?: string,
  order?: number,
  isActive: boolean
};
export type TPayloadCategory = {
  _id: ObjectId;
  category_name: string;
  slug: string;
  imageUrl: string;
  order: number;
  description?: string;
  isActive: boolean
};

