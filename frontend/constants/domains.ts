export const DOMAIN_TOOLKITS: Record<string, string[]> = {
    "AgTech Systems": ["IoT", "Python", "GIS", "Sensors", "Data Analytics", "Satellite Imaging", "Automation", "Remote Sensing", "SQL"],
    "API Design": ["Swagger", "Postman", "REST", "GraphQL", "gRPC", "OAuth2", "Node.js", "OpenAPI", "JSON"],
    "AR/VR Development": ["Unity", "C#", "Unreal Engine", "C++", "Blender", "ARCore", "ARKit", "WebGL", "3D Math"],
    "Artificial Intelligence": ["Python", "PyTorch", "TensorFlow", "Keras", "Scikit-Learn", "NLTK", "OpenCV", "Pandas", "Matplotlib"],
    "Backend Engineering": ["Go", "Node.js", "Python", "Redis", "Kafka", "PostgreSQL", "MongoDB", "Microservices", "GRPC"],
    "Big Data Architecture": ["Hadoop", "Spark", "Kafka", "Scala", "NoSQL", "Data Warehousing", "Hive", "Airflow", "AWS EMR"],
    "Bioinformatics": ["Python", "R", "Biopython", "BLAST", "Genomics", "Linux", "SQL", "Machine Learning", "Data Vis"],
    "Blockchain Development": ["Solidity", "Ether.js", "Hardhat", "Rust", "Web3.js", "IPFS", "Smart Contracts", "Cryptography", "Ethereum"],
    "Cloud Architecture": ["AWS", "Azure", "GCP", "Terraform", "Docker", "Kubernetes", "IAM", "VPC", "Serverless"],
    "Cloud Native Apps": ["Kubernetes", "Docker", "Helm", "Istio", "Prometheus", "Golang", "Microservices", "CI/CD", "AWS"],
    "Computer Science": ["Algorithms", "Data Structures", "C++", "Java", "Python", "OS Theory", "Networking", "Database Theory", "Math"],
    "Computer Vision": ["OpenCV", "PyTorch", "YOLO", "TensorFlow", "Image Processing", "CNNs", "Python", "C++", "Deep Learning"],
    "Cybersecurity": ["Kali Linux", "Nmap", "Metasploit", "Wireshark", "Burp Suite", "Python", "Bash", "SIEM", "Cryptography"],
    "Data Analytics": ["SQL", "Python", "Tableau", "PowerBI", "Excel", "Statistics", "R", "Data Cleaning", "Visualization"],
    "Data Engineering": ["Spark", "Airflow", "Kafka", "Python", "SQL", "AWS Glue", "Snowflake", "dbt", "Docker"],
    "Data Science": ["Python", "R", "SQL", "Pandas", "NumPy", "Statsmodels", "PowerBI", "Tableau", "Excel"],
    "Database Administration": ["MySQL", "PostgreSQL", "Oracle", "SQL Server", "Backup/Recovery", "Performance Tuning", "Replication", "Linux", "Shell Scripting"],
    "Deep Learning": ["PyTorch", "TensorFlow", "Keras", "Neural Networks", "Python", "CUDA", "CNNs", "RNNs", "Jupyter"],
    "DevOps": ["GitLab CI", "GitHub Actions", "Terraform", "Ansible", "Jenkins", "Kubernetes", "Prometheus", "Grafana", "Linux Admin"],
    "Distributed Systems": ["Go", "Java", "Kafka", "Kubernetes", "Consul", "gRPC", "Microservices", "System Design", "AWS"],
    "E-commerce Platforms": ["Shopify", "Magento", "WooCommerce", "Stripe", "Next.js", "React", "Node.js", "SQL", "Digital Marketing"],
    "Embedded Systems": ["C", "C++", "Microcontrollers", "RTOS", "IoT", "PCB Design", "ARM", "Linux", "Hardware"],
    "ERP Systems": ["SAP", "Oracle ERP", "SQL", "Business Logic", "Java", "Python", "Integration", "Reporting", "CRM"],
    "Fintech Systems": ["Java", "Python", "Security", "Blockchain", "Distributed Systems", "API Design", "Cryptography", "Payments Logic", "SQL"],
    "Frontend Engineering": ["React", "Vue", "Next.js", "CSS Grid", "Animations", "Tailwind", "Responsive Design", "Vite", "ESLint"],
    "Full-stack Dev": ["TypeScript", "Next.js", "Node.js", "PostgreSQL", "Prisma", "TailwindCSS", "Redux", "Docker", "Express"],
    "Game Development": ["Unity", "Unreal Engine", "C#", "C++", "Blender", "Game Physics", "3D Math", "Shaders", "Animation"],
    "GIS Systems": ["ArcGIS", "QGIS", "Python", "PostGIS", "GeoServer", "Spatial Analysis", "Mapping", "SQL", "Leaflet"],
    "HealthTech Systems": ["HL7", "FHIR", "Python", "Security", "Compliance (HIPAA)", "IoT", "Data Privacy", "EMR Integration", "SQL"],
    "Infrastructure Engineering": ["Terraform", "Ansible", "AWS", "Linux", "Networking", "Bash", "Python", "Docker", "Monitoring"],
    "IoT Systems": ["Arduino", "Raspberry Pi", "MQTT", "Python", "C++", "Sensors", "Networking", "Azure IoT", "Hardware"],
    "Machine Learning": ["Scikit-Learn", "Python", "Pandas", "NumPy", "TensorFlow", "Feature Engineering", "Model Deployment", "Jupyter", "Stats"],
    "ML Ops": ["MLflow", "Kubeflow", "DVC", "SageMaker", "Airflow", "Docker", "Weights & Biases", "FastAPI", "Prometheus"],
    "Mobile Apps": ["React Native", "Swift", "Kotlin", "Flutter", "Firebase", "App Store Connect", "Play Console", "SQLite", "GraphQL"],
    "Natural Language Processing": ["NLTK", "SpaCy", "Hugging Face", "Transformers", "Python", "PyTorch", "Linguistics", "Text Mining", "BERT"],
    "Network Security": ["Firewalls", "VPNs", "Cisco", "Wireshark", "IDS/IPS", "Linux", "Bash", "Topologies", "Protocols"],
    "Neural Networks": ["PyTorch", "Backpropagation", "Python", "Math/Calculus", "TensorFlow", "Deep Learning", "Optimization", "GPU", "Research"],
    "Quantum Computing": ["Qiskit", "Python", "Linear Algebra", "Physics", "Cirq", "Algorithms", "Quantum Mechanics", "Research", "Math"],
    "Robotics": ["ROS", "C++", "Python", "Control Systems", "Computer Vision", "Sensors", "Arduino", "Path Planning", "Linux"],
    "SaaS Development": ["Multi-tenancy", "AWS", "Stripe", "Next.js", "Node.js", "PostgreSQL", "Redis", "Auth0", "Docker"],
    "Site Reliability Engineering": ["Go", "Python", "Linux", "Monitoring", "Alerting", "Incident Response", "Terraform", "Kubernetes", "Networking"],
    "Software Engineering": ["Java", "C++", "C#", "System Design", "Algorithms", "PostgreSQL", "Unit Testing", "CI/CD", "Redis"],
    "Testing & QA": ["Selenium", "Cypress", "Jest", "Python", "Java", "Bug Tracking", "Automation", "Performance Testing", "API Testing"],
    "UI/UX Design": ["Figma", "Adobe XD", "Sketch", "Prototyping", "User Research", "Wireframing", "Principles of Design", "Auto Layout", "Design Systems"]
};

