const { prisma } = require('../src/db');
const argon2 = require('argon2');

async function main() {
  console.log('Seeding database...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.adminUser.deleteMany();

  // Seed categories one by one to ensure correct IDs
  const clothing = await prisma.category.create({ data: { name: 'Clothing', description: 'Apparel and garments' } });
  const footwear = await prisma.category.create({ data: { name: 'Footwear', description: 'Shoes and sandals' } });
  const accessories = await prisma.category.create({ data: { name: 'Accessories', description: 'Fashion accessories' } });
  const electronics = await prisma.category.create({ data: { name: 'Electronics', description: 'Gadgets and devices' } });
  const bags = await prisma.category.create({ data: { name: 'Bags', description: 'Bags and luggage' } });

  console.log('Created 5 categories');

  // Seed products with correct category IDs
  const products = await Promise.all([
    prisma.product.create({
      data: {
        name: 'Classic White T-Shirt',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        categoryId: clothing.id,
        description: 'A comfortable everyday t-shirt made from 100% cotton. Perfect for casual outings and layering.',
        price: 499,
        stock: 50,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Denim Jacket',
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400',
        categoryId: clothing.id,
        description: 'Classic denim jacket with a modern fit. Features button closure and chest pockets.',
        price: 1299,
        stock: 25,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Running Shoes',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
        categoryId: footwear.id,
        description: 'Lightweight running shoes with responsive cushioning. Ideal for daily runs and workouts.',
        price: 2499,
        stock: 30,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Leather Wallet',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=400',
        categoryId: accessories.id,
        description: 'Genuine leather wallet with multiple card slots and bill compartment. Slim and durable.',
        price: 799,
        stock: 40,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Wireless Earbuds',
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400',
        categoryId: electronics.id,
        description: 'Bluetooth earbuds with noise cancellation and 8-hour battery life. Includes charging case.',
        price: 1599,
        stock: 15,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Smartwatch',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
        categoryId: electronics.id,
        description: 'Fitness tracker and smartwatch with heart rate monitor, GPS, and water resistance.',
        price: 3499,
        stock: 10,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Canvas Backpack',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400',
        categoryId: bags.id,
        description: 'Durable canvas backpack with laptop compartment. Great for school, work, or travel.',
        price: 999,
        stock: 20,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Sunglasses',
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
        categoryId: accessories.id,
        description: 'UV400 protection sunglasses with polarized lenses. Lightweight and stylish.',
        price: 699,
        stock: 35,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Sports Shorts',
        image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
        categoryId: clothing.id,
        description: 'Breathable sports shorts with quick-dry fabric. Perfect for gym and outdoor activities.',
        price: 399,
        stock: 0,
        status: 'Out_of_Stock'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Formal Shoes',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400',
        categoryId: footwear.id,
        description: 'Classic leather formal shoes. Comfortable for all-day wear at office or events.',
        price: 1899,
        stock: 8,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Phone Case',
        image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
        categoryId: electronics.id,
        description: 'Shock-absorbing phone case with slim profile. Available for most phone models.',
        price: 299,
        stock: 100,
        status: 'Active'
      }
    }),
    prisma.product.create({
      data: {
        name: 'Baseball Cap',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c334e67a?w=400',
        categoryId: accessories.id,
        description: 'Adjustable baseball cap with embroidered design. One size fits most.',
        price: 349,
        stock: 45,
        status: 'Inactive'
      }
    }),
  ]);
  console.log(`Created ${products.length} products`);

  // Get product IDs
  const productList = await prisma.product.findMany();
  const getProductId = (name) => productList.find(p => p.name === name)?.id;

  // Seed orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        id: 'ORD-001',
        customerName: 'Juan Dela Cruz',
        email: 'juan@email.com',
        phone: '09171234567',
        address: '123 Main St, Quezon City',
        subtotal: 1797,
        total: 1797,
        paymentMethod: 'Cash on Delivery',
        status: 'Completed',
        orderDate: new Date('2025-01-15'),
        items: {
          create: [
            { productId: getProductId('Classic White T-Shirt'), productName: 'Classic White T-Shirt', price: 499, quantity: 2 },
            { productId: getProductId('Leather Wallet'), productName: 'Leather Wallet', price: 799, quantity: 1 },
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        id: 'ORD-002',
        customerName: 'Maria Santos',
        email: 'maria@email.com',
        phone: '09181234567',
        address: '456 Rizal Ave, Manila',
        subtotal: 2499,
        total: 2499,
        paymentMethod: 'E-Wallet',
        status: 'Shipped',
        orderDate: new Date('2025-01-18'),
        notes: 'Please deliver in the morning',
        items: {
          create: [
            { productId: getProductId('Running Shoes'), productName: 'Running Shoes', price: 2499, quantity: 1 },
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        id: 'ORD-003',
        customerName: 'Pedro Reyes',
        email: 'pedro@email.com',
        phone: '09191234567',
        address: '789 Bonifacio St, Makati',
        subtotal: 2197,
        total: 2197,
        paymentMethod: 'Bank Transfer',
        status: 'Pending',
        orderDate: new Date('2025-01-20'),
        items: {
          create: [
            { productId: getProductId('Wireless Earbuds'), productName: 'Wireless Earbuds', price: 1599, quantity: 1 },
            { productId: getProductId('Phone Case'), productName: 'Phone Case', price: 299, quantity: 2 },
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        id: 'ORD-004',
        customerName: 'Ana Garcia',
        email: 'ana@email.com',
        phone: '09201234567',
        address: '321 Aguinaldo Hwy, Cavite',
        subtotal: 3499,
        total: 3499,
        paymentMethod: 'Cash on Delivery',
        status: 'Confirmed',
        orderDate: new Date('2025-01-21'),
        notes: 'Gift wrap please',
        items: {
          create: [
            { productId: getProductId('Smartwatch'), productName: 'Smartwatch', price: 3499, quantity: 1 },
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        id: 'ORD-005',
        customerName: 'Carlos Lopez',
        email: 'carlos@email.com',
        phone: '09211234567',
        address: '654 Mabini St, Pasig',
        subtotal: 2997,
        total: 2997,
        paymentMethod: 'E-Wallet',
        status: 'Preparing',
        orderDate: new Date('2025-01-22'),
        items: {
          create: [
            { productId: getProductId('Canvas Backpack'), productName: 'Canvas Backpack', price: 999, quantity: 1 },
            { productId: getProductId('Sunglasses'), productName: 'Sunglasses', price: 699, quantity: 1 },
            { productId: getProductId('Denim Jacket'), productName: 'Denim Jacket', price: 1299, quantity: 1 },
          ]
        }
      }
    }),
  ]);
  console.log(`Created ${orders.length} orders`);

  // Seed admin user
  const hashedPassword = await argon2.hash('admin123');
  const admin = await prisma.adminUser.create({
    data: {
      username: 'admin',
      password: hashedPassword
    }
  });
  console.log(`Created admin user: ${admin.username}`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
