import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { Product } from "@/database/entities/Product";

export async function GET(req: NextRequest) {
  try {
    const db = await getDb();
    const productRepo = db.getRepository(Product);

    const products = await productRepo.find({
      relations: ["images", "category"],
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://silsila.com";

    // Generate CSV for Meta Catalog
    // Headers: id, title, description, availability, condition, price, link, image_link, brand
    let csv = "id,title,description,availability,condition,price,link,image_link,brand,google_product_category,fb_product_category,quantity_to_sell_on_facebook,sale_price,item_group_id,gender,color,size,material\n";

    products.forEach((product) => {
      const id = product.id;
      const title = `"${product.title.replace(/"/g, '""')}"`;
      const description = `"${product.description.replace(/"/g, '""').substring(0, 5000)}"`;
      const availability = product.stock > 0 ? "in stock" : "out of stock";
      const condition = "new";
      const price = `${product.price} INR`;
      const link = `${baseUrl}/products/${product.slug}`;
      const image_link = product.images?.[0]?.url || "";
      const brand = "Silsila";
      
      csv += `${id},${title},${description},${availability},${condition},${price},${link},${image_link},${brand},"Apparel & Accessories > Jewelry",,,,,"female","silver",,,"silver"\n`;
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": 'attachment; filename="meta-catalog.csv"',
      },
    });
  } catch (error) {
    console.error("Meta Catalog Feed Error:", error);
    return NextResponse.json({ error: "Failed to generate feed" }, { status: 500 });
  }
}
