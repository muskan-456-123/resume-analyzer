import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import { getResume, compareWithJob } from "../api";
import ScoreGauge from "../components/ScoreGauge";

export default function Dashboard() {
  const { id } = useParams();
  const location = useLocation();
  const [resume, setResume] = useState(location.state?.resume || null);
  const [loading, setLoading] = useState(!location.state?.resume);

  const [jobDescription, setJobDescription] = useState("");
  const [compareResult, setCompareResult] = useState(null);
  const [comparing, setComparing] = useState(false);

  useEffect(() => {
    if (!resume) {
      getResume(id).then(setResume).catch(() => setResume(null)).finally(() => setLoading(false));
    }
  }, [id, resume]);

  async function handleCompare() {
    if (!jobDescription.trim()) return;
    setComparing(true);
    try {
      const result = await compareWithJob(id, jobDescription);
      setCompareResult(result);
    } catch (err) {
      console.error(err);
    } finally {
      setComparing(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full glass-panel text-indigo-400">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-ping" />
          <span className="font-mono text-sm">Fetching resume analysis...</span>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center glass-panel rounded-2xl my-12">
        <h2 className="font-display text-2xl font-bold text-white mb-2">Resume Not Found</h2>
        <p className="text-slate-400 text-sm mb-6">Could not load details for this resume analysis ID.</p>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
        >
          Upload New Resume
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Top Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {resume.fileName}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Analyzed
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Complete ATS evaluation and skill taxonomy breakdown
          </p>
        </div>

        <Link
          to="/upload"
          className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white glass-panel rounded-xl hover:border-indigo-500/40 transition-all"
        >
          + Upload Another Resume
        </Link>
      </div>

      {/* Main Grid: Score + Skills */}
      <div className="grid lg:grid-cols-12 gap-8">
        {/* Score Panel */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <h2 className="font-display text-lg font-bold text-white mb-2">ATS Compatibility</h2>
          <ScoreGauge score={resume.atsScore} />
          
          <div className="w-full mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-left font-mono text-xs">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block">DETECTED SKILLS</span>
              <span className="text-indigo-400 font-bold text-sm">{resume.skillsFound?.length || 0} skills</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-500 block">MISSING SKILLS</span>
              <span className="text-amber-400 font-bold text-sm">{resume.missingSkills?.length || 0} items</span>
            </div>
          </div>
        </div>

        {/* Skill Pills & Gaps */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-6">
          <div>
            <h2 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              Detected Technical Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skillsFound?.length ? (
                resume.skillsFound.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors"
                  >
                    ✓ {skill}
                  </span>
                ))
              ) : (
                <p className="text-sm text-slate-400">No matching skills detected in taxonomy.</p>
              )}
            </div>
          </div>

          {resume.missingSkills?.length > 0 && (
            <div className="pt-4 border-t border-slate-800/80">
              <h2 className="font-display font-bold text-lg text-white mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Missing for Target Role
              </h2>
              <div className="flex flex-wrap gap-2">
                {resume.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:border-amber-500/40 transition-colors"
                  >
                    ! {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Role Recommendations & AI Tips */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recommended Roles */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Best-Matching Roles
          </h2>

          <div className="space-y-3">
            {resume.recommendedRoles?.map((r) => (
              <div key={r.role} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold text-slate-200">
                  <span>{r.role}</span>
                  <span className="font-mono text-indigo-400 font-bold">{r.match}% match</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-700"
                    style={{ width: `${r.match}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h2 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Actionable Optimization Tips
          </h2>

          <ul className="space-y-3">
            {resume.improvementSuggestions?.map((tip, idx) => (
              <li key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-sm text-slate-300 leading-relaxed flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-mono text-xs flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Job Description Matcher */}
      <div className="glass-panel p-6 rounded-2xl space-y-6 border border-slate-700/60">
        <div>
          <h2 className="font-display font-bold text-xl text-white mb-1 flex items-center gap-2">
            <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Compare Against Target Job Posting
          </h2>
          <p className="text-slate-400 text-sm">
            Paste a job description below to check live keyword overlap, match percentage, and specific skill gaps.
          </p>
        </div>

        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={5}
          placeholder="Paste job description text here (e.g. Senior Frontend Engineer requiring React, TypeScript, GraphQL...)"
          className="w-full p-4 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-body"
        />

        <button
          onClick={handleCompare}
          disabled={comparing || !jobDescription.trim()}
          className="px-6 py-3 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-600/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {comparing ? "Comparing Job Requirements..." : "Analyze Job Match"}
        </button>

        {compareResult && (
          <div className="pt-6 border-t border-slate-800/80 grid sm:grid-cols-12 gap-6 items-center">
            <div className="sm:col-span-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="font-mono text-4xl font-extrabold text-gradient">
                {compareResult.match_percent}%
              </span>
              <span className="block text-xs uppercase tracking-widest text-slate-400 font-semibold mt-1">
                Job Requirement Match
              </span>
            </div>

            <div className="sm:col-span-8 space-y-3">
              <h4 className="text-sm font-semibold text-white">Missing Keywords for this Posting:</h4>
              <div className="flex flex-wrap gap-2">
                {compareResult.missing_skills?.length ? (
                  compareResult.missing_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 rounded-lg text-xs font-mono font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20"
                    >
                      ! {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-emerald-400 font-medium">
                    ✓ Great job! Your resume covers all detected skills in this job posting.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
