import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(1).stores({
  jobs: "id, title, slug, status, order, preferredSkills, experience, roles",
  candidates: "++id, name, email, stage, jobId, notes",
  assessments: "++id, jobId, sections",
  responses: "++id, jobId, candidateId, date"
});

// Expanded question bank with 30 unique questions per role family and per specific job title
const jobSpecificQuestions = {
  // --- START: NEW JOB TITLE SPECIFIC QUESTIONS ---
  "React Developer": {
    "Assessment 1": ["What is JSX and how does it differ from HTML?", "Explain React's reconciliation process.", "Describe the difference between a class component and a functional component.", "What are React Hooks?", "How do you pass data between components?", "What is the significance of the `key` prop in lists?", "What is the Context API?", "How would you optimize performance in a React application?", "What is `prop drilling` and how can you avoid it?", "Describe error boundaries in React."]
  },
  "Vue.js Engineer": {
    "Assessment 1": ["What is the Vue instance lifecycle?", "Explain the reactivity system in Vue 2 vs. Vue 3.", "What are computed properties and watchers?", "Describe the difference between `v-if` and `v-show`.", "How does Vue's templating syntax work?", "What are Vue slots and when would you use them?", "Explain state management with Pinia or Vuex.", "What is a single-file component (.vue)?", "How do you handle custom events in Vue?", "What are mixins and composables?"]
  },
  "Node.js Developer": {
    "Assessment 1": ["What is the Node.js event loop and how does it work?", "Explain the difference between `require` and `import/export`.", "What are streams in Node.js and why are they useful?", "Describe the middleware pattern in Express.js.", "How do you handle asynchronous operations in Node.js?", "What is the purpose of `package.json` and `package-lock.json`?", "How can you debug a Node.js application?", "What is RESTful API design?", "Explain how to handle errors in an Express application.", "What are environment variables and why are they important?"]
  },
  "Python/Django Developer": {
      "Assessment 1": ["Explain the MVT (Model-View-Template) architecture in Django.", "What is the Django ORM and what are its benefits?", "Describe the purpose of `manage.py`.", "How does Django's request-response cycle work?", "What is middleware in Django?", "Explain the difference between a project and an app in Django.", "What are Django Migrations?", "How do you handle user authentication in Django?", "What are Django signals?", "Describe how to use the Django template language."]
  },
  "Cloud Architect (AWS)": {
      "Assessment 1": ["What is the AWS Well-Architected Framework?", "Explain the difference between an Availability Zone and a Region.", "Describe a scenario for using AWS Lambda.", "What is the purpose of a VPC in AWS?", "Compare and contrast S3, EBS, and EFS.", "How does AWS Auto Scaling work?", "What is IAM and why is it important for security?", "Describe the role of Amazon CloudWatch.", "What is Infrastructure as Code (IaC) and how is it implemented in AWS?", "Explain a blue-green deployment strategy on AWS."]
  },
  "Site Reliability Engineer (SRE)": {
      "Assessment 1": ["What is the difference between SRE and DevOps?", "Define SLO, SLI, and SLA.", "What is a postmortem and what are its key components?", "Explain the concept of 'toil' in SRE.", "How do you measure and improve system reliability?", "What is Chaos Engineering?", "Describe a monitoring stack you have used (e.g., Prometheus, Grafana).", "What is the purpose of a service mesh like Istio or Linkerd?", "How do you manage secrets in a distributed system?", "Explain the concept of 'error budgets'."]
  },
  // --- END: NEW JOB TITLE SPECIFIC QUESTIONS ---

  // Category-level questions as fallbacks
  "Frontend-Developer": {
    "Assessment 1": [
      "What is the difference between `let`, `const`, and `var`?", "Explain the concept of the virtual DOM in React.", "Describe the box model in CSS.", "What are Promises and how do they work?", "How would you handle state management in a large React application?", "What is the purpose of the `useEffect` hook?", "Provide an example of a responsive navigation bar using Flexbox.", "What are semantic HTML tags and why are they important?", "Explain the concept of closures in JavaScript.", "Describe the difference between `==` and `===`."
    ]
  },
  "Backend-Developer": {
    "Assessment 1": [
      "Describe the difference between SQL and NoSQL databases.", "What is middleware in the context of Express.js?", "Explain the principles of RESTful API design.", "How do you handle authentication and authorization in a Node.js application?", "What is database indexing and why is it important?", "Describe a scenario for using a message queue like RabbitMQ.", "What are environment variables and why are they used?", "Explain the concept of Object-Relational Mapping (ORM).", "How would you secure sensitive API keys and credentials?", "What is the Node.js event loop?"
    ]
  },
  "FullStack-Developer": {
    "Assessment 1": ["Explain the client-server architecture.", "What is CORS?", "Describe your deployment process.", "How do you structure a MERN project?", "What is a JWT?", "Explain SSR vs CSR.", "How do you integrate a third-party API?", "How do you ensure data consistency?", "What are WebSockets?", "Discuss monolithic vs. microservices."]
  },
  "UI-UX-Designer": {
    "Assessment 1": ["Describe your design process.", "Wireframe vs. Mockup vs. Prototype?", "Importance of user research?", "What are principles of user-centered design?", "How do you ensure accessibility (a11y)?", "How do you handle difficult design feedback?", "What is a design system?", "Which design tools are you proficient in?", "How do you conduct usability testing?", "Present a portfolio piece."]
  },
  "DevOps-Engineer": {
    "Assessment 1": ["CI vs. CD vs. CD?", "What is Infrastructure as Code (IaC)?", "Docker vs. VM?", "Describe a typical CI/CD pipeline.", "How do you monitor an application in production?", "What is Kubernetes?", "Role of Ansible or Puppet?", "How do you manage secrets?", "Experience with AWS, GCP, or Azure?", "What is a blue-green deployment?"]
  },
  "Data-Analyst": {
    "Assessment 1": ["JOIN vs. UNION in SQL?", "What does a p-value represent?", "Describe a project using data to drive decisions.", "How do you handle missing data?", "Which Python visualization libraries do you know?", "Purpose of A/B testing?", "Write a SQL query for top 5 customers by sales.", "Structured vs. unstructured data?", "How do you ensure data quality?", "Explain ETL (Extract, Transform, Load)."]
  },
  "Product-Manager": {
    "Assessment 1": ["How do you prioritize features?", "How do you gather user feedback?", "Agile vs. Waterfall?", "What is product-market fit?", "How do you measure product success?", "How do you handle disagreements with engineering?", "What is an MVP?", "How do you conduct competitor analysis?", "Role of a PM in a Scrum team?", "What is your favorite product and how would you improve it?"]
  }
};

