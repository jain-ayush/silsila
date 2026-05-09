import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity("cart_items")
export class CartItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  cartId: string;

  @ManyToOne("Cart", "items")
  cart: Cart;

  @Column()
  productId: string;

  @ManyToOne("Product")
  product: Product;

  @Column({ default: 1 })
  quantity: number;
}
