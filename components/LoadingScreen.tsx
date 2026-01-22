
import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const messages = [
  "업무의 복잡도를 분석하고 있습니다...",
  "사용 가능한 AI 도구를 매칭 중입니다...",
  "예상 ROI를 산출하고 있습니다...",
  "맞춤형 자동화 워크플로우를 구성하고 있습니다...",
  "데이터를 기반으로 진단서를 작성 중입니다..."
];

export const LoadingScreen: React.FC = () => {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative z-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">AI가 업무를 분석하고 있습니다</h2>
      <p className="text-slate-500 text-lg animate-pulse h-8">{messages[msgIndex]}</p>
      
      <div className="mt-12 w-full max-w-md bg-slate-100 h-2 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 animate-[loading_12s_ease-in-out_infinite]"></div>
      </div>

      <style>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};
