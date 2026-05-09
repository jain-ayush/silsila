import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/database/services/ProductService";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await ProductService.getProductBySlug(slug);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[slug] error:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}
