import { Product, InsertProduct, Order, InsertOrder } from "@shared/schema";

export interface IStorage {
  getAllProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private orders: Map<number, Order>;
  private orderId: number;

  constructor() {
    this.products = new Map();
    this.orders = new Map();
    this.orderId = 1;
    this.initializeProducts();
  }

  private initializeProducts() {
    const products: InsertProduct[] = [
      {
        name: "Crème noisette 700g",
        description: "Délicieuse pâte à tartiner aux noisettes, onctueuse et savoureuse.",
        price: "4.99",
        image: "image_25.webp"
      },
      {
        name: "Crème noisette 2,5kg",
        description: "Format familial pour les amateurs de noisette, idéal pour les gourmands.",
        price: "10.00",
        image: "image1.avif"
      },
      {
        name: "Crème noisette 600g avec chocolat",
        description: "Alliance parfaite entre noisette et chocolat pour un plaisir intense.",
        price: "3.99",
        image: "image2.jpg"
      },
      {
        name: "Crème noisette rocher 600g",
        description: "Une texture croquante et fondante, parfaite pour une touche gourmande.",
        price: "4.99",
        image: "image7.jpg"
      },
      {
        name: "Crème noisette rocher 600g avec chocolat",
        description: "Un mélange exquis de noisette et de chocolat avec un croquant irrésistible.",
        price: "3.99",
        image: "image30.avif"
      }
    ];

    products.forEach((product, index) => {
      this.products.set(index + 1, { ...product, id: index + 1 });
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const newOrder = { ...order, id: this.orderId++ };
    this.orders.set(newOrder.id, newOrder);
    return newOrder;
  }
}

export const storage = new MemStorage();
