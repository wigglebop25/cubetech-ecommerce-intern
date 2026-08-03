const { prisma } = require('../src/db');
const argon2 = require('argon2');
const { getProductImages } = require('../src/services/imageService');
require('dotenv').config();

async function main() {
  console.log('Seeding database...');

  // Clear existing data (order matters for foreign keys)
  await prisma.orderStatusHistory.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.adminUser.deleteMany();

  // Seed categories one by one to ensure correct IDs
  const clothing = await prisma.category.create({ data: { name: 'Clothing', description: 'Apparel and garments' } });
  const footwear = await prisma.category.create({ data: { name: 'Footwear', description: 'Shoes and sandals' } });
  const accessories = await prisma.category.create({ data: { name: 'Accessories', description: 'Fashion accessories' } });
  const electronics = await prisma.category.create({ data: { name: 'Electronics', description: 'Gadgets and devices' } });
  const bags = await prisma.category.create({ data: { name: 'Bags', description: 'Bags and luggage' } });

  console.log('Created 5 categories');

  // Define product data
  const productData = [
    { name: 'Classic White T-Shirt', category: clothing, description: 'A comfortable everyday t-shirt made from 100% cotton. Perfect for casual outings and layering.', price: 499, stock: 50, status: 'Active' },
    { name: 'Denim Jacket', category: clothing, description: 'Classic denim jacket with a modern fit. Features button closure and chest pockets.', price: 1299, stock: 25, status: 'Active' },
    { name: 'Running Shoes', category: footwear, description: 'Lightweight running shoes with responsive cushioning. Ideal for daily runs and workouts.', price: 2499, stock: 30, status: 'Active' },
    { name: 'Leather Wallet', category: accessories, description: 'Genuine leather wallet with multiple card slots and bill compartment. Slim and durable.', price: 799, stock: 40, status: 'Active' },
    { name: 'Wireless Earbuds', category: electronics, description: 'Bluetooth earbuds with noise cancellation and 8-hour battery life. Includes charging case.', price: 1599, stock: 15, status: 'Active' },
    { name: 'Smartwatch', category: electronics, description: 'Fitness tracker and smartwatch with heart rate monitor, GPS, and water resistance.', price: 3499, stock: 10, status: 'Active' },
    { name: 'Canvas Backpack', category: bags, description: 'Durable canvas backpack with laptop compartment. Great for school, work, or travel.', price: 999, stock: 20, status: 'Active' },
    { name: 'Sunglasses', category: accessories, description: 'UV400 protection sunglasses with polarized lenses. Lightweight and stylish.', price: 699, stock: 35, status: 'Active' },
    { name: 'Sports Shorts', category: clothing, description: 'Breathable sports shorts with quick-dry fabric. Perfect for gym and outdoor activities.', price: 399, stock: 0, status: 'Out_of_Stock' },
    { name: 'Formal Shoes', category: footwear, description: 'Classic leather formal shoes. Comfortable for all-day wear at office or events.', price: 1899, stock: 8, status: 'Active' },
    { name: 'Phone Case', category: electronics, description: 'Shock-absorbing phone case with slim profile. Available for most phone models.', price: 299, stock: 100, status: 'Active' },
    { name: 'Baseball Cap', category: accessories, description: 'Adjustable baseball cap with embroidered design. One size fits most.', price: 349, stock: 45, status: 'Inactive' },
    // Additional products
    { name: 'Polo Shirt', category: clothing, description: 'Classic polo shirt with collar and button placket. Perfect for smart casual occasions.', price: 599, stock: 40, status: 'Active' },
    { name: 'Cargo Pants', category: clothing, description: 'Comfortable cargo pants with multiple pockets. Great for outdoor activities.', price: 899, stock: 30, status: 'Active' },
    { name: 'Hoodie', category: clothing, description: 'Warm and cozy hoodie with kangaroo pocket. Perfect for casual wear.', price: 1099, stock: 20, status: 'Active' },
    { name: 'Linen Shirt', category: clothing, description: 'Breathable linen shirt for summer. Lightweight and comfortable.', price: 799, stock: 25, status: 'Active' },
    { name: 'Jogger Pants', category: clothing, description: 'Elastic waist jogger pants with tapered fit. Ideal for workouts and casual wear.', price: 699, stock: 35, status: 'Active' },
    { name: 'Winter Jacket', category: clothing, description: 'Insulated winter jacket with hood. Keeps you warm in cold weather.', price: 2199, stock: 12, status: 'Active' },
    { name: 'Graphic T-Shirt', category: clothing, description: 'Cotton t-shirt with unique graphic print. Express your style.', price: 549, stock: 0, status: 'Out_of_Stock' },
    { name: 'Running Socks', category: clothing, description: 'Moisture-wicking running socks with cushioned sole. Pack of 3 pairs.', price: 149, stock: 200, status: 'Active' },
    { name: 'Sneakers', category: footwear, description: 'Casual sneakers with comfortable sole. Perfect for everyday wear.', price: 1899, stock: 25, status: 'Active' },
    { name: 'Sandals', category: footwear, description: 'Comfortable sandals with adjustable straps. Great for summer.', price: 599, stock: 40, status: 'Active' },
    { name: 'Boots', category: footwear, description: 'Sturdy leather boots for outdoor adventures. Waterproof and durable.', price: 2299, stock: 15, status: 'Active' },
    { name: 'Loafers', category: footwear, description: 'Classic leather loafers for formal occasions. Comfortable and stylish.', price: 1599, stock: 20, status: 'Active' },
    { name: 'Slippers', category: footwear, description: 'Soft and comfortable slippers for home use. Non-slip sole.', price: 299, stock: 60, status: 'Active' },
    { name: 'Leather Belt', category: accessories, description: 'Genuine leather belt with classic buckle. Available in multiple sizes.', price: 499, stock: 50, status: 'Active' },
    { name: 'Watch', category: accessories, description: 'Elegant analog watch with leather strap. Water resistant.', price: 2999, stock: 12, status: 'Active' },
    { name: 'Necklace', category: accessories, description: 'Sterling silver necklace with pendant. Perfect for gifting.', price: 1299, stock: 18, status: 'Active' },
    { name: 'Bracelet', category: accessories, description: 'Stainless steel bracelet with adjustable clasp. Unisex design.', price: 699, stock: 30, status: 'Active' },
    { name: 'Ring', category: accessories, description: 'Titanium ring with brushed finish. Available in multiple sizes.', price: 899, stock: 25, status: 'Active' },
    { name: 'Sunglasses Case', category: accessories, description: 'Hard shell sunglasses case with soft interior. Protects your sunglasses.', price: 199, stock: 50, status: 'Inactive' },
    { name: 'Tie', category: accessories, description: 'Silk tie with classic pattern. Perfect for business and formal occasions.', price: 399, stock: 35, status: 'Active' },
    { name: 'Bluetooth Speaker', category: electronics, description: 'Portable Bluetooth speaker with 10-hour battery life. Waterproof design.', price: 1999, stock: 20, status: 'Active' },
    { name: 'Power Bank', category: electronics, description: '10000mAh power bank with fast charging. Dual USB ports.', price: 899, stock: 45, status: 'Active' },
    { name: 'USB Cable', category: electronics, description: 'USB-C to USB-A cable for charging and data transfer. 1.5m length.', price: 199, stock: 100, status: 'Active' },
    { name: 'Laptop Stand', category: electronics, description: 'Adjustable aluminum laptop stand. Ergonomic design for better posture.', price: 1499, stock: 15, status: 'Active' },
    { name: 'Mouse Pad', category: electronics, description: 'Large mouse pad with smooth surface. Non-slip rubber base.', price: 249, stock: 80, status: 'Active' },
    { name: 'Phone Holder', category: electronics, description: 'Adjustable phone holder for desk. Compatible with all phone sizes.', price: 399, stock: 30, status: 'Active' },
    { name: 'Laptop Sleeve', category: bags, description: 'Padded laptop sleeve for 15-inch laptops. Water-resistant material.', price: 799, stock: 25, status: 'Active' },
    { name: 'Tote Bag', category: bags, description: 'Canvas tote bag for shopping and everyday use. Eco-friendly material.', price: 599, stock: 30, status: 'Active' },
    { name: 'Travel Bag', category: bags, description: 'Spacious travel bag with multiple compartments. Perfect for weekend trips.', price: 1999, stock: 10, status: 'Active' },
    { name: 'Sling Bag', category: bags, description: 'Compact sling bag for essentials. Adjustable strap for comfort.', price: 699, stock: 35, status: 'Active' },
    { name: 'Duffel Bag', category: bags, description: 'Large duffel bag for gym and sports. Water-resistant bottom.', price: 1299, stock: 15, status: 'Active' },
  ];

  // Fetch images from Pixabay
  console.log('Fetching product images from Pixabay...');
  const productNames = productData.map(p => p.name);
  const images = await getProductImages(productNames);
  console.log(`Fetched ${Object.keys(images).length} images`);

  // Create products with fetched images
  const products = await Promise.all(
    productData.map(product =>
      prisma.product.create({
        data: {
          name: product.name,
          image: images[product.name] || `https://via.placeholder.com/400x400/f0f0f0/333?text=${encodeURIComponent(product.name)}`,
          categoryId: product.category.id,
          description: product.description,
          price: product.price,
          stock: product.stock,
          status: product.status
        }
      })
    )
  );

  console.log(`Created ${products.length} products`);

  // Seed orders
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        id: 'ORD-001',
        customerName: 'Juan Dela Cruz',
        email: 'juan@test.com',
        phone: '09171234567',
        address: '123 Main St, Quezon City',
        subtotal: 1797,
        tax: 215.64,
        shippingCost: 0,
        total: 2012.64,
        paymentMethod: 'Cash on Delivery',
        status: 'Completed',
        orderDate: new Date('2025-01-15'),
        items: {
          create: [
            { productId: products[0].id, productName: 'Classic White T-Shirt', price: 499, quantity: 2 },
            { productId: products[3].id, productName: 'Leather Wallet', price: 799, quantity: 1 },
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        id: 'ORD-002',
        customerName: 'Maria Santos',
        email: 'maria@test.com',
        phone: '09181234567',
        address: '456 Rizal Ave, Manila',
        subtotal: 2499,
        tax: 299.88,
        shippingCost: 0,
        total: 2798.88,
        paymentMethod: 'E-Wallet',
        status: 'Shipped',
        orderDate: new Date('2025-01-18'),
        notes: 'Please deliver in the morning',
        items: {
          create: [
            { productId: products[2].id, productName: 'Running Shoes', price: 2499, quantity: 1 },
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        id: 'ORD-003',
        customerName: 'Pedro Reyes',
        email: 'pedro@test.com',
        phone: '09191234567',
        address: '789 Bonifacio St, Makati',
        subtotal: 2197,
        tax: 263.64,
        shippingCost: 0,
        total: 2460.64,
        paymentMethod: 'Bank Transfer',
        status: 'Pending',
        orderDate: new Date('2025-01-20'),
        items: {
          create: [
            { productId: products[4].id, productName: 'Wireless Earbuds', price: 1599, quantity: 1 },
            { productId: products[10].id, productName: 'Phone Case', price: 299, quantity: 2 },
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        id: 'ORD-004',
        customerName: 'Ana Garcia',
        email: 'ana@test.com',
        phone: '09201234567',
        address: '321 Aguinaldo Hwy, Cavite',
        subtotal: 3499,
        tax: 419.88,
        shippingCost: 0,
        total: 3918.88,
        paymentMethod: 'Cash on Delivery',
        status: 'Confirmed',
        orderDate: new Date('2025-01-21'),
        notes: 'Gift wrap please',
        items: {
          create: [
            { productId: products[5].id, productName: 'Smartwatch', price: 3499, quantity: 1 },
          ]
        }
      }
    }),
    prisma.order.create({
      data: {
        id: 'ORD-005',
        customerName: 'Carlos Lopez',
        email: 'carlos@test.com',
        phone: '09211234567',
        address: '654 Mabini St, Pasig',
        subtotal: 2997,
        tax: 359.64,
        shippingCost: 0,
        total: 3356.64,
        paymentMethod: 'E-Wallet',
        status: 'Preparing',
        orderDate: new Date('2025-01-22'),
        items: {
          create: [
            { productId: products[6].id, productName: 'Canvas Backpack', price: 999, quantity: 1 },
            { productId: products[7].id, productName: 'Sunglasses', price: 699, quantity: 1 },
            { productId: products[1].id, productName: 'Denim Jacket', price: 1299, quantity: 1 },
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
      password: hashedPassword,
      role: 'admin'
    }
  });
  console.log(`Created admin user: ${admin.username}`);

  // Seed sample discounts
  const discounts = await Promise.all([
    prisma.discount.create({
      data: {
        code: 'WELCOME10',
        type: 'percentage',
        value: 10,
        minOrder: 500,
        maxUses: 100,
        isActive: true
      }
    }),
    prisma.discount.create({
      data: {
        code: 'FLAT50',
        type: 'fixed',
        value: 50,
        minOrder: 200,
        maxUses: 50,
        isActive: true
      }
    }),
  ]);
  console.log(`Created ${discounts.length} discount codes`);

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
