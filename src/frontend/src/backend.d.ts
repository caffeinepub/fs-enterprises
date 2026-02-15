import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface CartItem {
    productId: string;
    quantity: bigint;
}
export interface Order {
    id: string;
    total: bigint;
    user: Principal;
    items: Array<CartItem>;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    name: string;
    size: string;
    description: string;
    quantity: bigint;
    category: string;
    image?: ExternalBlob;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addToCart(productId: string, quantity: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    calculateCartTotal(): Promise<bigint>;
    clearCart(): Promise<void>;
    createProduct(product: Product): Promise<string>;
    deleteProduct(id: string): Promise<void>;
    getAllOrders(): Promise<Array<Order>>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCart(): Promise<Array<CartItem>>;
    getCeoPhoto(): Promise<ExternalBlob | null>;
    getLogo(): Promise<ExternalBlob | null>;
    getOrder(orderId: string): Promise<Order | null>;
    getProduct(id: string): Promise<Product | null>;
    getUserOrders(): Promise<Array<Order>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(): Promise<string>;
    removeFromCart(productId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateCartItem(productId: string, quantity: bigint): Promise<void>;
    updateCeoPhoto(newPhoto: ExternalBlob): Promise<void>;
    updateLogo(newLogo: ExternalBlob): Promise<void>;
    updateProduct(id: string, product: Product): Promise<void>;
}
