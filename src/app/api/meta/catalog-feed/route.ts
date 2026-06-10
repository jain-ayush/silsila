import "reflect-metadata";
import { NextRequest, NextResponse } from "next/server";
import { ProductService } from "@/database/services/ProductService";

export async function GET(req: NextRequest) {
  try {
    const { products } = await ProductService.getAllProducts({ limit: 500 });
    const baseUrl = process.env.NEXTAUTH_URL || `https://${req.headers.get("host")}`;

    const xmlItems = products.map((product: any) => `
    <item>
      <g:id>${product.id}</g:id>
      <g:title><![CDATA[${product.title}]]></g:title>
      <g:description><![CDATA[${product.description}]]></g:description>
      <g:link>${baseUrl}/products/${product.slug}</g:link>
      <g:image_link>${product.images?.[0]?.url || ""}</g:image_link>
      <g:brand>Silsila</g:brand>
      <g:condition>new</g:condition>
      <g:availability>${product.stock > 0 ? "in stock" : "out of stock"}</g:availability>
      <g:price>${product.price} INR</g:price>
      <g:google_product_category>Apparel &amp; Accessories &gt; Jewelry</g:google_product_category>
      <g:product_type><![CDATA[${product.category?.name || "Jewelry"}]]></g:product_type>
      <g:sku>${product.sku}</g:sku>
      <g:material>Silver</g:material>
    </item>`).join("");

    const xmlFeed = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Silsila Silver Jewellery</title>
    <link>${baseUrl}</link>
    <description>Premium handcrafted silver jewellery for the modern woman.</description>
    ${xmlItems}
  </channel>
</rss>`;

    return new NextResponse(xmlFeed, {
      headers: {
        "Content-Type": "application/xml",
      },
    });

  } catch (error) {
    console.error("Meta Catalog Feed Error:", error);
    return NextResponse.json({ error: "Failed to generate feed" }, { status: 500 });
  }
}
