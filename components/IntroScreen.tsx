
import React from 'react';
import { ArrowRight, Zap, Target, BarChart3, Clock, History, Trash2, Calendar } from 'lucide-react';
import { SavedDiagnosis } from '../types';

interface IntroScreenProps {
  onStart: () => void;
  history: SavedDiagnosis[];
  onSelectHistory: (item: SavedDiagnosis) => void;
  onDeleteHistory: (id: string, e: React.MouseEvent) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart, history, onSelectHistory, onDeleteHistory }) => {
  return (
    <div className="flex flex-col items-center py-12">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-6 uppercase tracking-wider">
          <Zap className="w-3 h-3" /> AI 가속기
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
          당신의 업무 중 무엇을 <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500 italic">AI로 자동화</span>할 수 있을까요?
        </h1>
        <p className="text-lg text-slate-600 mb-10 max-w-2xl mx-auto">
          반복적인 업무, 데이터 정리, 문서 요약 등... <br />
          AI가 가장 잘 도와줄 수 있는 업무를 찾아내고 최적의 도구를 제안해 드립니다.
        </p>

        <button
          onClick={onStart}
          className="group relative inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200"
        >
          새 진단 시작하기
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16 w-full max-w-4xl">
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Target className="w-8 h-8 text-indigo-500 mb-4 mx-auto" />
          <h3 className="font-bold text-slate-800 mb-2 text-center">정밀 진단</h3>
          <p className="text-sm text-slate-500 text-center">업무 유형과 빈도를 분석하여 자동화 가능성을 수치로 환산합니다.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <BarChart3 className="w-8 h-8 text-cyan-500 mb-4 mx-auto" />
          <h3 className="font-bold text-slate-800 mb-2 text-center">도구 추천</h3>
          <p className="text-sm text-slate-500 text-center">ChatGPT, Zapier 등 업무에 최적화된 AI 솔루션을 제안합니다.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Clock className="w-8 h-8 text-emerald-500 mb-4 mx-auto" />
          <h3 className="font-bold text-slate-800 mb-2 text-center">ROI 분석</h3>
          <p className="text-sm text-slate-500 text-center">자동화 도입 후 절약 가능한 예상 시간과 가치를 미리 확인하세요.</p>
        </div>
      </div>

      {history.length > 0 && (
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
            <History className="w-5 h-5 text-slate-400" />
            <h2 className="text-xl font-bold text-slate-800">최근 진단 기록</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {history.map((item) => (
              <div 
                key={item.id} 
                onClick={() => onSelectHistory(item)}
                className="group p-5 bg-white border border-slate-200 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
                    <Calendar className="w-3 h-3" /> {item.date}
                  </div>
                  <button 
                    onClick={(e) => onDeleteHistory(item.id, e)}
                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h4 className="font-bold text-slate-800 mb-1 line-clamp-1">{item.tasks[0].title} {item.tasks.length > 1 ? `외 ${item.tasks.length - 1}건` : ''}</h4>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">점수: {item.result.overallScore}</span>
                  </div>
                  <span className="text-xs font-medium text-slate-400 group-hover:text-indigo-600 flex items-center gap-1">
                    결과 보기 <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