export const DOMAIN_CATEGORIES: Record<string, string> = {
    "Artificial Intelligence": "Data & AI", "Data Science": "Data & AI", "Machine Learning": "Data & AI",
    "Deep Learning": "Data & AI", "Computer Vision": "Data & AI", "Natural Language Processing": "Data & AI",
    "Neural Networks": "Data & AI", "ML Ops": "Data & AI", "Big Data Architecture": "Data & AI",
    "Data Engineering": "Data & AI", "Data Analytics": "Data & AI", "Bioinformatics": "Data & AI",

    "Backend Engineering": "Engineering", "Frontend Engineering": "Engineering", "Full-stack Dev": "Engineering",
    "Software Engineering": "Engineering", "Mobile Apps": "Engineering", "API Design": "Engineering",
    "Distributed Systems": "Engineering", "Testing & QA": "Engineering", "Computer Science": "Engineering",

    "Cloud Architecture": "Infrastructure", "Cloud Native Apps": "Infrastructure", "DevOps": "Infrastructure",
    "Site Reliability Engineering": "Infrastructure", "Cybersecurity": "Infrastructure", "Network Security": "Infrastructure",
    "Infrastructure Engineering": "Infrastructure", "Database Administration": "Infrastructure",

    "AgTech Systems": "Specialized", "Fintech Systems": "Specialized", "HealthTech Systems": "Specialized",
    "Blockchain Development": "Specialized", "IoT Systems": "Specialized", "Robotics": "Specialized",
    "AR/VR Development": "Specialized", "Quantum Computing": "Specialized", "Embedded Systems": "Specialized",
    "GIS Systems": "Specialized", "Game Development": "Specialized",

    "UI/UX Design": "Product", "SaaS Development": "Product", "E-commerce Platforms": "Product", "ERP Systems": "Product"
};

