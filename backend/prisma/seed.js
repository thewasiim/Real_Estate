import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing records
  await prisma.favorite.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.property.deleteMany();
  await prisma.project.deleteMany();
  await prisma.agent.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.user.deleteMany();

  console.log('🧹 Cleaned existing database tables.');

  // 2. Create Admin & Test User
  const adminPasswordHash = await bcrypt.hash('Admin@123456', 10);
  const userPasswordHash = await bcrypt.hash('User@123456', 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'F.B. Developer Curator',
      email: 'admin@fbdeveloper.in',
      passwordHash: adminPasswordHash,
      phone: '+91 98765 00000',
      role: 'ADMIN',
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      passwordHash: userPasswordHash,
      phone: '+91 98200 12345',
      role: 'USER',
    },
  });

  console.log('👤 Created Users: admin@fbdeveloper.in and aarav@example.com');

  // 3. Create Agents
  const agent1 = await prisma.agent.create({
    data: {
      name: 'Rohan Mehta',
      photoUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80',
      phone: '+91 98210 99887',
      whatsapp: '+919821099887',
      email: 'rohan.m@fbdeveloper.in',
      role: 'Senior Luxury Specialist',
      city: 'Mumbai',
      experienceYears: 12,
    },
  });

  const agent2 = await prisma.agent.create({
    data: {
      name: 'Priya Nambiar',
      photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
      phone: '+91 98111 44556',
      whatsapp: '+919811144556',
      email: 'priya.n@fbdeveloper.in',
      role: 'Private Advisory Partner',
      city: 'Delhi NCR',
      experienceYears: 9,
    },
  });

  const agent3 = await prisma.agent.create({
    data: {
      name: 'Vikramaditya Roy',
      photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
      phone: '+91 99000 88776',
      whatsapp: '+919900088776',
      email: 'vikram.r@fbdeveloper.in',
      role: 'Coastal Estate Director',
      city: 'Goa',
      experienceYears: 15,
    },
  });

  console.log('💼 Created 3 Luxury Agents.');

  // 4. Create Properties
  const properties = [
    {
      slug: 'the-sky-penthouse-worli',
      title: 'The Sky Penthouse at Worli Sea Face',
      type: 'Apartment',
      listingType: 'BUY',
      status: 'Ready to Move',
      price: 450000000, // 45 Cr
      city: 'Mumbai',
      locality: 'Worli',
      address: 'Sea Face Promenade, Worli, Mumbai 400030',
      area: 6800,
      areaUnit: 'sqft',
      bhk: 4,
      bathrooms: 5,
      parking: 4,
      furnishing: 'Fully Furnished',
      amenities: ['Private Infinity Pool', 'Sea View', 'Private Elevator', 'Concierge Service', 'Gym', 'Automated Home Automation'],
      images: [
        'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      ],
      floorPlans: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'],
      description: 'An architectural masterpiece hovering above the Arabian Sea. Panoramic 360-degree skyline views, private plunge pool on the deck, and double-height ceiling grand salon.',
      nearbySchools: ['Aditya Birla World Academy', 'Dhirubhai Ambani International'],
      nearbyHospitals: ['Jaslok Hospital', 'Hinduja Hospital'],
      nearbyMetro: ['Worli Metro Station (5 mins)'],
      lat: 19.0176,
      lng: 72.8152,
      isFeatured: true,
      popularityScore: 98,
      agentId: agent1.id,
    },
    {
      slug: 'villa-solaris-assagao',
      title: 'Villa Solaris - Heritage Luxury Estate',
      type: 'Villa',
      listingType: 'BUY',
      status: 'Ready to Move',
      price: 185000000, // 18.5 Cr
      city: 'Goa',
      locality: 'Assagao',
      address: 'Badem Road, Assagao, North Goa 403507',
      area: 5200,
      areaUnit: 'sqft',
      bhk: 5,
      bathrooms: 6,
      parking: 3,
      furnishing: 'Semi-Furnished',
      amenities: ['Private Garden', 'Swimming Pool', 'Staff Quarters', 'Solar Power System', 'Gated Security'],
      images: [
        'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      ],
      floorPlans: [],
      description: 'Restored Indo-Portuguese estate enveloped by lush teak trees. Features private courtyard, temperature-controlled lap pool, and bespoke stone masonry.',
      nearbySchools: ['Sharada Mandir School'],
      nearbyHospitals: ['Manipal Hospital Goa'],
      nearbyMetro: ['Mopa Airport (25 mins)'],
      lat: 15.5901,
      lng: 73.7734,
      isFeatured: true,
      popularityScore: 94,
      agentId: agent3.id,
    },
    {
      slug: 'lumina-manor-golf-course-road',
      title: 'Lumina Manor Sky Residence',
      type: 'Apartment',
      listingType: 'BUY',
      status: 'Under Construction',
      price: 280000000, // 28 Cr
      city: 'Delhi NCR',
      locality: 'Golf Course Road, Gurgaon',
      address: 'Sector 54, Golf Course Road, Gurugram 122002',
      area: 5800,
      areaUnit: 'sqft',
      bhk: 4,
      bathrooms: 4,
      parking: 3,
      furnishing: 'Unfurnished',
      amenities: ['Golf Course View', 'Clubhouse', 'Tennis Court', 'Spa & Wellness', 'Helipad Access'],
      images: [
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
      ],
      floorPlans: [],
      description: 'Ultra-luxury condominium directly overlooking the DLF Golf Course. Floor-to-ceiling double-glazed glass facades and VRV air conditioning system.',
      nearbySchools: ['The Heritage School', 'Lancer International'],
      nearbyHospitals: ['Fortis Memorial Research Institute'],
      nearbyMetro: ['Sector 54 Rapid Metro (2 mins)'],
      lat: 28.4392,
      lng: 77.1025,
      isFeatured: true,
      popularityScore: 91,
      agentId: agent2.id,
    },
    {
      slug: 'the-sanctuary-juhu',
      title: 'The Sanctuary - Beachside Duplex',
      type: 'Apartment',
      listingType: 'RENT',
      status: 'Ready to Move',
      price: 1200000, // 12 Lakhs/month
      city: 'Mumbai',
      locality: 'Juhu',
      address: 'Juhu Tara Road, Mumbai 400049',
      area: 4100,
      areaUnit: 'sqft',
      bhk: 3,
      bathrooms: 4,
      parking: 2,
      furnishing: 'Fully Furnished',
      amenities: ['Direct Beach Access', 'Private Deck', '24/7 Security', 'Gym', 'Valet Parking'],
      images: [
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      ],
      floorPlans: [],
      description: 'Exclusive beachside sanctuary in prime Juhu. Direct private pathway to the sands of Juhu beach and curated Italian furniture throughout.',
      nearbySchools: ['Jamnabai Narsee School'],
      nearbyHospitals: ['Nanavati Max Super Speciality Hospital'],
      nearbyMetro: ['DN Nagar Metro Station (10 mins)'],
      lat: 19.1075,
      lng: 72.8263,
      isFeatured: false,
      popularityScore: 88,
      agentId: agent1.id,
    },
  ];

  for (const p of properties) {
    await prisma.property.create({ data: p });
  }

  console.log(`🏡 Seeded ${properties.length} luxury properties.`);

  // 5. Create Projects
  const projects = [
    {
      slug: 'oberoi-sky-city-borivali',
      name: 'Oberoi Sky City enclave',
      builder: 'Oberoi Realty',
      startingPrice: 38000000,
      possessionDate: new Date('2027-12-31'),
      city: 'Mumbai',
      locality: 'Borivali East',
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80'],
      description: 'Spread over 25 acres of landscaped greens, offering integrated luxury living with a private shopping promenade.',
      amenities: ['Landscaped Gardens', 'Olympic Size Pool', 'Clubhouse', 'Badminton Courts'],
      unitTypes: ['3 BHK', '4 BHK Duplex'],
      statusStage: 'Under Construction',
    },
    {
      slug: 'dlf-the-camellias-gurgaon',
      name: 'DLF The Camellias',
      builder: 'DLF Luxury',
      startingPrice: 350000000,
      possessionDate: new Date('2025-06-30'),
      city: 'Delhi NCR',
      locality: 'Golf Course Road',
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
      description: 'Super-luxury residential project setting new benchmarks in architectural design and personalized concierge services.',
      amenities: ['Private Cigar Lounge', 'Heated Indoor Pool', 'Spa by Banyan Tree', 'Executive Helipad'],
      unitTypes: ['4 BHK', '5 BHK Penthouse'],
      statusStage: 'Ready',
    },
  ];

  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }

  console.log(`🏢 Seeded ${projects.length} iconic projects.`);

  // 6. Testimonials
  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Kabir & Sunaina Kapoor',
        photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        rating: 5,
        review: 'F.B. Developer provided an unmatched advisory experience. Finding our Worli oceanfront penthouse was seamless, confidential, and exceptionally refined.',
      },
      {
        name: 'Devraj Singhania',
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
        rating: 5,
        review: 'The discretion and depth of market insights shown by the F.B. Developer Private Office in acquiring our Goa villa was beyond standard brokerage.',
      },
    ],
  });

  // 7. Blog Posts
  await prisma.blogPost.createMany({
    data: [
      {
        slug: 'mumbai-luxury-real-estate-report-2026',
        title: 'Mumbai Luxury Real Estate Market Report 2026',
        coverUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
        excerpt: 'An analysis of prime sea-front capital values, ultra-HNW buyer migration, and upcoming coastal infrastructure.',
        content: 'Full report content on coastal road impacts and high-end rental yields in Bandra and Worli...',
        author: 'F.B. Developer Research Team',
      },
    ],
  });

  // 8. FAQs
  await prisma.fAQ.createMany({
    data: [
      {
        question: 'What is the process for scheduling a private site visit?',
        answer: 'You can request a visit directly from any property listing or via our Private Concierge desk. We arrange door-to-door luxury transport and dedicated property advisor presence.',
      },
      {
        question: 'Does F.B. Developer assist international Non-Resident Indians (NRIs)?',
        answer: 'Yes, our dedicated NRI Private Advisory desk manages complete legal compliance, cross-border remittance guidance, and property management post-acquisition.',
      },
    ],
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
