import { MetadataRoute } from 'next';
import { ProductService } from '@/database/services/ProductService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || 'https://silsila.com';

  // Fetch all products
  let products: any[] = [];
  try {
    const data = await ProductService.getAllProducts({ limit: 1000 });
    products = data.products;
  } catch (e) {
    console.error("Sitemap Products Error:", e);
  }

  // Fetch all categories
  let categories: any[] = [];
  try {
    categories = await ProductService.getAllCategories();
  } catch (e) {
    console.error("Sitemap Categories Error:", e);
  }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${baseUrl}/shop?category=${category.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...categoryUrls,
    ...productUrls,
  ];
}
