import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

try {
  const users = await prisma.user.findMany();
  console.log('Users:', users);
  
  const projects = await prisma.project.findMany({ take: 2 });
  console.log('Projects count:', await prisma.project.count());
  
  const news = await prisma.newsItem.findMany({ take: 2 });
  console.log('News items count:', await prisma.newsItem.count());
  
  const testimonials = await prisma.testimonial.findMany({ take: 2 });
  console.log('Testimonials count:', await prisma.testimonial.count());
} catch (e) {
  console.error(e.message);
} finally {
  await prisma.();
}
