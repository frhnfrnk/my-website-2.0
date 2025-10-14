/**
 * Database Seed Script
 * Run: npm run db:seed
 *
 * Populates database with sample data for:
 * - Projects
 * - Experience
 * - Tech Stack
 * - Sections (Hero/About/Contact)
 * - Admin User
 */

// Load environment variables from .env.local FIRST before any imports
import { config } from "dotenv";
import { resolve } from "path";

// Load .env.local explicitly BEFORE importing db modules
const envPath = resolve(process.cwd(), ".env.local");
config({ path: envPath });

// Log to verify env is loaded
console.log("📄 Loading .env.local from:", envPath);
console.log("✅ MONGODB_URI loaded:", process.env.MONGODB_URI ? "Yes" : "No");
console.log("✅ ADMIN_EMAIL loaded:", process.env.ADMIN_EMAIL || "(not set)");

import { hash } from "bcryptjs";
import { connectDB, disconnectDB } from "../lib/db";
import { Project, Experience, Tech, Section, User } from "../lib/models";

async function seed() {
  try {
    console.log("🌱 Starting database seed...\n");

    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await Promise.all([
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Tech.deleteMany({}),
      Section.deleteMany({}),
      User.deleteMany({}),
    ]);
    console.log("✅ Cleared\n");

    // ============================================
    // Seed Projects
    // ============================================
    console.log("📦 Seeding projects...");
    const projects = await Project.insertMany([
      {
        slug: "ai-saas-platform",
        title: "AI SaaS Platform",
        summary:
          "Full-stack AI-powered SaaS application with subscription management",
        description: `A comprehensive AI-powered SaaS platform built with modern web technologies. 
        
Features include:
- User authentication and authorization
- Subscription management with Stripe
- AI-powered content generation
- Real-time data processing
- Admin dashboard with analytics
- Responsive design for all devices

The platform demonstrates advanced Next.js patterns including server components, server actions, and optimistic UI updates.`,
        stack: [
          "Next.js",
          "TypeScript",
          "Tailwind CSS",
          "MongoDB",
          "Stripe",
          "OpenAI",
        ],
        cover:
          "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
        links: {
          demo: "https://ai-saas-demo.vercel.app",
          repo: "https://github.com/username/ai-saas-platform",
        },
        featured: true,
        order: 1,
        publishedAt: new Date("2024-01-15"),
        updatedAt: new Date(),
      },
      {
        slug: "defi-dashboard",
        title: "DeFi Analytics Dashboard",
        summary:
          "Real-time cryptocurrency and DeFi protocol analytics dashboard",
        description: `A powerful analytics dashboard for tracking DeFi protocols and cryptocurrency markets.
        
Key features:
- Real-time price tracking
- Portfolio management
- Gas fee optimization
- Multi-chain support (Ethereum, Polygon, BSC)
- Advanced charting with TradingView
- Web3 wallet integration

Built with performance in mind using React Server Components and edge functions.`,
        stack: [
          "Next.js",
          "React",
          "Web3.js",
          "Ethers.js",
          "Chart.js",
          "PostgreSQL",
        ],
        cover:
          "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800",
        links: {
          demo: "https://defi-dashboard-demo.vercel.app",
          repo: "https://github.com/username/defi-dashboard",
        },
        featured: true,
        order: 2,
        publishedAt: new Date("2023-11-20"),
        updatedAt: new Date(),
      },
      {
        slug: "task-management-app",
        title: "Collaborative Task Manager",
        summary: "Team task management with real-time collaboration",
        description: `Modern task management application with real-time collaboration features.
        
Features:
- Real-time updates with WebSockets
- Drag-and-drop task boards
- Team collaboration
- File attachments
- Activity tracking
- Email notifications

Uses optimistic UI updates for instant feedback and offline support.`,
        stack: [
          "Next.js",
          "TypeScript",
          "Prisma",
          "PostgreSQL",
          "Socket.io",
          "Redis",
        ],
        cover:
          "https://images.unsplash.com/photo-1611224885990-ab7363d1f2b4?w=800",
        links: {
          demo: "https://task-manager-demo.vercel.app",
        },
        featured: false,
        order: 3,
        publishedAt: new Date("2023-08-10"),
        updatedAt: new Date(),
      },
    ]);
    console.log(`✅ Seeded ${projects.length} projects\n`);

    // ============================================
    // Seed Experience
    // ============================================
    console.log("💼 Seeding experience...");
    const experiences = await Experience.insertMany([
      {
        slug: "senior-fullstack-engineer",
        company: "TechCorp Solutions",
        role: "Senior Full-Stack Engineer",
        period: {
          from: "2022-06",
          to: undefined, // Current position
        },
        location: "Remote",
        bullets: [
          "Led development of microservices architecture serving 100K+ daily active users",
          "Implemented CI/CD pipeline reducing deployment time by 60%",
          "Mentored 5 junior developers and conducted code reviews",
          "Migrated monolithic application to Next.js App Router architecture",
          "Improved Core Web Vitals scores by 40% through optimization",
        ],
        stack: ["Next.js", "TypeScript", "Node.js", "MongoDB", "AWS", "Docker"],
        link: "https://techcorp.example.com",
        order: 1,
        updatedAt: new Date(),
      },
      {
        slug: "frontend-developer",
        company: "Startup Inc",
        role: "Frontend Developer",
        period: {
          from: "2020-03",
          to: "2022-05",
        },
        location: "Jakarta, Indonesia",
        bullets: [
          "Built responsive web applications using React and Next.js",
          "Collaborated with designers to implement pixel-perfect UIs",
          "Integrated RESTful APIs and GraphQL endpoints",
          "Optimized application performance and SEO",
          "Participated in agile development sprints",
        ],
        stack: ["React", "Next.js", "JavaScript", "Tailwind CSS", "GraphQL"],
        order: 2,
        updatedAt: new Date(),
      },
      {
        slug: "web-developer-intern",
        company: "Digital Agency",
        role: "Web Developer Intern",
        period: {
          from: "2019-06",
          to: "2020-02",
        },
        location: "Jakarta, Indonesia",
        bullets: [
          "Developed landing pages and marketing websites",
          "Learned modern web development practices",
          "Worked with WordPress and custom PHP applications",
          "Assisted in client meetings and requirement gathering",
        ],
        stack: ["HTML", "CSS", "JavaScript", "PHP", "WordPress"],
        order: 3,
        updatedAt: new Date(),
      },
    ]);
    console.log(`✅ Seeded ${experiences.length} experience entries\n`);

    // ============================================
    // Seed Tech Stack
    // ============================================
    console.log("⚙️  Seeding tech stack...");
    const techStack = await Tech.insertMany([
      // Frontend
      {
        key: "nextjs",
        name: "Next.js",
        category: "frontend",
        website: "https://nextjs.org",
        order: 1,
      },
      {
        key: "react",
        name: "React",
        category: "frontend",
        website: "https://react.dev",
        order: 2,
      },
      {
        key: "typescript",
        name: "TypeScript",
        category: "frontend",
        website: "https://typescriptlang.org",
        order: 3,
      },
      {
        key: "tailwindcss",
        name: "Tailwind CSS",
        category: "frontend",
        website: "https://tailwindcss.com",
        order: 4,
      },

      // Backend
      {
        key: "nodejs",
        name: "Node.js",
        category: "backend",
        website: "https://nodejs.org",
        order: 1,
      },
      {
        key: "express",
        name: "Express.js",
        category: "backend",
        website: "https://expressjs.com",
        order: 2,
      },
      {
        key: "nestjs",
        name: "NestJS",
        category: "backend",
        website: "https://nestjs.com",
        order: 3,
      },

      // Database
      {
        key: "mongodb",
        name: "MongoDB",
        category: "db",
        website: "https://mongodb.com",
        order: 1,
      },
      {
        key: "postgresql",
        name: "PostgreSQL",
        category: "db",
        website: "https://postgresql.org",
        order: 2,
      },
      {
        key: "redis",
        name: "Redis",
        category: "db",
        website: "https://redis.io",
        order: 3,
      },
      {
        key: "prisma",
        name: "Prisma",
        category: "db",
        website: "https://prisma.io",
        order: 4,
      },

      // Web3
      {
        key: "ethers",
        name: "Ethers.js",
        category: "web3",
        website: "https://docs.ethers.org",
        order: 1,
      },
      {
        key: "web3js",
        name: "Web3.js",
        category: "web3",
        website: "https://web3js.org",
        order: 2,
      },
      {
        key: "solidity",
        name: "Solidity",
        category: "web3",
        website: "https://soliditylang.org",
        order: 3,
      },

      // Tools
      {
        key: "git",
        name: "Git",
        category: "tools",
        website: "https://git-scm.com",
        order: 1,
      },
      {
        key: "docker",
        name: "Docker",
        category: "tools",
        website: "https://docker.com",
        order: 2,
      },
      {
        key: "aws",
        name: "AWS",
        category: "tools",
        website: "https://aws.amazon.com",
        order: 3,
      },
      {
        key: "vercel",
        name: "Vercel",
        category: "tools",
        website: "https://vercel.com",
        order: 4,
      },
    ]);
    console.log(`✅ Seeded ${techStack.length} tech items\n`);

    // ============================================
    // Seed Sections
    // ============================================
    console.log("📄 Seeding sections...");
    const sections = await Section.insertMany([
      {
        key: "hero",
        title: "Full-Stack Developer",
        subtitle: "Building modern web applications with Next.js & Web3",
        body: "I create fast, scalable, and user-friendly applications using cutting-edge technologies.",
        updatedAt: new Date(),
      },
      {
        key: "about",
        title: "About Me",
        subtitle: "Passionate about creating amazing digital experiences",
        body: `Hi! I'm a full-stack developer specializing in React, Next.js, and blockchain technologies. 
        
With over 4 years of experience, I've worked on diverse projects ranging from SaaS platforms to DeFi applications. I'm passionate about writing clean code, optimizing performance, and delivering exceptional user experiences.

When I'm not coding, you can find me contributing to open-source projects, writing technical articles, or exploring the latest web technologies.`,
        updatedAt: new Date(),
      },
      {
        key: "contact",
        title: "Get In Touch",
        subtitle: "Have a project in mind? Let's talk!",
        body: "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.",
        updatedAt: new Date(),
      },
    ]);
    console.log(`✅ Seeded ${sections.length} sections\n`);

    // ============================================
    // Seed Admin User
    // ============================================
    console.log("👤 Creating admin user...");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123456";
    const passwordHash = await hash(adminPassword, 12);

    const adminUser = await User.create({
      email: process.env.ADMIN_EMAIL || "admin@example.com",
      passwordHash,
      role: "admin",
      createdAt: new Date(),
    });
    console.log(`✅ Admin user created: ${adminUser.email}\n`);

    console.log("🎉 Seed completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - Projects: ${projects.length}`);
    console.log(`   - Experience: ${experiences.length}`);
    console.log(`   - Tech Stack: ${techStack.length}`);
    console.log(`   - Sections: ${sections.length}`);
    console.log(`   - Admin User: 1`);
    console.log(`\n🔑 Admin Credentials:`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Password: ${adminPassword}`);
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

// Run seed
seed();
