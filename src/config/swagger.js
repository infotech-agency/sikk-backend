import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Infrastructure API",
      version: "1.0.0",
      description:
        "Production-ready Node.js / Express backend for an infrastructure & engineering company. " +
        "Includes CRUD for Services, Jobs, Projects, About, Career applications and Contact inquiries, " +
        "plus Cloudinary uploads, validation, pagination, search and dashboard stats.",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {},
    },
    tags: [
      { name: "Services", description: "CRUD for company services" },
      { name: "Jobs", description: "CRUD for job postings" },
      { name: "Projects", description: "CRUD for projects (hero + gallery images)" },
      { name: "About", description: "Singleton About Us record" },
      { name: "Careers", description: "Job applications with resume upload" },
      { name: "Contact", description: "Contact form inquiries" },
      { name: "Dashboard", description: "Dashboard statistics" },
    ],
  },
  apis: [
    "./src/controllers/*.js",
    "./src/routes/*.js",
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
