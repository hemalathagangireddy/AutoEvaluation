
import React from 'react';
import { EvaluationResult, EvaluationRequest } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Lightbulb, ArrowLeft, Award, FileText, Check, AlertCircle, XCircle } from 'lucide-react';

interface Props {
  result: EvaluationResult;
  request: EvaluationRequest;
  onReset: () => void;
}

export const EvaluationResultView: React.FC<Props> = ({ result, request, onReset }) => {
  const chartData = [
    { subject: 'Similarity', A: result.semanticSimilarity, fullMark: 100 },
    { subject: 'Keywords', A: result.keywordCoverage, fullMark: 100 },
    { subject: 'Relevance', A: result.contentRelevance, fullMark: 100 },
    { subject: 'Grammar', A: result.grammarRating, fullMark: 100 },
  ];

  const scorePercentage = (result.score / result.maxScore) * 100;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center justify-between">
        <button 
          onClick={onReset}
          className="flex items-center gap-2 text-slate-300 hover:text-indigo-400 transition-colors font-bold"
        >
          <ArrowLeft size={20} />
          New Evaluation
        </button>
        <div className="flex items-center gap-2 bg-indigo-900/40 text-indigo-300 px-4 py-1.5 rounded-full font-bold border border-indigo-700">
          <Award size={18} />
          AI Analysis Complete
        </div>
      </div>

      {/* Top Header Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center">
          <h3 className="text-slate-400 text-sm font-black uppercase tracking-wider mb-2">Final Score</h3>
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                className="text-slate-800"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
                fill="transparent"
                strokeDasharray={351.8}
                strokeDashoffset={351.8 - (351.8 * scorePercentage) / 100}
                className="text-indigo-500 transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute text-3xl font-black text-white">
              {result.score}<span className="text-slate-500 text-lg font-bold">/100</span>
            </div>
          </div>
          <p className="mt-4 text-white font-bold text-lg">
            {scorePercentage >= 80 ? 'Excellent performance!' : scorePercentage >= 60 ? 'Good work.' : 'Needs improvement.'}
          </p>
        </div>

        <div className="lg:col-span-2 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col">
          <h3 className="text-white font-black mb-4 flex items-center gap-2">
             Performance Breakdown
          </h3>
          <div className="flex-1 h-48 md:h-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 700 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Score"
                  dataKey="A"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Submission Context - Dark Mode */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-6 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
                <FileText size={20} className="text-indigo-400" />
                <h4 className="font-black">Submission Context</h4>
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-6 border-r border-slate-800">
                <h5 className="text-xs uppercase font-black text-slate-400 mb-3 tracking-widest">Model Reference Answer</h5>
                <p className="text-base text-slate-300 font-medium leading-relaxed italic">{request.modelAnswer}</p>
            </div>
            <div className="p-6">
                <h5 className="text-xs uppercase font-black text-slate-400 mb-3 tracking-widest">Student Response</h5>
                <p className="text-base text-slate-100 font-medium leading-relaxed">{request.studentAnswer}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Feedback Section */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h4 className="font-black text-white mb-4 flex items-center gap-2 text-lg">
              <CheckCircle2 size={22} className="text-green-400" />
              Detailed Feedback
            </h4>
            <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-p:font-medium prose-p:leading-relaxed">
              {result.detailedFeedback}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h4 className="font-black text-white mb-4 flex items-center gap-2 text-lg">
              <Lightbulb size={22} className="text-amber-400" />
              Ways to Improve
            </h4>
            <ul className="space-y-4">
              {result.suggestions.map((s, idx) => (
                <li key={idx} className="flex gap-3 text-base text-slate-300 font-medium">
                  <div className="shrink-0 w-6 h-6 bg-amber-900/40 rounded-full flex items-center justify-center text-amber-400 text-xs font-black border border-amber-700">
                    {idx + 1}
                  </div>
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Keyword Analysis */}
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h4 className="font-black text-white mb-4 flex items-center gap-2 text-lg">
              <Check size={22} className="text-indigo-400" />
              Keywords Identified
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.identifiedKeywords.map((k, idx) => (
                <span key={idx} className="bg-green-900/30 text-green-300 px-3 py-1.5 rounded-lg text-sm font-bold border border-green-800 flex items-center gap-1.5">
                  <Check size={14} strokeWidth={3} /> {k}
                </span>
              ))}
              {result.identifiedKeywords.length === 0 && <span className="text-slate-500 italic text-sm font-medium">No specific technical keywords detected.</span>}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h4 className="font-black text-white mb-4 flex items-center gap-2 text-lg">
              <AlertCircle size={22} className="text-red-400" />
              Missing Key Concepts
            </h4>
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((k, idx) => (
                <span key={idx} className="bg-red-900/30 text-red-300 px-3 py-1.5 rounded-lg text-sm font-bold border border-red-800 flex items-center gap-1.5">
                  <XCircle size={14} strokeWidth={3} /> {k}
                </span>
              ))}
              {result.missingKeywords.length === 0 && <span className="text-slate-500 italic text-sm font-medium">Comprehensive coverage! No major concepts missing.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