// Job-category-specific base questions to ensure variety and relevance.
const jobCategoryBaseQuestions = {
  // --- START: NEW JOB TITLE SPECIFIC QUESTIONS ---
  "React Developer": [
    { type: "short-text", text: "Which React state management library do you prefer (e.g., Redux, Zustand)?" },
    { type: "long-text", text: "Describe a custom Hook you have built and the problem it solved." },
    { type: "numeric", text: "On a scale of 1 to 10, how would you rate your experience with Next.js?" },
    { type: "single-choice", text: "For CSS in a React project, what is your preferred approach?", options: ["CSS Modules", "Styled-components", "Tailwind CSS", "Sass/SCSS"] },
    { type: "multi-choice", text: "Which of these testing libraries for React have you used?", options: ["Jest", "React Testing Library", "Cypress", "Enzyme"] },
    { type: "file", text: "Please provide a link to a React project you are proud of." }
  ],
  "Vue.js Engineer": [
      { type: "short-text", text: "Which version of Vue do you have the most experience with (2 or 3)?" },
      { type: "long-text", text: "Explain the benefits of the Composition API in Vue 3." },
      { type: "numeric", text: "On a scale of 1 to 10, how would you rate your experience with Nuxt.js?" },
      { type: "single-choice", text: "For state management in Vue, what is your preferred library?", options: ["Vuex", "Pinia", "Built-in reactivity", "Other"] },
      { type: "multi-choice", text: "Which of these UI component libraries for Vue have you used?", options: ["Vuetify", "Quasar", "PrimeVUE", "Element Plus"] },
      { type: "file", text: "Please provide a link to a Vue project you are proud of." }
  ],
  "Node.js Developer": [
    { type: "short-text", text: "Which web framework for Node.js are you most proficient with (e.g., Express, Fastify)?" },
    { type: "long-text", text: "Describe a scenario where you would use WebSockets over traditional HTTP requests." },
    { type: "numeric", text: "On a scale of 1 to 10, how would you rate your experience with TypeScript in a Node.js project?" },
    { type: "single-choice", text: "For a new Node.js project, which package manager do you prefer?", options: ["npm", "yarn", "pnpm"] },
    { type: "multi-choice", text: "Which of these ORMs or query builders have you used with Node.js?", options: ["Prisma", "Sequelize", "TypeORM", "Knex.js"] },
    { type: "file", text: "Please upload a code snippet showing how you handle asynchronous error handling." }
  ],
  // --- END: NEW JOB TITLE SPECIFIC QUESTIONS ---

  // Category-level questions as fallbacks
  "Frontend-Developer": [
    { type: "short-text", text: "Which CSS framework are you most comfortable with (e.g., Tailwind, Bootstrap)?" },
    { type: "long-text", text: "Describe your process for ensuring a web application is accessible (a11y)." },
    { type: "numeric", text: "On a scale of 1 to 10, how would you rate your JavaScript proficiency?" },
    { type: "single-choice", text: "Which frontend framework do you prefer for a new project?", options: ["React", "Vue", "Angular", "Svelte", "Other"] },
    { type: "multi-choice", text: "Which of these state management libraries have you used?", options: ["Redux", "MobX", "Zustand", "Vuex", "Pinia"] },
    { type: "file", text: "Please provide a link to your GitHub profile or a live project you built." }
  ],
  "Backend-Developer": [
    { type: "short-text", text: "What is your primary backend programming language?" },
    { type: "long-text", text: "Explain a time you had to design an API from scratch. What were your key considerations?" },
    { type: "numeric", text: "How many microservices have you deployed to production?" },
    { type: "single-choice", text: "Which type of database are you more experienced with?", options: ["SQL (e.g., PostgreSQL)", "NoSQL (e.g., MongoDB)"] },
    { type: "multi-choice", text: "Which of these have you used for containerization or orchestration?", options: ["Docker", "Kubernetes", "Podman", "Nomad"] },
    { type: "file", text: "Please upload a diagram of a system architecture you designed or contributed to." }
  ],
  "UI-UX-Designer": [
    { type: "short-text", text: "Which design tool (e.g., Figma, Adobe XD) are you most proficient in?" },
    { type: "long-text", text: "Describe a project where user research significantly changed the final product." },
    { type: "numeric", text: "How many usability tests have you conducted in the past year?" },
    { type: "single-choice", text: "What is your favorite part of the design process?", options: ["User Research", "Wireframing", "Prototyping", "Visual Design"] },
    { type: "multi-choice", text: "Which of these UX research methods have you employed?", options: ["User Interviews", "Surveys", "A/B Testing", "Card Sorting"] },
    { type: "file", text: "Please upload your design portfolio (PDF or link)." }
  ],
  "DevOps-Engineer": [
    { type: "short-text", text: "Which cloud provider (AWS, GCP, Azure) do you have the most experience with?" },
    { type: "long-text", text: "Describe a CI/CD pipeline you built. What were the stages and tools used?" },
    { type: "numeric", text: "On a scale of 1-10, how comfortable are you with Infrastructure as Code (IaC)?" },
    { type: "single-choice", text: "What is your preferred configuration management tool?", options: ["Ansible", "Puppet", "Chef", "SaltStack", "None"] },
    { type: "multi-choice", text: "Which of these monitoring tools have you used?", options: ["Prometheus", "Grafana", "Datadog", "New Relic"] },
    { type: "file", text: "Please provide an example of a script (e.g., Bash, Python) you wrote for automation." }
  ],
  "Data-Analyst": [
    { type: "short-text", text: "Which data visualization tool (e.g., Tableau, Power BI) are you best at?" },
    { type: "long-text", text: "Describe a time you found a critical insight in a dataset that led to a business decision." },
    { type: "numeric", text: "How many years of professional SQL experience do you have?" },
    { type: "single-choice", text: "What is your preferred language for data analysis?", options: ["Python", "R", "SQL", "Excel"] },
    { type: "multi-choice", text: "Which of these statistical concepts have you applied in your work?", options: ["Regression Analysis", "Hypothesis Testing", "Clustering", "Time Series Analysis"] },
    { type: "file", text: "Please upload a dashboard or report you created (anonymized data)." }
  ],
  "Product-Manager": [
    { type: "short-text", text: "What's your favorite product and why?" },
    { type: "long-text", text: "Describe a time you had to say 'no' to a feature request from an important stakeholder." },
    { type: "numeric", text: "How many products have you managed from conception to launch?" },
    { type: "single-choice", text: "Which prioritization framework do you use most often?", options: ["RICE", "MoSCoW", "Kano Model", "Value vs. Effort"] },
    { type: "multi-choice", text: "Which of these agile ceremonies have you led?", options: ["Sprint Planning", "Daily Stand-up", "Sprint Review", "Retrospective"] },
    { type: "file", text: "Please provide a link to a product roadmap you have created." }
  ],
  "Default": [
    { type: "short-text", text: "What is your primary area of expertise?" },
    { type: "long-text", text: "Describe a challenging technical project you've worked on and your role in it." },
    { type: "numeric", text: "How many years of relevant experience do you have in this field?" },
    { type: "single-choice", text: "What is your preferred work environment?", options: ["Fast-paced startup", "Established enterprise", "Mid-sized company"] },
    { type: "multi-choice", text: "Which of these soft skills are your strongest? (Select up to three)", options: ["Communication", "Teamwork", "Problem-solving", "Leadership", "Adaptability"] },
    { type: "file", text: "Please upload your resume." }
  ]
};


