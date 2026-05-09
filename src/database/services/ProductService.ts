import { getDb } from "@/lib/db";
import { Product } from "@/database/entities/Product";
import { Category } from "@/database/entities/Category";

export class ProductService {
  static async getAllProducts(filters: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: "price_asc" | "price_desc" | "newest";
    page?: number;
    limit?: number;
  } = {}) {
    const db = await getDb();
    const productRepo = db.getRepository(Product);

    const query = productRepo.createQueryBuilder("product")
      .leftJoinAndSelect("product.images", "images")
      .leftJoinAndSelect("product.category", "category");

    if (filters.category) {
      query.andWhere("category.slug = :category", { category: filters.category });
    }

    if (filters.search) {
      query.andWhere("(product.title LIKE :search OR product.description LIKE :search)", { 
        search: `%${filters.search}%` 
      });
    }

    if (filters.minPrice) {
      query.andWhere("product.price >= :minPrice", { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      query.andWhere("product.price <= :maxPrice", { maxPrice: filters.maxPrice });
    }

    // Sorting
    switch (filters.sort) {
      case "price_asc":
        query.orderBy("product.price", "ASC");
        break;
      case "price_desc":
        query.orderBy("product.price", "DESC");
        break;
      case "newest":
      default:
        query.orderBy("product.createdAt", "DESC");
        break;
    }

    // Pagination
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    query.skip((page - 1) * limit).take(limit);

    const [products, total] = await query.getManyAndCount();

    return {
      products,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getProductBySlug(slug: string) {
    const db = await getDb();
    const productRepo = db.getRepository(Product);

    return await productRepo.findOne({
      where: { slug },
      relations: ["images", "category", "reviews", "reviews.user"]
    });
  }

  static async getFeaturedProducts() {
    const db = await getDb();
    const productRepo = db.getRepository(Product);

    return await productRepo.find({
      where: { featured: true },
      relations: ["images", "category"],
      take: 8
    });
  }

  static async getAllCategories() {
    const db = await getDb();
    const categoryRepo = db.getRepository(Category);

    return await categoryRepo.find();
  }

  static async getProductsByIds(ids: string[]) {
    const db = await getDb();
    const productRepo = db.getRepository(Product);

    return await productRepo.createQueryBuilder("product")
      .leftJoinAndSelect("product.images", "images")
      .leftJoinAndSelect("product.category", "category")
      .where("product.id IN (:...ids)", { ids })
      .getMany();
  }
}
