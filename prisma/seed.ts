import { PrismaClient, Role, OrderStatus, InvoiceStatus, Priority } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const clientPassword = await bcrypt.hash('Client@123', 12);

  // 1. Seed Users
  const ceo = await prisma.user.upsert({
    where: { email: 'john@postprodpro.com' },
    update: {},
    create: {
      email: 'john@postprodpro.com',
      password: adminPassword,
      firstName: 'John',
      lastName: 'Smith',
      role: Role.CEO,
      company: 'PostProd Pro HQ',
      phone: '+1 (555) 019-2831',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'sarah@postprodpro.com' },
    update: {},
    create: {
      email: 'sarah@postprodpro.com',
      password: adminPassword,
      firstName: 'Sarah',
      lastName: 'Johnson',
      role: Role.PROJECT_MANAGER,
      company: 'PostProd Pro Studio',
      phone: '+1 (555) 019-2832',
    },
  });

  const editor1 = await prisma.user.upsert({
    where: { email: 'mike@postprodpro.com' },
    update: {},
    create: {
      email: 'mike@postprodpro.com',
      password: adminPassword,
      firstName: 'Mike',
      lastName: 'Chen',
      role: Role.EDITOR,
      phone: '+1 (555) 019-2833',
    },
  });

  const editor2 = await prisma.user.upsert({
    where: { email: 'lisa@postprodpro.com' },
    update: {},
    create: {
      email: 'lisa@postprodpro.com',
      password: adminPassword,
      firstName: 'Lisa',
      lastName: 'Wong',
      role: Role.EDITOR,
      phone: '+1 (555) 019-2834',
    },
  });

  const accountant = await prisma.user.upsert({
    where: { email: 'tom@postprodpro.com' },
    update: {},
    create: {
      email: 'tom@postprodpro.com',
      password: adminPassword,
      firstName: 'Tom',
      lastName: 'Davis',
      role: Role.ACCOUNTANT,
      phone: '+1 (555) 019-2835',
    },
  });

  const sales = await prisma.user.upsert({
    where: { email: 'emma@postprodpro.com' },
    update: {},
    create: {
      email: 'emma@postprodpro.com',
      password: adminPassword,
      firstName: 'Emma',
      lastName: 'Wilson',
      role: Role.SALES,
      phone: '+1 (555) 019-2836',
    },
  });

  const client1 = await prisma.user.upsert({
    where: { email: 'bob@client.com' },
    update: {},
    create: {
      email: 'bob@client.com',
      password: clientPassword,
      firstName: 'Bob',
      lastName: 'Martinez',
      role: Role.CLIENT,
      company: 'Martinez Media',
      phone: '+1 (555) 019-9901',
    },
  });

  const client2 = await prisma.user.upsert({
    where: { email: 'alice@client.com' },
    update: {},
    create: {
      email: 'alice@client.com',
      password: clientPassword,
      firstName: 'Alice',
      lastName: 'Cooper',
      role: Role.CLIENT,
      company: 'Cooper Creations',
      phone: '+1 (555) 019-9902',
    },
  });

  console.log('Created Users:', { ceo: ceo.email, client1: client1.email });

  // 2. Seed Services Catalog
  const services = [
    { name: 'Basic Photo Editing', description: 'Color correction, exposure adjustment, cropping.', basePrice: 0.50, category: 'Photo' },
    { name: 'Advanced Retouching', description: 'Skin smoothing, stray hair removal, detail enhancement.', basePrice: 2.00, category: 'Photo' },
    { name: 'Background Removal', description: 'Clipping paths, clean background removal or swap.', basePrice: 1.50, category: 'Photo' },
    { name: 'Video Editing (Basic)', description: 'Timeline cut, transition effects, title overlays.', basePrice: 50.00, category: 'Video' },
    { name: 'Color Grading', description: 'Cinematic look creation, LUT application, shot matching.', basePrice: 75.00, category: 'Video' },
    { name: 'Real Estate Editing', description: 'HDR blending, sky replacement, window pull.', basePrice: 3.00, category: 'Real Estate' },
    { name: 'Wedding Package', description: 'Full event edit: highlights video + 200 retouched photos.', basePrice: 500.00, category: 'Package' },
  ];

  for (const s of services) {
    await prisma.serviceCatalog.create({
      data: s,
    });
  }

  // 3. Seed Sample Orders
  const orderData = [
    {
      orderNumber: 'ORD-2024-001',
      clientId: client1.id,
      assignedToId: editor1.id,
      managerId: manager.id,
      projectName: 'Summer Fashion Catalog 2024',
      serviceType: 'Advanced Retouching',
      description: 'High-end beauty retouching for 50 catalog images.',
      status: OrderStatus.IN_PROGRESS,
      priority: Priority.HIGH,
      totalAmount: 100.00,
      paidAmount: 100.00,
      deadline: new Date(Date.now() + 86400000 * 2),
    },
    {
      orderNumber: 'ORD-2024-002',
      clientId: client1.id,
      assignedToId: editor2.id,
      managerId: manager.id,
      projectName: 'Luxury Villa Real Estate Photos',
      serviceType: 'Real Estate Editing',
      description: 'HDR blending and sky replacement for 30 exterior/interior shots.',
      status: OrderStatus.REVIEW,
      priority: Priority.MEDIUM,
      totalAmount: 90.00,
      paidAmount: 90.00,
      deadline: new Date(Date.now() + 86400000 * 1),
    },
    {
      orderNumber: 'ORD-2024-003',
      clientId: client2.id,
      assignedToId: editor1.id,
      managerId: manager.id,
      projectName: 'Corporate Promo Video Edit',
      serviceType: 'Video Editing (Basic)',
      description: '5-minute company profile edit with motion lower thirds.',
      status: OrderStatus.COMPLETED,
      priority: Priority.URGENT,
      totalAmount: 250.00,
      paidAmount: 250.00,
      deadline: new Date(Date.now() - 86400000 * 3),
      completedAt: new Date(Date.now() - 86400000 * 2),
    },
    {
      orderNumber: 'ORD-2024-004',
      clientId: client2.id,
      assignedToId: null,
      managerId: manager.id,
      projectName: 'E-commerce Shoe Product Cutouts',
      serviceType: 'Background Removal',
      description: 'Transparent PNG output for 100 footwear items.',
      status: OrderStatus.PENDING,
      priority: Priority.LOW,
      totalAmount: 150.00,
      paidAmount: 0.00,
      deadline: new Date(Date.now() + 86400000 * 5),
    },
    {
      orderNumber: 'ORD-2024-005',
      clientId: client1.id,
      assignedToId: editor2.id,
      managerId: manager.id,
      projectName: 'Smith Wedding Highlight Film',
      serviceType: 'Wedding Package',
      description: 'Full highlight film color grade and sound design.',
      status: OrderStatus.REVISION,
      priority: Priority.HIGH,
      totalAmount: 500.00,
      paidAmount: 500.00,
      deadline: new Date(Date.now() + 86400000 * 1),
      revisionCount: 1,
    },
  ];

  for (const o of orderData) {
    const createdOrder = await prisma.order.create({
      data: o,
    });

    // Add order item
    await prisma.orderItem.create({
      data: {
        orderId: createdOrder.id,
        name: o.serviceType,
        description: o.description,
        quantity: 1,
        unitPrice: o.totalAmount,
        total: o.totalAmount,
      },
    });

    // Add timeline
    await prisma.orderTimeline.create({
      data: {
        orderId: createdOrder.id,
        status: o.status.toString(),
        description: `Order initialized with status ${o.status}`,
        createdBy: manager.firstName,
      },
    });
  }

  // 4. Seed Invoices
  const allOrders = await prisma.order.findMany();
  for (let i = 0; i < allOrders.length; i++) {
    const order = allOrders[i];
    const invStatus = i === 0 || i === 1 || i === 2 ? InvoiceStatus.PAID : (i === 3 ? InvoiceStatus.DRAFT : InvoiceStatus.SENT);
    await prisma.invoice.create({
      data: {
        invoiceNumber: `INV-2024-00${i + 1}`,
        orderId: order.id,
        clientId: order.clientId,
        subtotal: order.totalAmount,
        taxRate: 10.0,
        taxAmount: Number(order.totalAmount) * 0.1,
        discount: 0.0,
        total: Number(order.totalAmount) * 1.1,
        status: invStatus,
        dueDate: new Date(Date.now() + 86400000 * 14),
        paidAt: invStatus === InvoiceStatus.PAID ? new Date() : null,
      },
    });
  }

  // 5. Seed Conversation & Messages
  const conversation = await prisma.conversation.create({
    data: {
      name: 'Project ORD-2024-001 Discussion',
      isGroup: true,
      orderId: allOrders[0].id,
      participants: {
        create: [
          { userId: client1.id },
          { userId: manager.id },
          { userId: editor1.id },
        ],
      },
      messages: {
        create: [
          {
            senderId: client1.id,
            content: 'Hi team, just uploaded raw RAW files for the fashion edit.',
          },
          {
            senderId: manager.id,
            content: 'Great! Mike will take over the retouching today.',
          },
          {
            senderId: editor1.id,
            content: 'Received! Working on initial skin tones now.',
          },
        ],
      },
    },
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
