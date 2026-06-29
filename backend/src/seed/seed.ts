import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../app.module';
import { User } from '../users/schemas/user.schema';
import { Product } from '../products/schemas/product.schema';
import { Cart } from '../cart/schemas/cart.schema';
import { Order } from '../orders/schemas/order.schema';
import { Role } from '../common/roles';

const img = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&h=800&fit=crop&crop=entropy&q=80&auto=format`;

const PRODUCTS = [
  { name: 'Silk slip midi dress', category: 'Dresses', price: 189, stock: 6, photo: '1539008835657-9e8e9680c956', description: 'Cut from washed silk with a bias drape and adjustable straps. A fluid, understated piece that moves between day and evening.' },
  { name: 'Wool overcoat', category: 'Outerwear', price: 320, stock: 12, photo: '1539109136881-3be0616acf4b', description: 'A double-faced wool coat with a relaxed shoulder and tonal horn buttons. Fully lined, made to layer.' },
  { name: 'Cashmere crew', category: 'Knitwear', price: 132, stock: 3, photo: '1434389677669-e08b4cac3105', description: 'Pure grade-A cashmere knitted to a fine gauge, with ribbed trims and a clean crew neck.' },
  { name: 'Pleated wide-leg trouser', category: 'Trousers', price: 148, stock: 0, photo: '1542295669297-4d352b042bca', description: 'High-rise pleated trousers in a fluid crepe, falling to a generous wide leg.' },
  { name: 'Satin wrap gown', category: 'Dresses', price: 245, stock: 18, photo: '1515372039744-b8f02a3ae446', description: 'A floor-length satin gown with a true wrap front and a softly gathered waist.' },
  { name: 'Leather tote', category: 'Accessories', price: 210, stock: 9, photo: '1591047139829-d91aecb6caea', description: 'Structured vegetable-tanned leather tote with a suede-lined interior and magnetic close.' },
  { name: 'Ribbed turtleneck', category: 'Knitwear', price: 98, stock: 22, photo: '1485462537746-965f33f7f6a7', description: 'A slim merino turtleneck with a high fold-over neck and a body-skimming rib.' },
  { name: 'Belted trench', category: 'Outerwear', price: 298, stock: 14, photo: '1521577352947-9bb58764b69a', description: 'A water-resistant cotton-gabardine trench with storm flap, epaulettes and a self belt.' },
  { name: 'Tailored blazer', category: 'Outerwear', price: 265, stock: 7, photo: '1495385794356-15371f348c31', description: 'A single-breasted blazer with a softly constructed shoulder and a nipped waist.' },
  { name: 'Crepe slip dress', category: 'Dresses', price: 172, stock: 11, photo: '1581044777550-4cfa60707c03', description: 'A minimal bias-cut slip in matte crepe, with delicate straps and a cowl back.' },
];

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const productModel = app.get<Model<Product>>(getModelToken(Product.name));
  const cartModel = app.get<Model<Cart>>(getModelToken(Cart.name));
  const orderModel = app.get<Model<Order>>(getModelToken(Order.name));

  // Reset for a deterministic clean slate.
  await Promise.all([
    userModel.deleteMany({}),
    productModel.deleteMany({}),
    cartModel.deleteMany({}),
    orderModel.deleteMany({}),
  ]);

  await userModel.create({
    email: 'admin@maison.com',
    passwordHash: await bcrypt.hash('Admin123!', 10),
    firstName: 'Amélie',
    lastName: 'Laurent',
    role: Role.Admin,
  });
  await userModel.create({
    email: 'elise.moreau@gmail.com',
    passwordHash: await bcrypt.hash('Customer123!', 10),
    firstName: 'Elise',
    lastName: 'Moreau',
    role: Role.Customer,
  });

  await productModel.insertMany(
    PRODUCTS.map((p) => ({
      name: p.name,
      description: p.description,
      price: p.price,
      category: p.category,
      stock: p.stock,
      image: img(p.photo),
    })),
  );

  console.log('✓ Seed complete');
  console.log('  Admin    : admin@maison.com / Admin123!');
  console.log('  Customer : elise.moreau@gmail.com / Customer123!');
  console.log(`  Products : ${PRODUCTS.length} across 5 categories (1 sold out, 1 low stock)`);

  await app.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
