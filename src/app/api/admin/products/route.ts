import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getDb } from "@/lib/db";
import { Product } from "@/database/entities/Product";
import { ProductImage } from "@/database/entities/ProductImage";
import { Category } from "@/database/entities/Category";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { images, ...productData } = body;

    const db = await getDb();
    const productRepo = db.getRepository(Product);
    const imageRepo = db.getRepository(ProductImage);
    const categoryRepo = db.getRepository(Category);

    // Find category
    const category = await categoryRepo.findOne({ where: { slug: productData.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    const product = productRepo.create({
      ...productData,
      categoryId: category.id,
      price: Number(productData.price),
      comparePrice: productData.comparePrice ? Number(productData.comparePrice) : null,
      weight: Number(productData.weight),
      stock: Number(productData.stock),
    });

    const savedProduct = await productRepo.save(product) as any;

    if (images && images.length > 0) {
      const imageEntities = images.map((url: string) => 
        imageRepo.create({
          url,
          productId: savedProduct.id,
        })
      );
      await imageRepo.save(imageEntities);
    }

    return NextResponse.json(savedProduct);

  } catch (error) {
    console.error("Admin Product Create Error:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
