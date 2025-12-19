
import React, { useState, useCallback, useEffect } from 'react';
import { EvaluationForm } from './components/EvaluationForm';
import { EvaluationResultView } from './components/EvaluationResultView';
import { HistoryList } from './components/HistoryList';
import { EvaluationRequest, EvaluationResult, PastEvaluation } from './types';
import { evaluateAnswer } from './geminiService';
import { BookOpen, History, PlusCircle, CheckCircle } from 'lucide-react';

const App: React.FC = () => {
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>(null);
  const [history, setHistory] = useState<PastEvaluation[]>([]);
  const [view, setView] = useState<'new' | 'history' | 'result'>('new');
  const [lastRequest, setLastRequest] = useState<EvaluationRequest | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('autoeval_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  const handleEvaluate = async (request: EvaluationRequest) => {
    setIsEvaluating(true);
    setLastRequest(request);
    try {
      const result = await evaluateAnswer(request);
      setCurrentResult(result);
      
      const newHistoryEntry: PastEvaluation = {
        ...request,
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        result
      };

      const updatedHistory = [newHistoryEntry, ...history];
      setHistory(updatedHistory);
      localStorage.setItem('autoeval_history', JSON.stringify(updatedHistory));
      
      setView('result');
    } catch (error) {
      console.error("Evaluation failed", error);
      alert("Evaluation failed. Please check your API configuration.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSelectHistory = (evalItem: PastEvaluation) => {
    setCurrentResult(evalItem.result);
    setLastRequest({
      question: evalItem.question,
      modelAnswer: evalItem.modelAnswer,
      studentAnswer: evalItem.studentAnswer,
    });
    setView('result');
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history?")) {
      setHistory([]);
      localStorage.removeItem('autoeval_history');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('new')}>
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <BookOpen size={24} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">AutoEval</h1>
          </div>
          
          <nav className="flex items-center gap-1 md:gap-4">
            <button 
              onClick={() => setView('new')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === 'new' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <PlusCircle size={18} />
              <span className="hidden sm:inline">New Eval</span>
            </button>
            <button 
              onClick={() => setView('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${view === 'history' ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800'}`}
            >
              <History size={18} />
              <span className="hidden sm:inline">History ({history.length})</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {view === 'new' && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Evaluate Student Answer</h2>
              <p className="text-slate-400">Enter the exam details below to get an AI-powered evaluation within seconds.</p>
            </div>
            <EvaluationForm onEvaluate={handleEvaluate} isLoading={isEvaluating} />
          </div>
        )}

        {view === 'history' && (
          <HistoryList 
            history={history} 
            onSelectItem={handleSelectHistory} 
            onClearAll={clearHistory}
          />
        )}

        {view === 'result' && currentResult && lastRequest && (
          <EvaluationResultView 
            result={currentResult} 
            request={lastRequest}
            onReset={() => setView('new')} 
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 text-center text-sm text-slate-500">
        <p>&copy; {new Date().getFullYear()} AutoEval - Professional NLP Examination Assistant</p>
      </footer>
    </div>
  );
};

export default App;
