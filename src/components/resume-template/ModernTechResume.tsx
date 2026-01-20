import React from "react";
import { ResumeContent } from "@/types/resume";
import { MapPin, Mail, Phone, Globe, Linkedin, Github, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernTechResumeProps {
    content: ResumeContent;
    className?: string; // For scaling/container styles
}

export const ModernTechResume: React.FC<ModernTechResumeProps> = ({ content, className }) => {
    const { profile, summary, experience, education, skills, projects } = content;

    return (
        <div className={cn("bg-white text-slate-900 p-8 w-[210mm] min-h-[297mm] shadow-lg mx-auto", className)} id="resume-preview">
            {/* Header */}
            <header className="border-b-2 border-slate-800 pb-6 mb-6">
                <h1 className="text-4xl font-bold tracking-tight uppercase text-slate-900 mb-2">{profile.name}</h1>
                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-600">
                    {profile.location && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{profile.location}</span>
                        </div>
                    )}
                    {profile.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{profile.email}</span>
                        </div>
                    )}
                    {profile.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-4 h-4" />
                            <span>{profile.phone}</span>
                        </div>
                    )}
                    {profile.website && (
                        <div className="flex items-center gap-1">
                            <Globe className="w-4 h-4" />
                            <a href={profile.website} target="_blank" rel="noreferrer" className="hover:underline">{profile.website}</a>
                        </div>
                    )}
                    {profile.linkedin && (
                        <div className="flex items-center gap-1">
                            <Linkedin className="w-4 h-4" />
                            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>
                        </div>
                    )}
                    {profile.github && (
                        <div className="flex items-center gap-1">
                            <Github className="w-4 h-4" />
                            <a href={profile.github} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>
                        </div>
                    )}
                </div>
            </header>

            {/* Summary */}
            {summary && (
                <section className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">Professional Summary</h3>
                    <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
                </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">Technical Skills</h3>
                    <div className="grid grid-cols-1 gap-2">
                        {skills.map((skillGroup, idx) => (
                            <div key={idx} className="flex text-sm">
                                <span className="font-semibold w-32 min-w-32 text-slate-800">{skillGroup.category}:</span>
                                <span className="text-slate-700">{skillGroup.items.join(", ")}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Professional Experience</h3>
                    <div className="space-y-6">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <h4 className="text-lg font-bold text-slate-900">{exp.role}</h4>
                                    <span className="text-sm font-medium text-slate-600 whitespace-nowrap">{exp.startDate} – {exp.endDate}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <div className="text-md font-semibold text-slate-700">{exp.company}</div>
                                    <div className="text-sm text-slate-500 italic">{exp.location}</div>
                                </div>
                                <ul className="list-disc list-outside ml-4 space-y-1 text-sm text-slate-700">
                                    {exp.description.map((bullet, bIdx) => (
                                        <li key={bIdx} className="pl-1">{bullet}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && projects.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 border-b border-slate-200 pb-1">Key Projects</h3>
                    <div className="space-y-4">
                        {projects.map((proj, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between items-baseline mb-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-md font-bold text-slate-900">{proj.name}</h4>
                                        {proj.link && (
                                            <a href={proj.link} target="_blank" rel="noreferrer" className="text-slate-500 hover:text-slate-900">
                                                <ExternalLink className="w-3 h-3" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-700 mb-1">{proj.description}</p>
                                <div className="text-xs font-mono text-slate-500">Tech: {proj.technologies.join(", ")}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education.length > 0 && (
                <section className="mb-6">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2 border-b border-slate-200 pb-1">Education</h3>
                    <div className="space-y-2">
                        {education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between items-baseline text-sm">
                                <div>
                                    <span className="font-bold text-slate-900">{edu.school}</span>
                                    <span className="mx-2 text-slate-400">|</span>
                                    <span className="text-slate-700">{edu.degree}</span>
                                </div>
                                <span className="font-medium text-slate-600">{edu.graduationDate}</span>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};
