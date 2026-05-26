"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import DuctWaves from "@/components/common/DuctWaves";

const directors = [
  {
    name: "Anthony Gartland",
    title: "Consultant Director",
    image: "/images/directors/Anthony-Gartland.jpg",
  },
  {
    name: "Matthew Gartland",
    title: "Managing Director",
    image: "/images/directors/Matthew-Gartland.jpg",
  },
  {
    name: "Richard Tinker",
    title: "Director",
    image: "/images/directors/Richard-Tinker-768x768.jpg",
  },
  {
    name: "Lee Harris",
    title: "Financial Director",
    image: "/images/directors/Lee-Harris-768x768.jpg",
  },
];

export default function AboutPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 px-6 pt-24 pb-24 sm:py-32 lg:px-8 lg:pt-24">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <DuctWaves />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                About NTS Ltd
              </h1>
              <p className="text-lg leading-8 text-gray-300 mb-8">
                For more than 45 years, NTS Limited has delivered trusted mechanical and electrical solutions to businesses and organisations across the UK. Based in East Yorkshire and operating nationwide, we combine decades of industry experience with a forward-thinking approach to modern building services.
              </p>
            </motion.div>

            {/* Right Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="rounded-lg w-full h-56 overflow-hidden relative">
                <Image
                  src="/images/team-member.jpg"
                  alt="Team Member - NTS Ltd professional team"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-lg w-full h-56 overflow-hidden relative">
                <Image
                  src="/images/work-in-progress.jpg"
                  alt="Work in Progress - Professional HVAC installation"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-lg w-full h-56 overflow-hidden relative">
                <Image
                  src="/images/team-collaboration.jpg"
                  alt="Team Collaboration - NTS Ltd team working together"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="rounded-lg w-full h-56 overflow-hidden relative">
                <Image
                  src="/images/office-space.jpg"
                  alt="Office Space - NTS Ltd headquarters"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Meet the Directors Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg text-center mb-16 bg-white"
          >
            <h2 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6">
              Meet the Directors
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our experienced leadership team brings decades of expertise in HVAC and mechanical services
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-12 justify-items-center">
            {directors.map((director, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                className="flex flex-col items-center"
              >
                <div className="relative mb-6">
                  <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
                    <Image
                      src={director.image}
                      alt={`${director.name} - ${director.title}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {director.name}
                </h3>
                <p className="text-lg italic text-blue-600 text-center">
                  {director.title}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section with Comprehensive Services */}
      <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Our Story */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-20"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8 bg-white">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl text-center">
                Our Story
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="bg-white rounded-2xl p-8 shadow-lg bg-white">
                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    NTS department was formed in 1981 as part of the heating company, providing design, installation and servicing to a wide range of customers, both commercial and domestic. In 2011, it became an independent company providing the same level of service gained over the preceding years of experience.
                  </p>
                  <p>
                    Our vast experience has taught us that "right first time" is the only way to ensure high levels of customer retention and operational efficiency. We pride ourselves on our quality focus over and above commercial, physical and time constraints.
                  </p>
                  <p>
                    Our long-standing, loyal client base is testament to good service and quality of workmanship, approaching each project from the client stand-point and looking at the entire project life cycle from installation, through to commissioning and service.
                  </p>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.3 }}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-12 text-center"
              >
                <div className="text-5xl font-bold mb-4" style={{ color: "#1a2f6e" }}>
                  45+
                </div>
                <p className="text-xl font-semibold text-gray-900 mb-8">Years of Excellence</p>
                <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    <span style={{ color: "#4caf50" }} className="text-2xl">✓</span>
                    <span className="text-gray-700">Founded in 1981</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: "#4caf50" }} className="text-2xl">✓</span>
                    <span className="text-gray-700">Independent since 2011</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: "#4caf50" }} className="text-2xl">✓</span>
                    <span className="text-gray-700">50+ qualified engineers</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span style={{ color: "#4caf50" }} className="text-2xl">✓</span>
                    <span className="text-gray-700">Proven track record</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Comprehensive Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-20 bg-white rounded-2xl p-8 shadow-lg bg-white"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
              Our Comprehensive Services
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed max-w-4xl">
              <p>
                Our expertise covers a complete range of mechanical and electrical solutions, including plumbing, heating, ventilation, air conditioning, electrical controls, and renewable technologies. From large-scale commercial projects to specialist installations and ongoing maintenance, we provide reliable systems designed to improve efficiency, performance, and long-term sustainability.
              </p>
              <p>
                At NTS Limited, we understand that every project is different. That's why we work closely with clients from concept through to completion, ensuring every solution is tailored to meet operational requirements, compliance standards, and future energy demands. Our skilled engineers and technical teams are committed to delivering high-quality workmanship, innovative thinking, and dependable service at every stage.
              </p>
            </div>
          </motion.div>

          {/* Sustainability & Innovation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-20 bg-white rounded-2xl p-8 shadow-lg bg-white"
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Sustainability & Innovation</h3>
            <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
              <p>
                As the industry continues to evolve, renewable and energy-efficient technologies are becoming increasingly important. We are proud to support clients with sustainable solutions that help reduce environmental impact while improving energy performance and operational cost efficiency.
              </p>
              <p>
                Our commitment to innovation means we stay at the forefront of emerging technologies, continuously training our teams and exploring new approaches that benefit both our clients' operations and the environment.
              </p>
            </div>
          </motion.div>

          {/* Our Core Values */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 lg:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="text-center"
            >
              <h3 className="text-3xl font-bold text-white mb-6">Our Core Values</h3>
              <p className="text-gray-300 leading-8 max-w-2xl mx-auto mb-12">
                A contract with NTS Ltd is more than a signed piece of paper, it is our commitment to you and the start of a potential long term relationship.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-left">
                  <p className="font-semibold text-white text-lg mb-2">Reliability</p>
                  <p className="text-gray-400">Delivering on every promise</p>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-lg mb-2">Quality</p>
                  <p className="text-gray-400">Right first time, every time</p>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-lg mb-2">Safety</p>
                  <p className="text-gray-400">Highest compliance standards</p>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-white text-lg mb-2">Partnership</p>
                  <p className="text-gray-400">Your success is our success</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center bg-white rounded-2xl p-8 shadow-lg bg-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6"
          >
            Ready to Experience Our Service?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-lg text-gray-600 mb-8"
          >
            Contact us today for a free consultation. Let's discuss your HVAC and mechanical service needs.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true, amount: 0.2 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <a
              href="/contact"
              className="rounded-md px-8 py-3 font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: "#4caf50" }}
            >
              Get a Free Quote
            </a>
            <a
              href="/services"
              className="rounded-md px-8 py-3 font-semibold transition-colors border-2"
              style={{ borderColor: "#4caf50", color: "#4caf50" }}
            >
              View Services
            </a>
          </motion.div>
        </div>
      </section>
    </>
  );
}
