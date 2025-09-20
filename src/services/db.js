import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "id, title, slug, status, order, preferredSkills, experience, roles",
  candidates: "++id, name, email, stage, jobId, notes",
  assessments: "++id, jobId, sections",
  responses: "++id, jobId, candidateId, date"
});

// Expanded question bank with 30 unique questions per role family
const jobSpecificQuestions = {
  "Frontend-Developer": {
    "Assessment 1": [
      "What is the difference between `let`, `const`, and `var`?", "Explain the concept of the virtual DOM in React.", "Describe the box model in CSS.", "What are Promises and how do they work?", "How would you handle state management in a large React application?", "What is the purpose of the `useEffect` hook?", "Provide an example of a responsive navigation bar using Flexbox.", "What are semantic HTML tags and why are they important?", "Explain the concept of closures in JavaScript.", "Describe the difference between `==` and `===`."
    ],
    "Assessment 2": [
      "What is the CSS `specificity` and how is it calculated?", "Explain the difference between `null` and `undefined`.", "What are higher-order components (HOCs) in React?", "Describe event delegation in JavaScript.", "What is tree shaking in the context of web development?", "How do you optimize a website's assets for faster loading?", "What is the purpose of the `useMemo` hook in React?", "Explain what ARIA roles are and why they are used.", "What is prop drilling in React and how can you avoid it?", "Describe the `async/await` syntax and its benefits."
    ],
    "Assessment 3": [
      "What are Progressive Web Apps (PWAs)?", "Explain the concept of Server-Side Rendering (SSR) and its pros/cons.", "Describe how the browser rendering path works.", "What is Webpack and what is its main purpose?", "How does CSS Grid Layout differ from Flexbox?", "What is a pure component in React?", "Explain cross-site scripting (XSS) and how to prevent it.", "What is the `this` keyword in JavaScript and how does its value change?", "Describe the key features of ES6 (ECMAScript 2015).", "How would you implement internationalization (i18n) in a React app?"
    ]
  },
  "Backend-Developer": {
    "Assessment 1": [
      "Describe the difference between SQL and NoSQL databases.", "What is middleware in the context of Express.js?", "Explain the principles of RESTful API design.", "How do you handle authentication and authorization in a Node.js application?", "What is database indexing and why is it important?", "Describe a scenario for using a message queue like RabbitMQ.", "What are environment variables and why are they used?", "Explain the concept of Object-Relational Mapping (ORM).", "How would you secure sensitive API keys and credentials?", "What is the Node.js event loop?"
    ],
    "Assessment 2": [
      "What is the difference between stateless and stateful authentication?", "Explain the CAP theorem in distributed systems.", "What are the benefits of using a containerization technology like Docker?", "Describe different types of database joins (INNER, LEFT, RIGHT, FULL).", "What is dependency injection?", "How do you prevent SQL injection attacks?", "Explain the concept of caching and different caching strategies.", "What is the purpose of a reverse proxy like Nginx?", "Describe the difference between vertical and horizontal scaling.", "What are WebSockets and when are they preferable to HTTP?"
    ],
    "Assessment 3": [
      "What is a microservices architecture?", "Explain the concept of idempotency in API design.", "What is gRPC and how does it differ from REST?", "Describe how you would implement rate limiting for an API.", "What is database sharding?", "Explain the publisher/subscriber (pub/sub) pattern.", "What are the security risks associated with JWTs (JSON Web Tokens)?", "Describe the process of a TLS/SSL handshake.", "How do you handle graceful shutdowns in a Node.js application?", "What is ACID compliance in databases?"
    ]
  },
  "FullStack-Developer": {
    "Assessment 1": ["Explain the client-server architecture.", "What is CORS?", "Describe your deployment process.", "How do you structure a MERN project?", "What is a JWT?", "Explain SSR vs CSR.", "How do you integrate a third-party API?", "How do you ensure data consistency?", "What are WebSockets?", "Discuss monolithic vs. microservices."],
    "Assessment 2": ["What is GraphQL?", "Describe the OAuth 2.0 flow.", "How do you manage environment variables for different stages?", "What is the role of a CDN?", "Explain CI/CD in a full-stack context.", "How do you optimize database queries?", "What are cookies and local storage?", "Describe HTTPS.", "What is test-driven development (TDD)?", "How do you handle application logging?"],
    "Assessment 3": ["What is serverless architecture?", "Explain the principles of Twelve-Factor App.", "How do you implement a robust search feature?", "Discuss data migration strategies.", "What is an N+1 query problem?", "How do you handle background jobs?", "What are the challenges of state management in a full-stack app?", "Describe a canary deployment.", "What is Infrastructure as Code (IaC)?", "How do you ensure code quality across a full-stack team?"]
  },
  "UI-UX-Designer": {
    "Assessment 1": ["Describe your design process.", "Wireframe vs. Mockup vs. Prototype?", "Importance of user research?", "What are principles of user-centered design?", "How do you ensure accessibility (a11y)?", "How do you handle difficult design feedback?", "What is a design system?", "Which design tools are you proficient in?", "How do you conduct usability testing?", "Present a portfolio piece."],
    "Assessment 2": ["What are user personas?", "Explain Jakob's Law.", "What is information architecture?", "Describe the heuristic evaluation process.", "What is the difference between UI and UX?", "How do you create a user journey map?", "What is atomic design?", "Explain the concept of cognitive load.", "How do you collaborate with developers?", "What are dark patterns in UX?"],
    "Assessment 3": ["What is the Kano model?", "How do you design for multiple platforms?", "Explain the concept of emotional design.", "What is A/B testing in design?", "How do you measure the success of a design?", "What is a style guide?", "Describe a time you solved a complex UX problem.", "What is Hick's Law?", "How do you stay updated with design trends?", "What are microinteractions?"]
  },
  "DevOps-Engineer": {
    "Assessment 1": ["CI vs. CD vs. CD?", "What is Infrastructure as Code (IaC)?", "Docker vs. VM?", "Describe a typical CI/CD pipeline.", "How do you monitor an application in production?", "What is Kubernetes?", "Role of Ansible or Puppet?", "How do you manage secrets?", "Experience with AWS, GCP, or Azure?", "What is a blue-green deployment?"],
    "Assessment 2": ["What is a container orchestrator?", "Explain declarative vs. imperative pipelines.", "What is GitOps?", "How do you manage logs in a distributed system?", "What is a service mesh like Istio?", "Describe Terraform and its state file.", "How do you implement disaster recovery?", "What are SLOs, SLIs, and SLAs?", "Explain the concept of 'shifting left' in security.", "What is Chaos Engineering?"],
    "Assessment 3": ["What is a sidecar pattern in Kubernetes?", "How do you set up a VPC from scratch?", "Explain the role of a container registry.", "Describe how to secure a Docker container.", "What are Helm charts?", "How does autoscaling work in Kubernetes?", "What is the difference between a rolling update and a canary release?", "How do you troubleshoot a failing pod in Kubernetes?", "What is the role of Prometheus and Grafana?", "How do you manage costs in a cloud environment?"]
  },
  "Data-Analyst": {
    "Assessment 1": ["JOIN vs. UNION in SQL?", "What does a p-value represent?", "Describe a project using data to drive decisions.", "How do you handle missing data?", "Which Python visualization libraries do you know?", "Purpose of A/B testing?", "Write a SQL query for top 5 customers by sales.", "Structured vs. unstructured data?", "How do you ensure data quality?", "Explain ETL (Extract, Transform, Load)."],
    "Assessment 2": ["What are window functions in SQL?", "Explain the difference between correlation and causation.", "What is a Key Performance Indicator (KPI)?", "Describe the process of data cleaning.", "What is a histogram and when is it used?", "Explain regression analysis.", "How would you create a dashboard for business stakeholders?", "What is data normalization?", "Describe the central limit theorem.", "What is Python's pandas library used for?"],
    "Assessment 3": ["What is cohort analysis?", "Explain what a time series analysis is.", "How do you detect outliers in a dataset?", "What is the difference between a data warehouse and a data lake?", "Describe a LEFT JOIN.", "What is sentiment analysis?", "How would you present findings to a non-technical audience?", "What is a conditional probability?", "Write a SQL query using a Common Table Expression (CTE).", "What is statistical significance?"]
  },
  "Product-Manager": {
    "Assessment 1": ["How do you prioritize features?", "How do you gather user feedback?", "Agile vs. Waterfall?", "What is product-market fit?", "How do you measure product success?", "How do you handle disagreements with engineering?", "What is an MVP?", "How do you conduct competitor analysis?", "Role of a PM in a Scrum team?", "What is your favorite product and how would you improve it?"],
    "Assessment 2": ["What are OKRs (Objectives and Key Results)?", "Describe the RICE scoring model.", "How do you write effective user stories?", "What is a product backlog grooming session?", "How do you say 'no' to a stakeholder request?", "What is a go-to-market strategy?", "Describe the product lifecycle.", "What is the difference between a product vision and a product strategy?", "How do you build a product roadmap?", "What are vanity metrics?"],
    "Assessment 3": ["Explain the 'Jobs to Be Done' framework.", "How do you manage technical debt from a product perspective?", "Describe a time you had to pivot a product strategy.", "What is a North Star metric?", "How do you work with marketing and sales teams?", "What is a user persona?", "How do you validate a product idea before building it?", "Describe a failed product or feature you worked on and what you learned.", "How do you define an API as a product?", "What is the role of data in your product decisions?"]
  }
};

