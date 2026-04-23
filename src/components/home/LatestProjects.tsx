"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const projects = [
  {
    id: 1,
    title: "Commercial HVAC Installation",
    description: "Complete heating and cooling system installation for a 50,000 sq ft commercial facility. State-of-the-art equipment with energy-efficient controls and zoning systems.",
    category: "Commercial",
    date: "Apr 15, 2024",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    manager: {
      name: "John Thompson",
      role: "Project Manager",
      image: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 2,
    title: "Residential Heating System Upgrade",
    description: "Modern boiler installation and complete heating system optimization for a family home. Improved efficiency and comfort with smart controls integration.",
    category: "Residential",
    date: "Apr 8, 2024",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    manager: {
      name: "Sarah Mitchell",
      role: "Senior Engineer",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
  {
    id: 3,
    title: "Ventilation System Retrofit",
    description: "Energy-efficient ventilation system installation in heritage building. Preservation of original aesthetics while meeting modern building regulations and air quality standards.",
    category: "Industrial",
    date: "Mar 28, 2024",
    image: "https://images.unsplash.com/photo-1581092162562-40038f04f6d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    manager: {
      name: "Michael Davies",
      role: "Lead Technician",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
  },
];

export default function LatestProjects() {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div
          className="mx-auto max-w-2xl lg:mx-0"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl">
            Latest Projects
          </h2>
          <p className="mt-2 text-lg/8 text-gray-300">
            View our recent work and see what we can do for you.
          </p>
        </motion.div>
        <motion.div
          className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-700 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {projects.map((project) => (
            <article
              key={project.id}
              className="flex max-w-xl flex-col items-start justify-between"
            >
              <div className="relative w-full">
                <img
                  src={project.image}
                  alt={project.title}
                  className="aspect-video w-full rounded-lg bg-gray-800 object-cover"
                />
              </div>

              <div className="flex items-center gap-x-4 text-xs mt-6">
                <time dateTime={project.date} className="text-gray-400">
                  {project.date}
                </time>
                <a
                  href="#"
                  className="relative z-10 rounded-full bg-gray-800/60 px-3 py-1.5 font-medium text-gray-300 hover:bg-gray-800"
                  style={{ color: "#4caf50" }}
                >
                  {project.category}
                </a>
              </div>

              <div className="group relative grow">
                <h3 className="mt-3 text-lg/6 font-semibold text-white group-hover:text-gray-300">
                  <Link href={`/projects/${project.id}`}>
                    <span className="absolute inset-0"></span>
                    {project.title}
                  </Link>
                </h3>
                <p className="mt-5 line-clamp-3 text-sm/6 text-gray-400">
                  {project.description}
                </p>
              </div>

              <div className="relative mt-8 flex items-center gap-x-4">
                <Image
                  src={project.manager.image}
                  alt={project.manager.name}
                  width={40}
                  height={40}
                  className="size-10 rounded-full bg-gray-800"
                />
                <div className="text-sm/6">
                  <p className="font-semibold text-white">
                    <a href="#">
                      <span className="absolute inset-0"></span>
                      {project.manager.name}
                    </a>
                  </p>
                  <p className="text-gray-400">{project.manager.role}</p>
                </div>
              </div>
            </article>
          ))}
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3 font-semibold text-white rounded-lg transition-all duration-200 transform hover:scale-105"
            style={{ backgroundColor: "#4caf50" }}
          >
            View All Projects
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
