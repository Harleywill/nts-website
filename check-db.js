const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const projects = await prisma.project.findMany();
    const news = await prisma.newsItem.findMany();
    const testimonials = await prisma.testimonial.findMany();
    const users = await prisma.user.findMany();

    console.log('Projects found:', projects.length);
    console.log('News found:', news.length);
    console.log('Testimonials found:', testimonials.length);
    console.log('Users found:', users.length);

    if (projects.length > 0) {
      console.log('\nSample Projects:');
      projects.slice(0, 3).forEach(p => console.log(`  - ${p.title}`));
    }

    if (news.length > 0) {
      console.log('\nSample News:');
      news.slice(0, 3).forEach(n => console.log(`  - ${n.title}`));
    }

    if (testimonials.length > 0) {
      console.log('\nSample Testimonials:');
      testimonials.slice(0, 3).forEach(t => console.log(`  - ${t.name}`));
    }
  } catch(e) {
    console.log('Error:', e.message);
  }

  await prisma.$disconnect();
}

check();
