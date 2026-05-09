import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export const DiscountType = {
  PERCENTAGE: "PERCENTAGE",
  FIXED: "FIXED"
} as const;

export type DiscountType = (typeof DiscountType)[keyof typeof DiscountType];

@Entity("coupons")
export class Coupon {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  code: string;

  @Column({
    type: "enum",
    enum: DiscountType,
    default: DiscountType.PERCENTAGE
  })
  discountType: DiscountType;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  discountValue: number;

  @Column({ type: "timestamp" })
  expiryDate: Date;
}
