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
    await prisma.project.createMany({
      data: [
        {
          title: "Boots Store Reading",
          description: "Case Study: Boots, The Oracle Shopping Centre, Reading\n\nDue to Boots' open door policy, the open shop front on one of its flagship stores located in the Oracle Shopping Centre, Reading was causing more than a headache for the retailer. While the design of the store entrance was helping to promote footfall, cold draughts were becoming a problem for both staff and customers. In addition, the heating/air conditioning system was working extra hard to cope with the heat loss, so energy costs were escalating.\n\nNortek Global HVAC UK worked with M and E contractor Neville Tucker Services of Kingston upon Hull to provide an energy-efficient, cost-effective solution. Fitting air curtains created a barrier of air to deflect the natural convection airflow so that conditioned air would be retained within the store. It also slashed the store's running costs.\n\nBoots Store Reading\nBecause of the size of the open shop front, cold dense air flows in at the bottom of the entrance opening while warm air inside the building exits at the top. Typically, air curtains are installed over the doors to high street shops and above the entrance doors to shopping malls. Here, however, the size of the entrance to the Boots store and the lower ambient temperature in the Oracle Shopping Centre meant it was necessary to install air curtains above the doors to the store.\n\nNortek Global HVAC UK, which incorporates the AmbiRad, Benson, Airbloc and Nordair Niche brands, supplied nine air curtains from its Airbloc AC range. The store's recessed ceiling does not extend to the glazed frontage, so recessed air curtains were not an option as they would not seal the doorway. With a semi-circular profile, which also conceals the inlet grille, the Airbloc AC unit was ideally suited to this application because it could be mounted close to the door for a better seal.\n\nNine three-phase electrically heated air curtains were installed side by side across the store's three 6m glass doors to resemble a single continuous unit. For added safety/ functionality, the units were specified with an illuminated fire exit sign, while a powder-coated finish provided a stylish solution that did not detract from the overall design of the store entrance.\n\nWorking closely with the steelwork contractor, Neville Tucker Services devised an innovative mounting solution to ensure a neat installation that would hide the wiring.  The weld studs were specified such that the air curtains would bolt directly on to the minimal steelwork at the full height glass entrance, without the need for any brackets.\n\nTo ensure optimum performance, the air curtains were installed in conjunction with Nortek's SmartElec energy controller. The wired, Thyristor-controlled system features a digital display and three fan settings allowing a modulation range of 16-35 degrees.  End users typically find that SmartElec halves the running costs of their heating/air conditioning and they stand to make savings of up to 65% on their energy bills.\n\nNeville Tucker Services director Matthew Gartland said: \"Airbloc AC air curtains are powerful, quality units that fit the bill for a variety of retail applications and are easy to install.\n\n\"We particularly like them because they can be linked to the BMS using the SmartElec controller to provide effective HVAC control.  This is a really good feature and was an essential part of the specification for the Boots store in Reading's Oracle Shopping Centre.\"\n\nThe SmartElec controller has built-in digital sensors that allow tighter control through pulsing and modulating of the heated elements, saving energy running costs.  It means the air curtain can be at ambient temperature for as long as possible while still monitoring the required set point output temperature. The system specification also includes MODBUS protocol communication with the store's Building Management System (BMS).  This approach enables the BMS to switch the air curtain on/off and control it – altering the temperature setting and fan speed and identifying fault signals – so that it effectively replaces the standard keypad control.",
          category: "Commercial",
          date: new Date("2026-04-29"),
          imageUrl: "/uploads/1777471286769-jcqvvy.jpg",
          featured: true,
          clientName: "Boots Store",
          highlights: "\nInstallation Summary:\n\nSemi-circular profile allows installation close to the doors for an effective seal\nEnergy-efficient solution reduces heat loss and building running costs by 80%\nUnits installed side by side to resemble a single continuous unit\nInnovative mounting solution did not detract from the store entrance\nRemote SmartElec controller incorporating MODBUS protocol interfaces with the store's BMS\n",
          metrics: "\nTechnical Summary:\nElectrically heated AC2000 SE18-SM and AC1500 SE12-SM units\nCustomised finish enhances the design of the store entrance\nUniform linear air flow across the full door width ensures an effective barrier\nClass-leading SmartElec controller delivers energy savings of 40%-65%",
        },
        {
          title: "Foredyke School",
          description: "We have designed, built and commissioned a large control system for the Foredyke School in Hull, the school has undergone a major expansion refurbishment. The control system satisfies all the requirements of the local authority and building regulations. It controls AHU's, boilers, associated pumps and equipment and has full access via the internet for the local authority to monitor this equipment.",
          category: "Commercial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777533429382-o2xhu9.jpg",
          featured: true,
          clientName: "Foredyke School",
        },
        {
          title: "Rebound Trampoline Centre",
          description: "We have recently completed the HVAC and BMS installation at Rebound, Hull.\n\nThis has been an interesting project as we have had to meet the unique demands of the trampoline centre which was made possible by the careful selection of Air Handling plant and its integration with a Honeywell Centraline Building Management system.",
          category: "Commercial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777533510485-w6ruhq.jpg",
          featured: true,
        },
        {
          title: "DFS Tamworth",
          description: "",
          category: "Commercial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777533737388-c3q0qe.jpg",
          featured: true,
          clientName: "DFS",
        },
        {
          title: "Figaro's Italian Restaurant",
          description: "Comfort Eating At Figaro!\n\nAir Conditioning units have been installed at Figaro (Italian Restaurant). This restaurant has been running for 14 years and accommodates 85 diners throughout the restaurant, the benefit of installing an Air Conditioning system is to allow the diners to enjoy their meals in comfort.",
          category: "Commercial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777533859851-8oqxp2.jpg",
          featured: true,
        },
        {
          title: "QK Honeycomb Product",
          description: "Here are some pictures of just one of our recent great installations for 2 new Powrmatic CPX G150X complete with ducting and desertification fans keeping the workforce warm in this new factory building.",
          category: "Industrial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777533975355-0bepon.jpg",
          featured: true,
        },
        {
          title: "Rock Climbing Centre Hull",
          description: "We have recently carried out a bespoke air conditioning installation at a vertical rock climbing facility. This is located in a very high, open space, we could not use gas heating as the gas has been removed from the building. Therefore, A/C was the answer, we carefully engineered this so the air diffusers looked similar to the hand and feet grips. Desertification fans focus the air flow in a downwards direction and keep the heat down and air moving.",
          category: "Commercial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777534043954-hrmei5.jpeg",
          featured: true,
        },
        {
          title: "Alpamare",
          description: "One of our existing customers acquired a prestigous water park based in Scarbrough. The park although modern, has been unused for sometime and had an unknown background both mechanically and electrically. We have been given the task of repairing and replacing many of the badly maintained pumps, most of which are very large, due to the large volume of water they handle.\n\nWe have successfully achieved this without the need to close the facility and have now reached the point where all systems are working correctly. Part of the facilities require new controls. This has been handled with our own labour and in house techical ability.",
          category: "Commercial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777534148267-52iw20.jpeg",
          featured: true,
        },
        {
          title: "Reva Park",
          description: "We have recently acquired a contract to provide the gas supply pipework, boilers and controls for the heating plant supplying the process equipment.The pipework is 100mm iron pipework with flanged and welded joints.\n\nA bespoke control system looks after the boilers. This is designed, manufactured, installed and comissioned by us.",
          category: "Industrial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777534210453-3c95y3.jpeg",
          featured: true,
        },
        {
          title: "Dutton Moore",
          description: "The building was originally a Bank of Scotland building three of our directors were involved in the original boiler renewal using Peter Hirds to provide the crane lift on to the top plant room.\n\n30 years later the boilers had come to the end of their life, the same three directors and the same crane company were all involved in the successful rooftop installation.",
          category: "Commercial",
          date: new Date("2026-04-30"),
          imageUrl: "/uploads/1777534268376-lb890o.jpeg",
          featured: true,
        },
      ],
    });

    console.log("Projects seeded");
  }

  // Seed testimonials
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    await prisma.testimonial.createMany({
      data: [
        {
          text: "Rob is brilliant he has been working solid at my house all day, I have seen anything like it. I am old and don't know what I am doing and he has been talking me through everything and showing me how to use the controls, very polite and professional I shall be spreading the word to all my friends",
          name: "Mrs Kemp",
          featured: true,
        },
        {
          text: "Myself and Suzzanne are very impressed with the new Firebird, its looks lovely. A big thank you to you the Professionalism you showed from first contact to seeing the job through. We would also like to express a very big thank you to Rob and Ryan for their workmanship in installing the Firebird\n\n",
          name: "Neil Scott",
          company: "QK Honeycomb Product Limited",
          featured: true,
        },
        {
          text: "The process from quotation to job completion was painless and thorough\n\n",
          name: "Peter Whitehurst",
          featured: true,
        },
        {
          text: "Just keep up the good work\n\n",
          name: "Trevor Mothersele",
          featured: true,
        },
        {
          text: "Thank you and your men for all they did and their kindness whilst working here, we are now warm again and hope it goes on working well… good wishes for you all this Christmas time, also to the phone people my daughter spoke yo. Very pleased with the work carried out.\n\n",
          name: "Sylvia Dowson",
          featured: true,
        },
        {
          text: "Please may I add that Andy is a great engineer who is very kind, considerate and professional. Thank you, once again.\n\n",
          name: "Mr Wright",
          featured: true,
        },
        {
          text: "Very friendly, knowledgeable and helpful engineers. This has been my experience over the may years NTS Ltd has service my AGA. I have always found the engineers to be excellent.\n\n",
          name: "Mrs Mcollum",
          featured: true,
        },
      ],
    });

    console.log("Testimonials seeded");
  }

  // Seed news items
  const existingNews = await prisma.newsItem.count();
  if (existingNews === 0) {
    await prisma.newsItem.createMany({
      data: [
        {
          title: "Fire Training",
          content: "Back in 2016 our engineers have taken a fire training course.\r\n\r\n​The course taken consists of 9 hours training including practical test having to put out a live fire in a fire extinguisher training Unit.\r\n\r\nThis training will allow our engineers to become familiar with operating an extinguisher and to gain the knowledge of types of fire and which extinguishers to use in varying circumstances. This will allow our engineers to be confident in using extinguishers and fire blankets should the situation arise.\r\n",
          imageUrl: "/uploads/news/1777448001777-didns-90365d_696a32b5a30149b1a1d300994488e3admv2.jpg",
          featured: true,
        },
        {
          title: "Apprentice of The Year",
          content: "Our Directors attended a Hull College in 2016 apprentice of the year award ceremony on behalf of our 2 apprentices Zackary Williams & John Marshall.\r\n\r\nBoth apprentices are taking their training with JTL. Zackary who has been an apprentice of Neville Tucker Services for 2 Years is looking to accomplish his NVQ level 2 in Plumbing & Heating, John Marshall is working towards level 2 in Electrical Engineering and both have proven to us to be dedicated and hardworking employees.\r\n\r\n​Very well done to you both !",
          imageUrl: "/uploads/news/1777448061059-284abd-90365d_afffe58dbf9b4f51b886b56c0957787amv2.jpg",
          featured: true,
        },
        {
          title: "Work Experience",
          content: "16 year old Jordan Rushton from Wolfreton School has been on a 1 week work experience programme with Neville Tucker Services working alongside our electrical engineer, this will allow him adapt to an engineering working environment and give him hands on experience using tools.\r\n\r\n​This is a valuable learning experience for Jordan and will stand him in good stead for the future.",
          imageUrl: "/uploads/news/1777448092498-7ppiv7-90365d_bf4f1c26590b4be5bd4fedb6729ba283mv2.jpg",
          featured: true,
        },
        {
          title: "British Grand Prix",
          content: "2016 will mark our 17th attendance at the British Grand Prix to provide on site support for all the Mechanical services based at the famous Silverstone Circuit, this will be our 2nd year of looking after the Silverstone Wing which is the recently built epicenter for race control, pits and the press.\r\n\r\n​The whole site transforms from a sparsely occupied site with only maintenance staff and administration staff using the facilities to that of a small town with hundreds of thousands of people using the facilities. This puts an incredible strain on water supplies, drainage and temperature control. Forward planning and rapid response keeps this discreetly all under control and our 24/7 attendance of this event can be hectic.\r\n\r\n​Long may it continue!",
          imageUrl: "/uploads/news/1777454836652-f8mrcp-90365d_3c99cb92c3f9420e9edacb3a91046eb3mv2 (1).jpg",
          featured: true,
        },
        {
          title: "Heating Service",
          content: "Has your Domestic/Commercial Heating system recently been serviced ready for the autumn/winter?\r\n\r\n​A lot of us do not think about servicing our heating system until the cold weather hits us, and then as soon as we turn on the heating, it doesn't work.\r\n\r\nWhy not give us a call on 01482 838080 and we will be happy to provide you with a free quotation and we can arrange a service to be booked in with our qualified engineers.",
          imageUrl: "/uploads/news/1777454864191-wkwj-90365d_e85477b955034e0a89878c69360bad8fmv2.jpg",
          featured: true,
        },
        {
          title: "Prostate Cancer",
          content: "Our engineer Matt Walton will be climbing Ben Nevis on Sunday 25th September to raise awareness of Prostate Cancer and in the loving memory of his dad who died of Prostate Cancer in December 2015.\r\n\r\n​\"It would really mean a lot to us if you could dig deep and help us to raise as much as possible in support of such a worthy cause!\r\n\r\nThank you in advance and we hope to do you, and of course Dad/Wally proud!\" – Matt Walton\r\n\r\n​From all staff of Neville Tucker Services Ltd, we wish you all the best of luck!",
          imageUrl: "/uploads/news/1777454912976-31xkg6-90365d_f068e89675564c7e82bed3c61d2b7cf3mv2.jpg",
          featured: true,
        },
        {
          title: "Accredited RPZ Valve Inspector",
          content: "NTS Ltd is now an accredited approved inspector for RPZ valves, which allows us to carry out tests under the WRAS Advisory standards.\r\n\r\n​RPZ stands for Reduced Pressure Zone. This device is installed onto some plumbing systems to protect drinking water and the city water supply from contaminants.\r\n\r\nRPZ valves are required when a house or building is equipped with an irrigation system, fire suppression system, or a large boiler (hereinafter referred to as Systems). Contaminants can enter an irrigation system from fertilizer or pesticides that are sprayed onto lawns. In the case of a boiler or fire suppression system, water sits stagnant or trapped in these systems, which leads to a build-up of bacteria and increased mineral content from the piping system.\r\n\r\nTo book in or request a quote please do not hesitate to contact us.",
          imageUrl: "/uploads/news/1777454943955-olu1ma-90365d_73e6af1dd53547edb38462dc0908e541mv2 (1).png",
          featured: true,
        },
        {
          title: "Silverstone 2020 – British GP and 70th Anniversary GP",
          content: "This was our 21st Year maintaining the HVRAC across several venues at Silverstone Circuit. However, due to Covid-19, the GP2020 has proven to be one of the more challenging. Thanks to Andrew Sykes for providing additional ventilation fans.",
          imageUrl: "/uploads/news/1777454975524-zfnkvu-90365d_4397709f387e4780b1609c17d11544a3mv2.jpg",
          featured: true,
        },
        {
          title: "Our First Electric Vehicle",
          content: "Our First Vehicle type = SAIC Maxus eDeliver 3\r\n\r\nWe are cautiously entering into the electric vehicle market, to monitor how electrics vehicles fit in with our way of operation. We will talk about this further when we have gained more experience and roll this out further if we feel this is the right way to go. We are keen to reduce our carbon footprint, time will tell if this is the right action to take, personally we believe hydrogen gas maybe the answer in the long-term, either by fuel cell or form of combustion",
          imageUrl: "/uploads/news/1777455023077-16fnlb-img-Electric-Vehicle (2).jpg",
          featured: true,
        },
      ],
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
