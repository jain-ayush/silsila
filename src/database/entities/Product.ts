import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./Category";
import { ProductImage } from "./ProductImage";
import { Review } from "./Review";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ unique: true })
  slug: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "decimal", precision: 10, scale: 2, nullable: true })
  comparePrice: number;

  @Column({ default: 0 })
  stock: number;

  @Column({ unique: true })
  sku: string;

  @Column()
  purity: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  weight: number;

  @Column()
  categoryId: string;

  @ManyToOne("Category", "products")
  category: Category;

  @Column({ default: false })
  featured: boolean;

  @Column({ default: "Silsila" })
  brand: string;

  @Column({ default: "INR" })
  currency: string;

  @Column({ default: "in_stock" })
  availability: string;

  @Column({ nullable: true })
  metaTitle: string;

  @Column({ type: "text", nullable: true })
  metaDescription: string;

  @Column({ nullable: true })
  ogImage: string;

  @OneToMany("ProductImage", "product")
  images: ProductImage[];

  @OneToMany("Review", "product")
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
