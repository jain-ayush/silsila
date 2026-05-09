import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
import { User } from "../entities/User";
import { Address } from "../entities/Address";
import { Category } from "../entities/Category";
import { Product } from "../entities/Product";
import { ProductImage } from "../entities/ProductImage";
import { Order } from "../entities/Order";
import { OrderItem } from "../entities/OrderItem";
import { Cart } from "../entities/Cart";
import { CartItem } from "../entities/CartItem";
import { Payment } from "../entities/Payment";
import { Coupon } from "../entities/Coupon";
import { Review } from "../entities/Review";

export const AppDataSource = new DataSource({
  type: "mysql",
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: [
    User,
    Address,
    Category,
    Product,
    ProductImage,
    Order,
    OrderItem,
    Cart,
    CartItem,
    Payment,
    Coupon,
    Review,
  ],
  migrations: [], // Migrations are best handled via CLI
  subscribers: [],
});
