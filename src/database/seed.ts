import { AppDataSource } from "./datasource/index";
import { Category } from "./entities/Category";
import { Product } from "./entities/Product";
import { ProductImage } from "./entities/ProductImage";

const seed = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");

    const categoryRepo = AppDataSource.getRepository(Category);
    const productRepo = AppDataSource.getRepository(Product);
    const imageRepo = AppDataSource.getRepository(ProductImage);

    // Clear existing data (using QueryBuilder for safety)
    await imageRepo.createQueryBuilder().delete().execute();
    await productRepo.createQueryBuilder().delete().execute();
    await categoryRepo.createQueryBuilder().delete().execute();

    // Create Categories
    const categoriesData = [
      { name: "Rings", slug: "rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000" },
      { name: "Necklaces", slug: "necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000" },
      { name: "Earrings", slug: "earrings", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000" },
      { name: "Bracelets", slug: "bracelets", image: "https://images.unsplash.com/photo-1611591437281-460bfbe157a8?auto=format&fit=crop&q=80&w=1000" },
    ];

    const savedCategories = await categoryRepo.save(categoriesData);
    console.log("Categories seeded!");

    // Helper to find category ID
    const getCatId = (slug: string) => savedCategories.find(c => c.slug === slug)!.id;

    // Expand Products Data
    const productsData = [
      // RINGS
      {
        title: "Eternal Silver Band",
        slug: "eternal-silver-band",
        description: "A classic sterling silver band, perfect for every occasion. Hand-polished to a brilliant shine.",
        price: 1299, comparePrice: 1999, stock: 50, sku: "RING-001", purity: "925 Sterling Silver", weight: 3.5,
        categoryId: getCatId("rings"), featured: true,
        images: ["https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000"]
      },
      {
        title: "Diamond Solitaire Ring",
        slug: "diamond-solitaire-ring",
        description: "Exquisite silver ring featuring a high-clarity lab-grown diamond. A symbol of everlasting love.",
        price: 8999, comparePrice: 12000, stock: 10, sku: "RING-002", purity: "925 Sterling Silver", weight: 4.2,
        categoryId: getCatId("rings"), featured: true,
        images: ["https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&q=80&w=1000"]
      },
      {
        title: "Vintage Opal Ring",
        slug: "vintage-opal-ring",
        description: "Inspired by Victorian designs, this ring holds a mesmerizing opal gemstone.",
        price: 3499, comparePrice: 4500, stock: 15, sku: "RING-003", purity: "925 Sterling Silver", weight: 3.8,
        categoryId: getCatId("rings"), featured: false,
        images: ["https://images.unsplash.com/photo-1602173574767-37ac01994b2a?auto=format&fit=crop&q=80&w=1000"]
      },

      // NECKLACES
      {
        title: "Celestial Moon Necklace",
        slug: "celestial-moon-necklace",
        description: "Capture the magic of the night sky with this delicate moon pendant.",
        price: 2499, comparePrice: 3499, stock: 30, sku: "NECK-001", purity: "925 Sterling Silver", weight: 5.2,
        categoryId: getCatId("necklaces"), featured: true,
        images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000"]
      },
      {
        title: "Pearl Elegance Drop",
        slug: "pearl-elegance-drop",
        description: "Hand-selected freshwater pearl on a shimmering silver chain.",
        price: 4299, comparePrice: 5500, stock: 12, sku: "NECK-002", purity: "925 Sterling Silver", weight: 6.0,
        categoryId: getCatId("necklaces"), featured: false,
        images: ["https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?auto=format&fit=crop&q=80&w=1000"]
      },
      {
        title: "Minimalist Heart Locket",
        slug: "minimalist-heart-locket",
        description: "Keep your memories close with this sleek, polished silver locket.",
        price: 1899, comparePrice: 2400, stock: 40, sku: "NECK-003", purity: "925 Sterling Silver", weight: 4.5,
        categoryId: getCatId("necklaces"), featured: true,
        images: ["https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?auto=format&fit=crop&q=80&w=1000"]
      },

      // EARRINGS
      {
        title: "Art Deco Drop Earrings",
        slug: "art-deco-drop-earrings",
        description: "Elegant drop earrings inspired by the 1920s Art Deco movement.",
        price: 1899, comparePrice: 2499, stock: 25, sku: "EAR-001", purity: "925 Sterling Silver", weight: 4.8,
        categoryId: getCatId("earrings"), featured: false,
        images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000"]
      },
      {
        title: "Classic Silver Hoops",
        slug: "classic-silver-hoops",
        description: "Essential medium-sized hoops that go with everything.",
        price: 999, comparePrice: 1500, stock: 100, sku: "EAR-002", purity: "925 Sterling Silver", weight: 3.2,
        categoryId: getCatId("earrings"), featured: true,
        images: ["https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=1000"]
      },
      {
        title: "Emerald Studs",
        slug: "emerald-studs",
        description: "Vibrant emerald green zirconias set in high-polish silver.",
        price: 2199, comparePrice: 3000, stock: 20, sku: "EAR-003", purity: "925 Sterling Silver", weight: 2.8,
        categoryId: getCatId("earrings"), featured: true,
        images: ["https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&q=80&w=1000"]
      },

      // BRACELETS
      {
        title: "Minimalist Cuff Bracelet",
        slug: "minimalist-cuff-bracelet",
        description: "Sleek and modern, this adjustable cuff is a staple for any jewellery box.",
        price: 3299, comparePrice: 4500, stock: 15, sku: "BRAC-001", purity: "925 Sterling Silver", weight: 12.0,
        categoryId: getCatId("bracelets"), featured: true,
        images: ["https://images.unsplash.com/photo-1611591437281-460bfbe157a8?auto=format&fit=crop&q=80&w=1000"]
      },
      {
        title: "Braided Silver Chain",
        slug: "braided-silver-chain",
        description: "Intricately woven silver strands form this masculine yet elegant bracelet.",
        price: 5499, comparePrice: 7000, stock: 8, sku: "BRAC-002", purity: "925 Sterling Silver", weight: 18.5,
        categoryId: getCatId("bracelets"), featured: false,
        images: ["https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1000"]
      },
      {
        title: "Crystal Tennis Bracelet",
        slug: "crystal-tennis-bracelet",
        description: "A continuous line of sparkling crystals set in sterling silver.",
        price: 3899, comparePrice: 5200, stock: 20, sku: "BRAC-003", purity: "925 Sterling Silver", weight: 10.5,
        categoryId: getCatId("bracelets"), featured: true,
        images: ["https://images.unsplash.com/photo-1611085583191-a3b1a30a5af4?auto=format&fit=crop&q=80&w=1000"]
      }
    ];

    for (const p of productsData) {
      const { images, ...productInfo } = p;
      const product = await productRepo.save(productInfo);
      
      const imageEntities = images.map(url => ({
        url,
        productId: product.id
      }));
      await imageRepo.save(imageEntities);
    }

    console.log("Database seeded with expanded collection and verified images!");
    await AppDataSource.destroy();
  } catch (error) {
    console.error("Error during seeding:", error);
  }
};

seed();
