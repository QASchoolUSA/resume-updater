import { ResumeContent } from "@/types/resume";

export const sampleResume: ResumeContent = {
    profile: {
        name: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "(555) 123-4567",
        location: "San Francisco, CA",
        linkedin: "linkedin.com/in/alexj",
        github: "github.com/alexj",
        website: "alexjohnson.dev"
    },
    summary: "Senior Software Engineer with 6+ years of experience building scalable distributed systems and high-performance web applications. Proven track record of improving system reliability by 40% and reducing latency by 30%. Expert in React, Node.js, and cloud infrastructure.",
    skills: [
        { category: "Languages", items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"] },
        { category: "Frontend", items: ["React", "Next.js", "Redux", "Tailwind CSS", "HTML5", "CSS3"] },
        { category: "Backend", items: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS"] },
    ],
    experience: [
        {
            company: "TechFlow Systems",
            role: "Senior Software Engineer",
            startDate: "2021",
            endDate: "Present",
            location: "San Francisco, CA",
            description: [
                "Led the migration of a monolithic architecture to microservices using Node.js and Docker, improving deployment frequency by 200%.",
                "Designed and implemented a real-time collaboration feature using WebSockets, increasing daily active users by 25%.",
                "Mentored 3 junior developers, conducting code reviews and technical training sessions."
            ]
        },
        {
            company: "WebScale Solutions",
            role: "Software Developer",
            startDate: "2018",
            endDate: "2021",
            location: "Austin, TX",
            description: [
                "Developed responsive user interfaces for a chaotic e-commerce platform using React and Redux.",
                "Optimized database queries, reducing page load times by 40% for high-traffic product pages.",
                "Collaborated with UX designers to implement pixel-perfect designs."
            ]
        }
    ],
    education: [
        {
            school: "University of Texas at Austin",
            degree: "B.S. Computer Science",
            graduationDate: "2018"
        }
    ],
    projects: [
        {
            name: "CloudMonitor",
            description: "Open-source comprehensive server monitoring dashboard used by 500+ developers.",
            technologies: ["Go", "React", "InfluxDB"]
        }
    ]
};
