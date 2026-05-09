import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Address } from "./Address";
import { Order } from "./Order";
import { Review } from "./Review";

export const UserRole = {
  USER: "USER",
  ADMIN: "ADMIN"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phoneNumber: string;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ nullable: true })
  googleId: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER
  })
  role: UserRole;

  @Column({ nullable: true })
  avatar: string;

  @OneToMany("Address", "user")
  addresses: Address[];

  @OneToMany("Order", "user")
  orders: Order[];

  @OneToMany("Review", "user")
  reviews: Review[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
