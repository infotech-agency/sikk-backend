import "dotenv/config";
import mongoose from "mongoose";
import connectDB from "../config/db.js";

import Service from "../models/Service.js";
import Job from "../models/Job.js";
import Project from "../models/Project.js";
import About from "../models/About.js";
import Contact from "../models/Contact.js";

/**
 * Seeds the database with realistic sample data for local development.
 * NOTE: This intentionally does NOT seed Cloudinary image uploads — the
 * service/project image fields are left blank so the API still works
 * without Cloudinary credentials being configured.
 *
 * Run with:  npm run seed
 */

const services = [
  {
    title: "Project Management Consultancy",
    description:
      "Comprehensive consultancy services covering every phase of project delivery, from concept to commissioning.",
    keyCapabilities: ["Project Planning", "Cost Control", "Risk Management", "Quality Assurance"],
  },
  {
    title: "Civil Engineering",
    description:
      "End-to-end civil engineering services for highways, bridges, industrial and residential structures.",
    keyCapabilities: ["Structural Design", "Site Investigation", "Construction Management"],
  },
  {
    title: "Infrastructure Development",
    description:
      "Large-scale infrastructure delivery including roads, railways, water systems and urban utilities.",
    keyCapabilities: ["Highway Construction", "Utility Networks", "Urban Planning"],
  },
];

const jobs = [
  {
    designation: "Site Engineer",
    jobTitle: "Senior Site Engineer",
    location: "Delhi",
    employmentType: "Full Time",
    jobDescription:
      "Responsible for project execution at the site, coordinating with subcontractors and ensuring quality and timeline compliance.",
    requirements: ["B.Tech Civil", "3+ Years Experience", "AutoCAD Knowledge"],
  },
  {
    designation: "Project Manager",
    jobTitle: "Project Manager - Infrastructure",
    location: "Mumbai",
    employmentType: "Full Time",
    jobDescription:
      "Lead large infrastructure projects end-to-end, managing cost, quality, safety and stakeholder communication.",
    requirements: ["B.Tech/M.Tech Civil", "8+ Years Experience", "PMP Certification"],
  },
  {
    designation: "Civil Intern",
    jobTitle: "Graduate Engineering Trainee",
    location: "Bangalore",
    employmentType: "Internship",
    jobDescription:
      "Support senior engineers with surveying, drawings and documentation on active construction sites.",
    requirements: ["Final-year B.Tech Civil", "Eagerness to learn", "AutoCAD basics"],
  },
];

const projects = [
  {
    projectTitle: "NH-44 Highway Widening",
    location: "Delhi - Agra, Uttar Pradesh",
    clientName: "National Highways Authority of India",
    projectValue: "INR 1,250 Crores",
    category: "Infrastructure",
    status: "Completed",
    projectDescription:
      "Major six-lane highway widening project covering 200 km including service roads, underpasses and toll plazas.",
    featured: true,
  },
  {
    projectTitle: "Smart City Utility Upgrade",
    location: "Pune, Maharashtra",
    clientName: "Pune Municipal Corporation",
    projectValue: "INR 450 Crores",
    category: "Government",
    status: "Ongoing",
    projectDescription:
      "Modernisation of water supply, drainage and street lighting across 12 wards under the Smart Cities Mission.",
    featured: false,
  },
  {
    projectTitle: "Industrial Township Phase II",
    location: "Sanand, Gujarat",
    clientName: "Gujarat Industrial Development Corporation",
    projectValue: "INR 720 Crores",
    category: "Industrial",
    status: "Ongoing",
    projectDescription:
      "Development of a 350-acre industrial township with roads, effluent treatment and power distribution.",
    featured: true,
  },
];

const about = {
  title: "Building India's Future",
  description: "Engineering and infrastructure excellence delivered with integrity for over two decades.",
  mission: "Deliver world-class infrastructure that empowers communities and advances the nation.",
  vision: "To be India's most trusted infrastructure partner, transforming lives for generations.",
  values: ["Integrity", "Innovation", "Quality", "Safety", "Sustainability"],
};

const contacts = [
  {
    name: "Aarav Sharma",
    email: "aarav@example.com",
    phone: "9876543210",
    subject: "Partnership enquiry",
    message: "We are an equipment supplier interested in partnering on your Pune project.",
  },
  {
    name: "Priya Nair",
    email: "priya@example.com",
    phone: "9123456780",
    subject: "Bid clarification",
    message: "Could you share the pre-qualification criteria for the Sanand township tender?",
  },
];

const run = async () => {
  await connectDB();

  console.log("🌱 Clearing existing seed collections...");
  await Promise.all([
    Service.deleteMany({}),
    Job.deleteMany({}),
    Project.deleteMany({}),
    About.deleteMany({}),
    Contact.deleteMany({}),
  ]);

  console.log("🌱 Inserting seed data...");
  await Service.insertMany(services);
  await Job.insertMany(jobs);
  await Project.insertMany(projects);
  await About.create(about);
  await Contact.insertMany(contacts);

  console.log("✅ Seed complete!");
  console.log(
    `   Services: ${services.length}, Jobs: ${jobs.length}, Projects: ${projects.length}, Contacts: ${contacts.length}`
  );

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
