"use client";

import React, { useState } from "react";
import { ResumeContent } from "@/types/resume";
import { parseResumeAction, tailorResumeAction } from "@/app/actions";
import { ModernTechResume } from "@/components/resume-template/ModernTechResume";
import { Loader2, Upload, Sparkles, Printer } from "lucide-react";
import { LoadingOverlay } from "@/components/LoadingOverlay";

export default function ResumeBuilder() {
    const [resumeData, setResumeData] = useState<ResumeContent | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [isParsing, setIsParsing] = useState(false);
    const [isTailoring, setIsTailoring] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setIsParsing(true);
        const formData = new FormData();
        formData.append("file", e.target.files[0]);

        const result = await parseResumeAction(formData);
        if (result) {
            setResumeData(result);
        }
        setIsParsing(false);
    };

    const handleTailor = async () => {
        if (!resumeData || !jobDescription) return;
        setIsTailoring(true);
        const result = await tailorResumeAction(resumeData, jobDescription);
        if (result) {
            setResumeData(result);
        }
        setIsTailoring(false);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="flex flex-col lg:flex-row h-screen bg-slate-100 overflow-hidden print:h-auto print:overflow-visible">
            <LoadingOverlay
                isLoading={isParsing}
                message="Extracting resume content..."
                type="parsing"
            />
            <LoadingOverlay
                isLoading={isTailoring}
                message="Analyzing job description and rewriting your resume..."
                type="tailoring"
            />
            {/* Left Panel: Controls */}
            <div className="w-full lg:w-1/3 bg-white border-r border-slate-200 p-6 overflow-y-auto no-print">
                <h1 className="text-2xl font-bold text-slate-800 mb-6">Resume Tailor</h1>

                {/* Step 1: Upload */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">1. Upload Resume (PDF)</label>
                    <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors">
                        <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-sm text-slate-500">
                            {isParsing ? "Parsing..." : "Click to Upload or Drag & Drop"}
                        </span>
                    </div>
                </div>

                {/* Step 2: Job Description */}
                <div className="mb-8">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">2. Paste Job Description</label>
                    <textarea
                        className="w-full h-48 p-3 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none text-black placeholder:text-slate-500"
                        placeholder="Paste the job description here..."
                        value={jobDescription}
                        onChange={(e) => setJobDescription(e.target.value)}
                    />
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleTailor}
                        disabled={!resumeData || !jobDescription || isTailoring}
                        className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {isTailoring ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                        {isTailoring ? "Tailoring with Gemini..." : "Tailor Resume"}
                    </button>

                    <button
                        onClick={handlePrint}
                        disabled={!resumeData}
                        className="w-full bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        <Printer className="w-5 h-5" />
                        Save as PDF
                    </button>
                </div>
            </div>

            {/* Right Panel: Preview */}
            <div className="flex-1 bg-slate-500 p-8 overflow-y-auto flex justify-center print-container print:bg-white print:overflow-visible print:h-auto print:block">
                {resumeData ? (
                    <div className="scale-[0.85] origin-top shadow-2xl print:scale-100 print:shadow-none print:w-full">
                        <ModernTechResume content={resumeData} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-200">
                        <div className="w-64 h-80 border-2 border-dashed border-slate-400 rounded-lg mb-4 opacity-50"></div>
                        <p>Upload a resume to see the preview</p>
                    </div>
                )}
            </div>

        </div>
    );
}
