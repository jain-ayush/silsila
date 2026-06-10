import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getDb } from "@/lib/db";
import { Product } from "@/database/entities/Product";
import { ProductImage } from "@/database/entities/ProductImage";
import { Category } from "@/database/entities/Category";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const product = await db.getRepository(Product).findOne({
      where: { id: params.id },
      relations: ["images", "category"]
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Admin Product GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { images, categoryId, ...productData } = body;

    const db = await getDb();
    const productRepo = db.getRepository(Product);
    const imageRepo = db.getRepository(ProductImage);
    const categoryRepo = db.getRepository(Category);

    const product = await productRepo.findOne({ where: { id: params.id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Find category by slug (frontend sends slug)
    const category = await categoryRepo.findOne({ where: { slug: categoryId } });
    
    // Update product fields
    Object.assign(product, {
      ...productData,
      categoryId: category ? category.id : product.categoryId,
      price: Number(productData.price),
      comparePrice: productData.comparePrice ? Number(productData.comparePrice) : null,
      weight: Number(productData.weight),
      stock: Number(productData.stock),
    });

    await productRepo.save(product);

    // Update images
    if (images) {
      // Remove old images
      await imageRepo.delete({ productId: product.id });
      
      // Add new images
      const imageEntities = images.map((url: string) => 
        imageRepo.create({
          url,
          productId: product.id,
        })
      );
      await imageRepo.save(imageEntities);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Product Update Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const productRepo = db.getRepository(Product);
    const imageRepo = db.getRepository(ProductImage);

    // Images will be orphaned if not deleted (assuming no cascade)
    await imageRepo.delete({ productId: params.id });
    const result = await productRepo.delete(params.id);

    if (result.affected === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Product DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