const jobProfiles = [
  // ... (job profiles remain unchanged)
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
  { title: "Technical Product Manager", category: "Product-Manager", preferredSkills: "APIs, System Architecture, Agile", experience: "5+ years", roles: "Work. closely with engineering teams on highly technical products." },
  { title: "Agile Coach / Scrum Master", category: "Product-Manager", preferredSkills: "Scrum, Kanban, Coaching", experience: "4+ years", roles: "Facilitate agile processes and coach teams to improve their practices." }
];

const firstNames = ["Aisha", "Bao", "Chen", "Darnell", "Elena", "Fatima", "Gabriel", "Hiroshi", "Isabella", "Javier", "Katerina", "Liam", "Mei", "Nkechi", "Omar", "Priya", "Quentin", "Rafa", "Sofia", "Tariq", "Uma", "Viktor", "Wei", "Ximena", "Yara", "Zane", "Ananya", "Ben", "Chloe", "David", "Emily", "Finn", "Grace", "Henry", "Ivy", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia", "Penelope", "Ryan", "Sophia", "Thomas", "William", "Zoe", "Ali", "Fatima", "Maria"];
const lastNames = ["Khan", "Chen", "Smith", "Rodriguez", "García", "Kim", "Nguyen", "Lee", "Patel", "Singh", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Martinez", "Robinson", "Clark", "Lewis", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez", "Roberts", "Turner", "Phillips"];

// Helper function to shuffle an array
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function seedData() {
  try {
    const jobCount = await db.jobs.count();
    if (jobCount > 0) return;

    // 1. Seed Jobs
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
   
    // 2. Seed Candidates
    const stages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
    const candidates = Array.from({ length: 1000 }).map((_, i) => {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${firstName} ${lastName}`;
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

    // 3. Seed Assessments with job-title-specific, varied question types
    const assessments = [];
    
    jobs.forEach(job => {
      // Create 3 separate assessments for the job.
      for (let a = 1; a <= 3; a++) {
        // FIX: All question generation logic is now INSIDE this loop to ensure uniqueness.
        
        // Find the appropriate question text banks, falling back from title to category.
        const titleBank = jobSpecificQuestions[job.title];
        const categoryBank = jobSpecificQuestions[job.category];
        
        let specificQuestionTexts = [];
        const assessmentKey = `Assessment ${a}`;

        // Try to get texts for Assessment 1, 2, or 3. If not found, fall back to Assessment 1.
        if (titleBank && titleBank[assessmentKey]) {
            specificQuestionTexts = titleBank[assessmentKey];
        } else if (categoryBank && categoryBank[assessmentKey]) {
            specificQuestionTexts = categoryBank[assessmentKey];
        } else if (titleBank && titleBank['Assessment 1']) {
            specificQuestionTexts = titleBank['Assessment 1'];
        } else if (categoryBank && categoryBank['Assessment 1']) {
            specificQuestionTexts = categoryBank['Assessment 1'];
        }

        // Get the base questions, falling back from title to category to a default set.
        const baseQuestionsTemplate = jobCategoryBaseQuestions[job.title] || jobCategoryBaseQuestions[job.category] || jobCategoryBaseQuestions.Default;
        const baseQuestionsForJob = JSON.parse(JSON.stringify(baseQuestionsTemplate));
        
        const additionalQuestions = specificQuestionTexts.slice(0, 4).map(text => ({
            type: "long-text",
            text,
            options: undefined
        }));

        let finalQuestions = [...baseQuestionsForJob, ...additionalQuestions];
        finalQuestions = shuffle(finalQuestions);

        // Assign unique IDs to every question for THIS assessment instance.
        finalQuestions.forEach(q => {
            q.id = Date.now() + Math.random();
        });

        const sections = [{
          title: `Assessment ${a}`,
          questions: finalQuestions
        }];
        assessments.push({ jobId: job.id, sections });
      }
    });

    await db.assessments.bulkAdd(assessments);
    console.log("✅ All data seeded: 25 jobs, 1000 candidates, 75 assessments with job-title-specific questions.");

  } catch (err)
 {
    console.error("Seeding error:", err);
  }
}