// A new, expanded list of 25 unique job profiles
const jobProfiles = [
  // Frontend Family
  { title: "Frontend Developer", category: "Frontend-Developer", preferredSkills: "HTML, CSS, JavaScript, React", experience: "2+ years", roles: "Build and maintain user interfaces for web applications." },
  { title: "React Developer", category: "Frontend-Developer", preferredSkills: "React, Redux, Next.js, TypeScript", experience: "3+ years", roles: "Specialize in building complex, stateful applications with React." },
  { title: "Vue.js Engineer", category: "Frontend-Developer", preferredSkills: "Vue.js, Vuex, Nuxt.js, JavaScript", experience: "2+ years", roles: "Develop interactive front-end features using the Vue.js framework." },
  { title: "UI Engineer", category: "Frontend-Developer", preferredSkills: "UI/UX Principles, CSS-in-JS, Storybook, Figma", experience: "3+ years", roles: "Bridge the gap between design and development, focusing on UI components." },
  // Backend Family
  { title: "Backend Developer", category: "Backend-Developer", preferredSkills: "Node.js, Express, Python, SQL", experience: "2+ years", roles: "Develop server-side logic, APIs, and database integrations." },
  { title: "Node.js Developer", category: "Backend-Developer", preferredSkills: "Node.js, Express, Koa, MongoDB", experience: "3+ years", roles: "Build scalable network applications using the Node.js runtime." },
  { title: "Python/Django Developer", category: "Backend-Developer", preferredSkills: "Python, Django, Flask, PostgreSQL", experience: "3+ years", roles: "Create robust web applications and APIs using Python and Django." },
  { title: "API Engineer", category: "Backend-Developer", preferredSkills: "REST, GraphQL, API Gateways, OpenAPI", experience: "4+ years", roles: "Design, build, and maintain high-performance APIs." },
  // FullStack Family
  { title: "Full-Stack Developer", category: "FullStack-Developer", preferredSkills: "React, Node.js, SQL, AWS", experience: "3+ years", roles: "Work on both the client and server sides of an application." },
  { title: "MERN Stack Developer", category: "FullStack-Developer", preferredSkills: "MongoDB, Express, React, Node.js", experience: "2+ years", roles: "Specialize in the MERN (MongoDB, Express, React, Node) stack." },
  // UI/UX Family
  { title: "UI/UX Designer", category: "UI-UX-Designer", preferredSkills: "Figma, Adobe XD, User Research", experience: "2+ years", roles: "Design user-friendly interfaces and improve overall user experience." },
  { title: "Product Designer", category: "UI-UX-Designer", preferredSkills: "Prototyping, User Testing, Design Systems", experience: "4+ years", roles: "Oversee the entire design process of a product from concept to launch." },
  { title: "UX Researcher", category: "UI-UX-Designer", preferredSkills: "Surveys, Interviews, Usability Testing", experience: "3+ years", roles: "Conduct research to understand user behaviors, needs, and motivations." },
  // DevOps Family
  { title: "DevOps Engineer", category: "DevOps-Engineer", preferredSkills: "AWS, Docker, Kubernetes, CI/CD", experience: "3+ years", roles: "Automate and streamline the software development and release process." },
  { title: "Cloud Architect (AWS)", category: "DevOps-Engineer", preferredSkills: "AWS, Terraform, IaC, System Design", experience: "5+ years", roles: "Design and implement scalable, secure, and robust cloud infrastructure." },
  { title: "Site Reliability Engineer (SRE)", category: "DevOps-Engineer", preferredSkills: "Monitoring, Prometheus, Go, Kubernetes", experience: "4+ years", roles: "Focus on application reliability, latency, and performance." },
  { title: "CI/CD Specialist", category: "DevOps-Engineer", preferredSkills: "Jenkins, GitHub Actions, GitLab CI", experience: "3+ years", roles: "Build and maintain continuous integration and deployment pipelines." },
  // Data Family
  { title: "Data Analyst", category: "Data-Analyst", preferredSkills: "SQL, Excel, Tableau, Python", experience: "2+ years", roles: "Analyze data to identify trends and provide actionable insights." },
  { title: "Data Scientist", category: "Data-Analyst", preferredSkills: "Python, R, Machine Learning, Statistics", experience: "4+ years", roles: "Build predictive models and perform complex statistical analysis." },
  { title: "Business Intelligence (BI) Analyst", category: "Data-Analyst", preferredSkills: "Power BI, SQL, Data Warehousing", experience: "3+ years", roles: "Create dashboards and reports to help businesses make better decisions." },
  { title: "SQL Developer", category: "Data-Analyst", preferredSkills: "Advanced SQL, Stored Procedures, ETL", experience: "3+ years", roles: "Design, manage, and query complex relational databases." },
  { title: "Machine Learning Engineer", category: "Data-Analyst", preferredSkills: "TensorFlow, PyTorch, Scikit-learn", experience: "4+ years", roles: "Deploy and maintain machine learning models in production." },
  // Product Family
  { title: "Product Manager", category: "Product-Manager", preferredSkills: "Agile, Jira, Roadmapping", experience: "3+ years", roles: "Define product strategy and guide products from conception to launch." },
  { title: "Technical Product Manager", category: "Product-Manager", preferredSkills: "APIs, System Architecture, Agile", experience: "5+ years", roles: "Work closely with engineering teams on highly technical products." },
  { title: "Agile Coach / Scrum Master", category: "Product-Manager", preferredSkills: "Scrum, Kanban, Coaching", experience: "4+ years", roles: "Facilitate agile processes and coach teams to improve their practices." }
];

