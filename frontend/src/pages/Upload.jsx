import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { uploadResume } from "../api";

export default function Upload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("idle"); // idle | uploading | error
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  function handleFile(selected) {
    if (!selected) return;
    if (selected.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }
    if (selected.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB limit.");
      return;
    }
    setError("");
    setFile(selected);
  }

  async function handleSubmit() {
    if (!file) return;
    setStatus("uploading");
    setError("");
    try {
      const result = await uploadResume(file, setProgress);
      navigate(`/dashboard/${result._id}`, { state: { resume: result } });
    } catch (err) {
      setStatus("error");
      setError(err.response?.data?.error || "Failed to analyze resume. Please try again.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-display text-4xl font-extrabold text-white tracking-tight mb-3">
          Upload Your <span className="text-gradient">Resume</span>
        </h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Select or drag your PDF resume below. Our parser will extract skills, score formatting, and calculate ATS readiness in seconds.
        </p>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
        className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300 ${
          dragActive
            ? "border-indigo-400 bg-indigo-500/10 scale-[1.01]"
            : file
            ? "border-emerald-500/60 bg-emerald-500/5"
            : "border-slate-700/80 bg-slate-900/60 hover:border-indigo-500/50 hover:bg-slate-800/40"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {file ? (
          <div className="flex flex-col items-center py-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-mono text-base font-bold text-white mb-1">{file.name}</p>
            <p className="text-xs text-slate-400 font-mono">
              {(file.size / (1024 * 1024)).toFixed(2)} MB PDF Document
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="mt-3 text-xs font-semibold text-rose-400 hover:text-rose-300 underline"
            >
              Choose a different file
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="font-display font-bold text-lg text-white mb-1">
              Drag and drop your PDF resume here
            </p>
            <p className="text-sm text-slate-400">or click anywhere to browse files</p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs font-mono text-slate-500 px-3 py-1 rounded-full bg-slate-800/80">
              <span>Supports PDF up to 10MB</span>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
          <svg className="w-5 h-5 text-rose-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {status === "uploading" && (
        <div className="mt-6 p-6 rounded-2xl glass-panel space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-200">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              Analyzing resume structure...
            </span>
            <span className="font-mono text-indigo-400">{progress}%</span>
          </div>
          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || status === "uploading"}
        className="mt-8 w-full py-4 rounded-xl font-bold text-white text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-xl shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-[0.99] transition-all duration-200"
      >
        {status === "uploading" ? "Analyzing Resume..." : "Start Full Analysis"}
      </button>
    </div>
  );
}
