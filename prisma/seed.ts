import { prisma } from "@/lib/db";
import bcryptjs from "bcryptjs";

async function main() {
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";

  const existingAdmin = await prisma.user.findUnique({
    where: { username: adminUsername },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcryptjs.hash(adminPassword, 10);
    const admin = await prisma.user.create({
      data: {
        username: adminUsername,
        password: hashedPassword,
      },
    });
    console.log("Admin user created:", admin.username);
  }

  // Seed projects
  const existingProjects = await prisma.project.count();
  if (existingProjects === 0) {
    const project1 = await prisma.project.create({
      data: {
        title: "Commercial HVAC Installation",
        description: "Complete heating and air conditioning installation for a 500 sq m commercial property",
        category: "Commercial",
        date: new Date("2024-03-15"),
        imageUrl: "/images/projects/commercial-hvac.jpg",
        featured: true,
        clientName: "ABC Manufacturing Ltd",
        duration: "6 weeks",
        highlights: "Energy efficient system, 24/7 monitoring, Quiet operation",
        metrics: "35% energy saving, 99.8% uptime",
      },
    });

    const project2 = await prisma.project.create({
      data: {
        title: "Residential Boiler Upgrade",
        description: "New condensing boiler installation with full pipework modernisation",
        category: "Residential",
        date: new Date("2024-02-20"),
        imageUrl: "/images/projects/boiler-upgrade.jpg",
        featured: true,
        clientName: "Smith Family",
        duration: "3 days",
        highlights: "Smart controls, Lower bills, Fast installation",
        metrics: "40% heating cost reduction",
      },
    });

    const project3 = await prisma.project.create({
      data: {
        title: "Ventilation System Overhaul",
        description: "Complete ventilation system upgrade for industrial facility",
        category: "Ventilation",
        date: new Date("2024-01-10"),
        imageUrl: "/images/projects/ventilation.jpg",
        featured: false,
        clientName: "Industrial Solutions Corp",
        duration: "8 weeks",
        highlights: "Modern filtration, Reduced noise, Improved air quality",
        metrics: "50% noise reduction",
      },
    });

    console.log("Projects seeded:", project1.id, project2.id, project3.id);
  }

  // Seed testimonials
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    await prisma.testimonial.create({
      data: {
        text: "NTS Ltd provided an exceptional service from start to finish. Their team was professional, punctual, and left our facility immaculate. We've already scheduled them for our next maintenance cycle.",
        name: "John Thompson",
        company: "Thompson Engineering",
        featured: true,
      },
    });

    await prisma.testimonial.create({
      data: {
        text: "We were impressed with the speed and efficiency of their work. The new heating system has been running perfectly for months now with no issues. Highly recommend!",
        name: "Sarah Davies",
        company: "Davies Properties",
        featured: true,
      },
    });

    await prisma.testimonial.create({
      data: {
        text: "The installation team was knowledgeable and took time to explain everything. Great value for money and excellent aftercare support.",
        name: "Michael Chen",
        company: "Chen Manufacturing",
        featured: false,
      },
    });

    console.log("Testimonials seeded");
  }

  // Seed news items
  const existingNews = await prisma.newsItem.count();
  if (existingNews === 0) {
    await prisma.newsItem.create({
      data: {
        title: "NTS Ltd Achieves F-Gas Certification",
        content: "We're proud to announce that NTS Ltd has successfully achieved F-Gas certification, enabling us to service and install a wider range of refrigeration and air conditioning systems. This certification demonstrates our commitment to environmental responsibility and regulatory compliance.",
        imageUrl: "/images/news/fgas-cert.jpg",
        featured: true,
      },
    });

    await prisma.newsItem.create({
      data: {
        title: "New 24/7 Emergency Support Line Launched",
        content: "NTS Ltd has launched a new 24/7 emergency support line for our commercial clients. Whether it's a weekend boiler emergency or a critical HVAC failure, our team is ready to help. Call our emergency line for immediate assistance.",
        imageUrl: "/images/news/emergency-line.jpg",
        featured: true,
      },
    });

    await prisma.newsItem.create({
      data: {
        title: "Energy Efficiency Tips for Winter",
        content: "As we head into winter, here are some tips to help you stay warm while keeping energy bills down: Regular boiler servicing, proper insulation checks, and smart thermostat settings can all contribute to significant savings.",
        imageUrl: "/images/news/winter-tips.jpg",
        featured: false,
      },
    });

    console.log("News items seeded");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
