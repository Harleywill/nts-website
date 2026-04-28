"use client";

import { motion } from "framer-motion";

const process = [
  {
    number: "01",
    title: "Consultation",
    description: "We meet with you to understand your needs, property specifications, and budget requirements.",
  },
  {
    number: "02",
    title: "Assessment",
    description: "Our engineers conduct a thorough evaluation to design the optimal solution for your space.",
  },
  {
    number: "03",
    title: "Planning",
    description: "We provide detailed proposals, timelines, and transparent pricing with no hidden costs.",
  },
  {
    number: "04",
    title: "Installation",
    description: "Professional installation with minimal disruption, using only quality materials and proven techniques.",
  },
  {
    number: "05",
    title: "Testing",
    description: "Comprehensive system testing and commissioning to ensure peak performance and efficiency.",
  },
  {
    number: "06",
    title: "Support",
    description: "Ongoing maintenance plans and 24/7 support to keep your systems running smoothly.",
  },
];

export default function AboutPageContent() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 px-6 py-24 sm:py-32 lg:px-8">
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
                Leading provider of professional HVAC and mechanical solutions across Hull and beyond. With over 15 years of expertise, we're committed to delivering reliability, quality, and excellence in every project.
              </p>
            </motion.div>

            {/* Right Image Grid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80"
                alt="Team member"
                className="rounded-lg w-full h-64 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
                alt="Work in progress"
                className="rounded-lg w-full h-40 object-cover mt-8"
              />
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
                alt="Team collaboration"
                className="rounded-lg w-full h-40 object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=500&q=80"
                alt="Office space"
                className="rounded-lg w-full h-64 object-cover mt-8"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cohesive Main Section: Our Story & Why We're Different */}
      <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Our History */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, amount: 0.3 }}
            className="mb-20"
          >
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-8">
              Our Story
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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


          {/* Services & Our Philosophy */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="mb-20"
          >
            <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Our Comprehensive Services
            </h3>
            <p className="text-center text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              We provide installation, service and maintenance of Plumbing and heating, Air Conditioning, Ventilation, Building and energy management systems, and RPZ testing. Constant training and sharing best practice ensures we are at the forefront of emerging technology, presenting clients with multiple options to fulfill their needs.
            </p>
          </motion.div>

          {/* Our Commitment */}
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
      <section className="bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
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
