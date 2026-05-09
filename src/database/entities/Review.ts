import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Product } from "./Product";

@Entity("reviews")
export class Review {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  userId: string;

  @ManyToOne("User", "reviews")
  user: User;

  @Column()
  productId: string;

  @ManyToOne("Product", "reviews")
  product: Product;

  @Column({ type: "int" })
  rating: number;

  @Column({ type: "text" })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
