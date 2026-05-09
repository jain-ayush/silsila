import "reflect-metadata";
import { NextResponse } from "next/server";
import { ProductService } from "@/database/services/ProductService";

export async function GET() {
  try {
    const categories = await ProductService.getAllCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}