export const TECH_ECOSYSTEMS: Record<string, string[]> = {
    "Python": ["Django", "FastAPI", "Flask", "Pandas", "NumPy", "Scikit-Learn", "PyTorch", "Celery"],
    "JavaScript": ["React", "Vue", "Angular", "Node.js", "Express", "Next.js", "TypeScript", "Redux"],
    "TypeScript": ["NestJS", "Next.js", "React", "TypeORM", "Prisma", "tRPC", "Angular"],
    "React": ["Next.js", "Redux", "Zustand", "TailwindCSS", "Framer Motion", "React Query", "React Native"],
    "Node.js": ["Express", "NestJS", "Socket.io", "MongoDB", "PostgreSQL", "Redis", "Docker"],
    "Java": ["Spring Boot", "Hibernate", "Kafka", "Maven", "Gradle", "Android", "Kotlin"],
    "C#": [" .NET Core", "ASP.NET", "Entity Framework", "Azure", "Unity", "Blazor", "Xamarin"],
    "Go": ["Gin", "Echo", "Kubernetes", "gRPC", "Docker", "Prometheus", "Terraform"],
    "Rust": ["Actix", "Tokio", "Tauri", "Rocket", "WebAssembly", "Solana"],
    "SQL": ["PostgreSQL", "MySQL", "Redis", "Prisma", "TypeORM", "Database Design"],
    "NoSQL": ["MongoDB", "Cassandra", "DynamoDB", "Redis", "Firebase"],
    "Docker": ["Kubernetes", "AWS", "CI/CD", "Terraform", "Nginx", "Linux"],
    "AWS": ["Lambda", "EC2", "S3", "DynamoDB", "CloudFormation", "Terraform"],
    "Vue": ["Nuxt.js", "Pinia", "Vuex", "TailwindCSS", "Vite"],
    "Flutter": ["Dart", "Firebase", "Bloc", "Riverpod", "Android", "iOS"],
    "Swift": ["SwiftUI", "UIKit", "Combine", "CoreData", "XCode"],
    "Kotlin": ["Android Studio", "Jetpack Compose", "Coroutines", "Ktor", "Spring Boot"],
    "PHP": ["Laravel", "Symfony", "WordPress", "MySQL", "Composer"],
    "Ruby": ["Ruby on Rails", "Sidekiq", "PostgreSQL", "RSpec", "Heroku"],
    "HTML/CSS": ["TailwindCSS", "SASS", "Bootstrap", "JavaScript", "Figma"],
    "Git": ["GitHub", "GitLab", "CI/CD", "GitHub Actions"],
    "Linux": ["Bash", "Shell Scripting", "Vim", "Nginx", "Systemd"]
};

export const COMMON_ROLES = [
    "Software Engineer", "Senior Software Engineer", "Staff Engineer", "Principal Engineer",
    "Frontend Developer", "Senior Frontend Engineer", "UI Engineer", "Web Developer",
    "Backend Developer", "Senior Backend Engineer", "API Developer", "Java Developer",
    "Full Stack Developer", "Senior Full Stack Engineer", "Lead Developer", "Technical Lead",
    "DevOps Engineer", "Site Reliability Engineer (SRE)", "Cloud Architect", "Platform Engineer",
    "Data Scientist", "Senior Data Scientist", "Machine Learning Engineer", "AI Researcher",
    "Data Engineer", "Big Data Engineer", "Analytics Engineer", "Database Administrator",
    "Mobile Developer", "iOS Developer", "Android Developer", "React Native Developer",
    "Product Manager", "Technical Product Manager", "Product Owner", "Scrum Master",
    "UI/UX Designer", "Product Designer", "User Researcher", "UX Writer",
    "QA Engineer", "Automation Engineer", "SDET", "Manual Tester",
    "Security Engineer", "Cybersecurity Analyst", "Penetration Tester", "AppSec Engineer",
    "Game Developer", "Unity Developer", "Unreal Engine Developer", "Graphics Programmer",
    "Blockchain Developer", "Smart Contract Engineer", "Solidity Developer", "Web3 Engineer",
    "Embedded Systems Engineer", "Firmware Engineer", "IoT Engineer", "Robotics Engineer",
    "Network Engineer", "Systems Administrator", "IT Support Specialist",
    "Solutions Architect", "Enterprise Architect", "Technical Consultant", "Developer Advocate",

    // Creative / Informal Roles
    "Code Ninja", "Tech Wizard", "Growth Hacker", "Data Guru", "Full Stack Hero",
    "Bug Bounty Hunter", "White Hat Hacker", "Indie Hacker", "Solopreneur",
    "Prompt Engineer", "AI Whisperer", "Blockchain Evangelist"
];

export const CONSTRAINT_CATEGORIES = [
    {
        category: "Hardware & Infrastructure",
        description: "Your machine power and internet reliability",
        options: [
            "Low-spec Laptop (4GB RAM)",
            "Limited Internet (Data Bundles)",
            "Frequent Power Outages"
        ]
    },
    {
        category: "Time & Availability",
        description: "How much time can you dedicate daily?",
        options: [
            "Part-time (< 2hrs/day)",
            "Weekend Warrior",
            "Full-time Immersion"
        ]
    },
    {
        category: "Learning Preferences",
        description: "How do you learn best?",
        options: [
            "Video-based (YouTube/Udemy)",
            "Documentation & Reading",
            "Project-based Learning"
        ]
    }
];
