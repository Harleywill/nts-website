"use client";

import { motion } from "framer-motion";
import { FaCheckCircle, FaUsers, FaTrophy, FaShieldAlt } from "react-icons/fa";

const whyChooseUs = [
  {
    icon: FaCheckCircle,
    title: "Expert Team",
    description: "Over 50 fully qualified engineers with decades of combined experience in HVAC and mechanical services.",
  },
  {
    icon: FaTrophy,
    title: "Industry Leaders",
    description: "Certified by leading manufacturers and accredited with Gas Safe, F-Gas, and multiple quality standards.",
  },
  {
    icon: FaShieldAlt,
    title: "Guaranteed Service",
    description: "We stand behind our work with comprehensive warranties and 24/7 emergency support for our clients.",
  },
  {
    icon: FaUsers,
    title: "Customer First",
    description: "Your satisfaction is our priority. We listen, plan carefully, and deliver solutions that exceed expectations.",
  },
];

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
      <section className="relative isolate overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800 px-6 py-32 sm:py-48 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4caf50] to-[#64b5f6] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
          />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl font-bold tracking-tight text-white sm:text-6xl"
          >
            About NTS Ltd
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-6 text-lg leading-8 text-gray-300"
          >
            Leading provider of professional HVAC and mechanical solutions across Hull and beyond. With over 15 years of expertise, we're committed to delivering reliability, quality, and excellence in every project.
          </motion.p>
        </div>
      </section>

      {/* Company Story */}
      <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-4">
                Founded in 2010, NTS Ltd began with a simple vision: to provide reliable, professional HVAC and mechanical solutions that homeowners and businesses could trust. What started as a small team of passionate engineers has grown into a thriving company serving hundreds of satisfied clients.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Over the years, we've built our reputation on integrity, expertise, and customer satisfaction. Every project, whether residential or commercial, receives the same level of professionalism and attention to detail.
              </p>
              <p className="text-lg text-gray-600">
                Today, we're proud to employ over 50 qualified engineers and continue to set the standard for excellence in the heating, cooling, and ventilation industry across the UK.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-12 text-center"
            >
              <div className="text-5xl font-bold mb-4" style={{ color: "#1a2f6e" }}>
                15+
              </div>
              <p className="text-xl font-semibold text-gray-900 mb-8">Years of Excellence</p>
              <div className="space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <span style={{ color: "#4caf50" }} className="text-2xl">✓</span>
                  <span className="text-gray-700">2000+ successful projects</span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ color: "#4caf50" }} className="text-2xl">✓</span>
                  <span className="text-gray-700">50+ qualified engineers</span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ color: "#4caf50" }} className="text-2xl">✓</span>
                  <span className="text-gray-700">12 industry certifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <span style={{ color: "#4caf50" }} className="text-2xl">✓</span>
                  <span className="text-gray-700">24/7 customer support</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative isolate overflow-hidden bg-gray-50 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Why Choose NTS Ltd
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We're not just another HVAC company—here's what sets us apart
            </p>
          </motion.div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="inline-block p-3 rounded-lg bg-green-500/10 mb-4">
                    <Icon size={28} style={{ color: "#4caf50" }} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Process */}
      <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#4caf50] to-[#64b5f6] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
          />
        </div>
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Process
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From initial consultation to ongoing support, here's how we work with you
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, amount: 0.2 }}
                className="relative"
              >
                <div className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl text-white font-bold text-xl"
                      style={{ backgroundColor: "#4caf50" }}
                    >
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
                {index < process.length - 1 && (
                  <div className="hidden lg:block absolute top-14 -right-4 w-8 h-0.5 bg-gradient-to-r from-green-400 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#64b5f6] to-[#4caf50] opacity-15 sm:left-[calc(50%+36rem)] sm:w-[143.75rem]"
          />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-300 leading-8">
                To deliver reliable, efficient, and innovative HVAC and mechanical solutions that exceed customer expectations. We're committed to maintaining the highest standards of safety, quality, and professionalism in every project we undertake, ensuring our clients enjoy comfortable, safe, and efficient indoor environments.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                Our Values
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span style={{ color: "#4caf50" }} className="text-2xl flex-shrink-0 mt-1">
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold text-white">Reliability</p>
                    <p className="text-gray-400">You can count on us to deliver on our promises, every time</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: "#4caf50" }} className="text-2xl flex-shrink-0 mt-1">
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold text-white">Quality</p>
                    <p className="text-gray-400">We use only the best materials and proven techniques</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: "#4caf50" }} className="text-2xl flex-shrink-0 mt-1">
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold text-white">Safety</p>
                    <p className="text-gray-400">All work meets the highest safety and compliance standards</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: "#4caf50" }} className="text-2xl flex-shrink-0 mt-1">
                    ✓
                  </span>
                  <div>
                    <p className="font-semibold text-white">Excellence</p>
                    <p className="text-gray-400">We strive for excellence in everything we do</p>
                  </div>
                </li>
              </ul>
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
