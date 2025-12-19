
import React, { useState } from 'react';
import { PastEvaluation } from '../types';
import { Search, Calendar, Trash2, ChevronRight, FileQuestion } from 'lucide-react';

interface Props {
  history: PastEvaluation[];
  onSelectItem: (item: PastEvaluation) => void;
  onClearAll: () => void;
}

export const HistoryList: React.FC<Props> = ({ history, onSelectItem, onClearAll }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = history.filter(item => 
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.studentAnswer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white">Evaluation History</h2>
          <p className="text-slate-400 font-medium">Browse and review your previous automated corrections.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text"
              placeholder="Search evaluations..."
              className="pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-white font-medium text-sm w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            onClick={onClearAll}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            title="Clear All History"
          >
            <Trash2 size={24} />
          </button>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="divide-y divide-slate-800">
            {filtered.map((item) => (
              <div 
                key={item.id}
                onClick={() => onSelectItem(item)}
                className="group p-5 hover:bg-slate-800 transition-colors cursor-pointer flex items-center justify-between border-l-4 border-l-transparent hover:border-l-indigo-500"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      item.result.score >= 80 ? 'bg-green-900/40 text-green-300 border border-green-800' :
                      item.result.score >= 50 ? 'bg-amber-900/40 text-amber-300 border border-amber-800' :
                      'bg-red-900/40 text-red-300 border border-red-800'
                    }`}>
                      Score: {item.result.score}/100
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-xs font-bold">
                      <Calendar size={14} />
                      {new Date(item.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <h4 className="font-bold text-white text-base truncate mb-1">
                    {item.question}
                  </h4>
                  <p className="text-slate-400 text-sm truncate font-medium italic">
                    {item.studentAnswer}
                  </p>
                </div>
                <div className="shrink-0 text-slate-600 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all">
                  <ChevronRight size={28} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-900 rounded-3xl border border-dashed border-slate-700">
          <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileQuestion size={32} className="text-slate-500" />
          </div>
          <h3 className="text-white font-black text-xl">No evaluations found</h3>
          <p className="text-slate-500 font-medium">Your corrections will appear here once you analyze an answer.</p>
        </div>
      )}
    </div>
  );
};
