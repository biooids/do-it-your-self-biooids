// src/lib/data/expanded-tags.ts

const existingTechStack: string[] = [
  // The user's original list of 150+ tech tags...
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Angular",
  "Svelte",
  "Vue.js",
  "Next.js",
  "Nuxt.js",
  "Bootstrap",
  "Tailwind CSS",
  "Material UI",
  "Chakra UI",
  "Emotion",
  "SCSS",
  "LESS",
  "Styled Components",
  "JQuery",
  "Node.js",
  "Express",
  "NestJS",
  "Koa",
  "Hapi",
  "Django",
  "Flask",
  "Ruby on Rails",
  "Spring Boot",
  "FastAPI",
  "Laravel",
  "ASP.NET Core",
  "Phoenix Framework",
  "MongoDB",
  "PostgreSQL",
  "MySQL",
  "SQLite",
  "MariaDB",
  "Firebase Firestore",
  "Cassandra",
  "DynamoDB",
  "Redis",
  "Oracle DB",
  "Elasticsearch",
  "Couchbase",
  "ArangoDB",
  "ClickHouse",
  "TimescaleDB",
  "MERN",
  "PERN",
  "MEAN",
  "JAMstack",
  "Python",
  "Java",
  "C#",
  "C++",
  "Go",
  "Kotlin",
  "Swift",
  "Rust",
  "PHP",
  "Ruby",
  "Perl",
  "Scala",
  "R",
  "Matlab",
  "Dart",
  "Docker",
  "Kubernetes",
  "AWS",
  "Azure",
  "Google Cloud",
  "Netlify",
  "Vercel",
  "DigitalOcean",
  "Firebase",
  "Terraform",
  "Ansible",
  "Chef",
  "Puppet",
  "Jenkins",
  "GitHub Actions",
  "CircleCI",
  "TravisCI",
  "CapRover",
  "Rancher",
  "Cloudron",
  "Portainer",
  "Webpack",
  "Parcel",
  "Gulp",
  "Grunt",
  "Rollup",
  "Babel",
  "ESLint",
  "Prettier",
  "Storybook",
  "Electron",
  "Three.js",
  "D3.js",
  "Socket.IO",
  "Swagger",
  "Postman",
  "GraphQL",
  "REST API",
  "gRPC",
  "Figma",
  "Adobe XD",
  "Nx",
  "Turborepo",
  "Git",
  "GitHub",
  "GitLab",
  "Bitbucket",
  "Mercurial",
  "CI/CD",
  "SVN",
  "Jest",
  "Mocha",
  "Chai",
  "Cypress",
  "Puppeteer",
  "Playwright",
  "Testing Library",
  "Enzyme",
  "Selenium",
  "JUnit",
  "RSpec",
  "PyTest",
  "Vitest",
  "TensorFlow",
  "PyTorch",
  "scikit-learn",
  "Keras",
  "Pandas",
  "NumPy",
  "Matplotlib",
  "Seaborn",
  "OpenCV",
  "Hugging Face",
  "Apache Spark",
  "MLFlow",
  "React Native",
  "Flutter",
  "Ionic",
  "SwiftUI",
  "Xamarin",
  "Cordova",
  "Kivy",
  "Unity",
  "Unreal Engine",
  "Godot",
  "GameMaker Studio",
  "Solidity",
  "Ethereum",
  "Hyperledger",
  "Polkadot",
  "Truffle",
  "Hardhat",
  "Web3.js",
  "Ethers.js",
  "ChatGPT API",
  "OpenAI API",
  "Google Dialogflow",
  "Microsoft Bot Framework",
  "Amazon Lex",
  "LangChain",
  "Anthropic API",
  "Redux",
  "MobX",
  "Apollo",
  "Relay",
  "RxJS",
  "Recoil",
  "XState",
  "Zustand",
  "SWR",
  "React Query",
  "Formik",
  "Zod",
  "Yup",
  "Validator.js",
  "Prisma",
  "Sequelize",
  "TypeORM",
  "MikroORM",
  "Hibernate",
  "Entity Framework",
  "ActiveRecord",
  "Doctrine ORM",
  "SQLAlchemy",
  "Mongoose",
  "Drizzle ORM",
  "Knex.js",
  "Objection.js",
  "Hasura",
  "EdgeDB",
  "Supabase ORM",
  "Heroku",
  "Google Cloud Platform (GCP)",
  "Microsoft Azure",
  "Cloudflare Pages",
  "Firebase Hosting",
  "Render",
  "Railway",
  "Linode",
  "Kinsta",
  "Hostinger",
  "Hetzner",
  "Scaleway",
  "Kamatera",
  "UpCloud",
  "Lightsail",
  "IONOS",
  "Contabo",
  "Vultr",
  "OVHcloud",
  "DreamHost",
  "A2 Hosting",
];

// New UI libraries and component frameworks
const newUILibraries: string[] = [
  "shadcn/ui",
  "Daisy UI",
  "Radix UI",
  "Headless UI",
  "Ant Design",
  "Mantine",
  "NextUI",
  "Aceternity UI",
];

// New general, business, and finance tags
const generalAndBusinessTags: string[] = [
  // Finance & Crypto
  "Bitcoin",
  "Blockchain",
  "DeFi",
  "NFTs",
  "Investing",
  "Personal Finance",
  "Venture Capital",
  "Fintech",
  "Stock Market",

  // Business & Startups
  "Startups",
  "Entrepreneurship",
  "SaaS",
  "Product Management",
  "Marketing",
  "Growth Hacking",
  "SEO",
  "Leadership",
  "Productivity",
  "Side Hustle",
  "Remote Work",
  "Bootstrapping",

  // General Topics & Lifestyle
  "Technology",
  "Science",
  "Health",
  "Fitness",
  "Travel",
  "Future Tech",
  "Space",
  "Gaming",
  "Tutorial",
  "Beginner Guide",
  "Career Advice",

  // Design
  "UI Design",
  "UX Design",
  "Web Design",
  "Design Systems",
  "Framer",
];

// Combine all arrays and use a Set to automatically remove any duplicates
const combinedTags = [
  ...existingTechStack,
  ...newUILibraries,
  ...generalAndBusinessTags,
];
const uniqueTags = [...new Set(combinedTags)];

// Sort the final list alphabetically for easy searching
uniqueTags.sort((a, b) => a.localeCompare(b));

export const allTags = uniqueTags;
