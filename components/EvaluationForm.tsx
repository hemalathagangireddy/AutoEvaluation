
import React, { useState } from 'react';
import { EvaluationRequest } from '../types';
import { Loader2, Sparkles } from 'lucide-react';

interface Props {
  onEvaluate: (data: EvaluationRequest) => void;
  isLoading: boolean;
}

export const EvaluationForm: React.FC<Props> = ({ onEvaluate, isLoading }) => {
  const [formData, setFormData] = useState<EvaluationRequest>({
    question: '',
    modelAnswer: '',
    studentAnswer: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEvaluate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-black text-white flex items-center gap-1">
            Exam Question
          </label>
          <textarea
            name="question"
            required
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none text-white font-medium placeholder:text-slate-600"
            placeholder="e.g. Explain the process of Photosynthesis in plants."
            value={formData.question}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-white">
            Model Answer (Reference)
          </label>
          <textarea
            name="modelAnswer"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white font-medium leading-relaxed placeholder:text-slate-600"
            placeholder="Paste the perfect or expected answer here..."
            value={formData.modelAnswer}
            onChange={handleChange}
          />
          <p className="text-xs text-slate-500 font-medium italic">This acts as the master key for semantic comparison.</p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black text-white">
            Student's Response
          </label>
          <textarea
            name="studentAnswer"
            required
            rows={6}
            className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-white font-medium leading-relaxed placeholder:text-slate-600"
            placeholder="Enter the student's descriptive theory answer..."
            value={formData.studentAnswer}
            onChange={handleChange}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all disabled:opacity-70 disabled:cursor-not-allowed group shadow-lg shadow-indigo-900/50 text-lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" />
            Evaluating...
          </>
        ) : (
          <>
            <Sparkles className="group-hover:animate-pulse" size={20} />
            Evaluate Answer
          </>
        )}
      </button>
      <p className="text-center text-xs text-slate-500 font-bold uppercase tracking-wider">Automated evaluation on a 0-100 scale</p>
    </form>
  );
};
