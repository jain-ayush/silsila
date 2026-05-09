import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { getDb } from "@/lib/db";
import { Product } from "@/database/entities/Product";
import { ProductImage } from "@/database/entities/ProductImage";
import { Category } from "@/database/entities/Category";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDb();
    const productRepo = db.getRepository(Product);
    const imageRepo = db.getRepository(ProductImage);

    // Delete related images first
    await imageRepo.delete({ productId: id });
    
    // Delete product
    const result = await productRepo.delete(id);

    if (result.affected === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Product deleted successfully" });

  } catch (error) {
    console.error("Admin Product Delete Error:", error);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { images, ...productData } = body;

    const db = await getDb();
    const productRepo = db.getRepository(Product);
    const imageRepo = db.getRepository(ProductImage);

    const product = await productRepo.findOne({ where: { id } });
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const categoryRepo = db.getRepository(Category);
    const category = await categoryRepo.findOne({ where: { slug: productData.categoryId } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 400 });
    }

    // Update basic info
    Object.assign(product, {
      ...productData,
      categoryId: category.id,
      price: Number(productData.price),
      comparePrice: productData.comparePrice ? Number(productData.comparePrice) : null,
      weight: Number(productData.weight),
      stock: Number(productData.stock),
    });

    await productRepo.save(product) as any;

    // Update images if provided
    if (images) {
      // For simplicity, replace all images
      await imageRepo.delete({ productId: id });
      const imageEntities = images.map((url: string) => 
        imageRepo.create({
          url,
          productId: id,
        })
      );
      await imageRepo.save(imageEntities);
    }

    return NextResponse.json({ success: true, product });

  } catch (error) {
    console.error("Admin Product Update Error:", error);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const db = await getDb();
    const productRepo = db.getRepository(Product);

    const product = await productRepo.findOne({
      where: { id },
      relations: ["images", "category"]
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);

  } catch (error) {
    console.error("Admin Product Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
