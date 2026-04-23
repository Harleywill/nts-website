"use client";

import Link from "next/link";

export default function AboutSection() {
  const features = [
    {
      name: "Expert Engineering",
      description: "Our Gas Safe registered engineers bring 15+ years of experience to every project, ensuring reliable installations and repairs.",
    },
    {
      name: "Rapid Response",
      description: "We understand that heating emergencies can't wait. Our team responds quickly to get your system back up and running.",
    },
    {
      name: "End-to-End Solutions",
      description: "From domestic plumbing to commercial HVAC systems, we provide complete mechanical and electrical solutions.",
    },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-white px-6 py-24 sm:py-32 lg:overflow-visible lg:px-0">
      {/* Gradient Blob Background */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#4caf50] to-[#1a2f6e] opacity-15 sm:left-[calc(50%-30rem)] sm:w-[143.75rem]"
        />
      </div>

      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[72.1875rem] -translate-x-1/2 bg-gradient-to-tr from-[#1a2f6e] to-[#4caf50] opacity-15 sm:left-[calc(50%+36rem)] sm:w-[143.75rem]"
        />
      </div>

      {/* Main Content Grid */}
      <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10">
        {/* Left Column - Text Content */}
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="lg:max-w-lg">
              <p className="text-base/7 font-semibold" style={{ color: "#4caf50" }}>
                About NTS Ltd
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight text-pretty" style={{ color: "#1a2f6e" }} >
                Your Trusted HVAC Partner
              </h2>
              <p className="mt-6 text-xl/8 text-gray-700">
                For over 15 years, NTS Ltd has been delivering exceptional heating, cooling, and ventilation services to homes and businesses across Hull. We're committed to keeping your systems running smoothly, efficiently, and safely.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Image */}
        <div className="-mt-12 -ml-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800&q=80"
            alt="HVAC Services"
            className="w-3xl max-w-none rounded-xl bg-gray-800 shadow-xl ring-1 ring-white/10 sm:w-228"
          />
        </div>

        {/* Bottom Left - Features List */}
        <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8">
          <div className="lg:pr-4">
            <div className="max-w-xl text-base/7 text-gray-700 lg:max-w-lg">
              <p>
                Whether you need a new boiler installation, routine maintenance, emergency repairs, or a complete commercial HVAC system, NTS Ltd has the expertise and experience to handle it. We work with both domestic and commercial clients, from small residential properties to large industrial facilities.
              </p>

              {/* Features List */}
              <ul role="list" className="mt-8 space-y-8 text-gray-700">
                {features.map((feature, index) => (
                  <li key={index} className="flex gap-x-3">
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="mt-1 size-5 flex-none"
                      style={{ color: "#4caf50" }}
                    >
                      <path d="M10.894 2.553a.75.75 0 00-1.788 0l-7 140a.75.75 0 001.721.813l6.157-7.348h5.25l6.157 7.348a.75.75 0 001.722-.812l-7-140z" />
                    </svg>
                    <span>
                      <strong className="font-semibold" style={{ color: "#1a2f6e" }}>{feature.name}.</strong> {feature.description}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="mt-8">
                We take pride in our professionalism, reliability, and attention to detail. Every member of our team is trained to the highest standards, and we're committed to providing outstanding customer service at every stage of your project.
              </p>

              <h3 className="mt-16 text-2xl font-bold tracking-tight" style={{ color: "#1a2f6e" }}>
                Let's improve your comfort today
              </h3>

              <p className="mt-6">
                Get in touch with our team to discuss your heating, cooling, and ventilation needs. We'll provide expert advice and a competitive quote for your project.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3 font-semibold text-white rounded-lg transition-all duration-200 transform hover:scale-105"
                style={{ backgroundColor: "#4caf50" }}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
