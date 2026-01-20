import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, FileText } from "lucide-react";

interface LoadingOverlayProps {
    isLoading: boolean;
    message: string;
    type?: "parsing" | "tailoring";
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message, type = "parsing" }) => {
    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white p-8 rounded-2xl shadow-2xl flex flex-col items-center max-w-sm w-full mx-4"
                    >
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
                            <div className="relative bg-slate-50 p-4 rounded-full">
                                {type === "parsing" ? (
                                    <FileText className="w-10 h-10 text-slate-900 animate-pulse" />
                                ) : (
                                    <Sparkles className="w-10 h-10 text-purple-600 animate-pulse" />
                                )}
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 mb-2">{type === "parsing" ? "Reading PDF..." : "Gemini is Working..."}</h3>
                        <p className="text-slate-500 text-center mb-6">{message}</p>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Processing secure data</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
