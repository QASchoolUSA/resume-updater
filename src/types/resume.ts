export interface ResumeProfile {
    name: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
}

export interface ResumeExperience {
    company: string;
    role: string;
    startDate: string;
    endDate: string; // "Present" if current
    location?: string;
    description: string[]; // Bullet points
}

export interface ResumeEducation {
    school: string;
    degree: string;
    graduationDate: string;
    gpa?: string;
}

export interface ResumeProject {
    name: string;
    description: string;
    technologies: string[];
    link?: string;
}

export interface ResumeContent {
    profile: ResumeProfile;
    summary: string;
    experience: ResumeExperience[];
    education: ResumeEducation[];
    skills: {
        category: string;
        items: string[];
    }[];
    projects?: ResumeProject[];
}