// Lists of names for generating realistic candidates
const firstNames = ["Aisha", "Bao", "Chen", "Darnell", "Elena", "Fatima", "Gabriel", "Hiroshi", "Isabella", "Javier", "Katerina", "Liam", "Mei", "Nkechi", "Omar", "Priya", "Quentin", "Rafa", "Sofia", "Tariq", "Uma", "Viktor", "Wei", "Ximena", "Yara", "Zane", "Ananya", "Ben", "Chloe", "David", "Emily", "Finn", "Grace", "Henry", "Ivy", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia", "Penelope", "Ryan", "Sophia", "Thomas", "William", "Zoe", "Ali", "Fatima", "Maria"];
const lastNames = ["Khan", "Chen", "Smith", "Rodriguez", "García", "Kim", "Nguyen", "Lee", "Patel", "Singh", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Martinez", "Robinson", "Clark", "Lewis", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips"];

export async function seedData() {
  try {
    const jobCount = await db.jobs.count();
    if (jobCount > 0) return; // Already seeded

    // 1. Seed 25 unique jobs from the new profiles
    const jobs = jobProfiles.map((job, i) => ({
      id: i + 1,
      title: job.title,
      category: job.category,
      slug: job.title.toLowerCase().replace(/\s+/g, "-").replace(/[()/]/g, ''),
      status: "active",
      order: i,
      preferredSkills: job.preferredSkills,
      experience: job.experience,
      roles: job.roles
    }));
    await db.jobs.bulkAdd(jobs);
   
    // 2. Seed 1000 unique candidates
    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
    const candidates = Array.from({ length: 1000 }).map((_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
      // Append index 'i' to guarantee email uniqueness
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@example.com`;
      
      return {
        name,
        email,
        stage: stages[Math.floor(Math.random() * stages.length)],
        jobId: Math.floor(Math.random() * 25) + 1,
        notes: []
      };
    });
    await db.candidates.bulkAdd(candidates);

    // 3. Seed 3 unique assessments for each of the 25 jobs
    const assessments = [];
    const questionTypes = ["short-text", "long-text", "numeric", "single-choice", "multi-choice", "file"];
    
    jobs.forEach(job => {
      // Use the job's category to find the correct set of question banks
      const questionSetsForJob = jobSpecificQuestions[job.category] || {};
      
      for (let a = 1; a <= 3; a++) {
        const assessmentKey = `Assessment ${a}`;
        const questionsForThisAssessment = questionSetsForJob[assessmentKey] || [];
        
        const sections = [{
          title: assessmentKey,
          questions: Array.from({ length: 10 }).map((_, qIdx) => {
            const type = questionTypes[qIdx % questionTypes.length];
            return {
              id: Date.now() + Math.random(),
              type,
              text: questionsForThisAssessment[qIdx] || `Generic Question ${qIdx + 1} for ${assessmentKey}`,
              options: type.includes("choice") ? ["Option A", "Option B", "Option C"] : undefined
            };
          })
        }];
        assessments.push({ jobId: job.id, sections });
      }
    });

    await db.assessments.bulkAdd(assessments);
    console.log("✅ All data seeded: 25 jobs, 1000 candidates, 75 assessments.");

  } catch (err) {
    console.error("Seeding error:", err);
  }
}