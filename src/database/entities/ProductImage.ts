import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./Product";

@Entity("product_images")
export class ProductImage {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  productId: string;

  @ManyToOne("Product", "images")
  product: Product;

  @Column()
  url: string;
}
