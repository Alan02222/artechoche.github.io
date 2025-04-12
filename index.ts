
export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    description?: string;
    rating?: number;
    reviews?: Review[];
  }
  
  export interface Review {
    id: number;
    userId: number;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }
  
  export interface Message {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    date: string;
  }
  
  export interface SiteSettings {
    siteTitle: string;
    bannerTitle: string;
    bannerText: string;
    aboutText: string;
    deliveryInfo?: string;
    returnPolicy?: string;
  }
  
  export interface AdminCredentials {
    username: string;
    password: string;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    address?: string;
    phone?: string;
    favorites?: number[];
    verified?: boolean;
  }
  
  export interface Order {
    id: number;
    userId: number;
    products: OrderProduct[];
    total: number;
    status: 'pending' | 'paid' | 'shipped' | 'delivered';
    paymentMethod: 'pix' | 'credit' | 'debit';
    date: string;
    couponApplied?: string;
    discount?: number;
  }
  
  export interface OrderProduct {
    productId: number;
    quantity: number;
    price: number;
  }
  
  export interface CartItem {
    product: Product;
    quantity: number;
  }
  
  export interface Coupon {
    code: string;
    discount: number; // Percentage discount
    expiryDate: string;
    minPurchase?: number;
    used?: boolean;
  }
  