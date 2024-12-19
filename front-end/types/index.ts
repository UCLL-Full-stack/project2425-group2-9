

export type Role = "CUSTOMER" | "GUEST" | "ADMIN"
export type CustomerInput  = {
  id?: string;
  password?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role? : Role
}


export type Cart = {
  cartId?: string | undefined
  customerId?: string | undefined
  totalPrice?: number
}

export type Product = {
  name: string;
  price: number;
  unit: string;
  stock: number;
  description: string;
  imagePath: string;
};

export type CartItem = {
  cartId: string,
  productName: string,
  quantity: number
}
export type AddprodutToCar = {
  customerId :string;
  productName : string
}
export type StatusMessage = {
  message: string;
  type: "error" | "success";
};


export interface CartDetails {
  product : CartItem[],
  totalPrice: number
}

export interface shopping {
  id: string;
  totalPrice: number;
  isActive: boolean;
  customerId: string;
  product: Product;
}
export interface Order {
  id?: string;
  cartId?: string;
  date: Date;
  customerId: string;
  totalPrice: number;
  cart : shopping
}



export interface OrderResponse {
  order: Order;
  message: string;
}