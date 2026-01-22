
import React from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  CheckCircle2, ArrowLeft, Download, 
  ExternalLink, Sparkles, TrendingUp, ShieldCheck, Save, Copy
} from 'lucide-react';
import { Task, DiagnosisResult } from '../types';

interface ResultsDashboardProps {
  result: DiagnosisResult;
  tasks: Task[];
  onReset: () => void;
  onSave: () => void;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, tasks, onReset, onSave }) => {
  
  const scatterData = result.taskEvaluations.map(evalItem => {
    const task = tasks.find(t => t.id === evalItem.taskId);
    return {
      name: task?.title || '알 수 없음',
      potential: evalItem.automationPotential,
      complexity: evalItem.complexity,
      priority: evalItem.actionPriority,
      size: 100
    };
  });

  const copyToClipboard = () => {
    const text = `
[AI 자동화 진단 리포트]
종합 점수: ${result.overallScore}/100
예상 절약 시간: 월 ${result.estimatedTimeSavedMonthly}시간

[AI 진단 요약]
${result.summary}

[권장 워크플로우]
${result.recommendedWorkflow}

[주요 권장 도구]
${Array.from(new Set(result.taskEvaluations.flatMap(e => e.suggestedTools))).join(', ')}
    `.trim();

    navigator.clipboard.writeText(text).then(() => {
      alert("진단 요약 내용이 클립보드에 복사되었습니다.");
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">AI 자동화 진단 결과</h2>
          <p className="text-slate-500">당신의 업무 생산성을 극대화할 수 있는 맞춤형 리포트입니다.</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <button 
            onClick={onReset}
            className="flex-grow md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> 목록으로
          </button>
          <button 
            onClick={onSave}
            className="flex-grow md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors font-medium"
          >
            <Save className="w-4 h-4" /> 기록 저장
          </button>
          <button 
            onClick={copyToClipboard}
            className="flex-grow md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors font-medium"
          >
            <Copy className="w-4 h-4" /> 텍스트 복사
          </button>
          <button 
            className="flex-grow md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-md"
            onClick={() => window.print()}
          >
            <Download className="w-4 h-4" /> PDF 출력
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-24 h-24" />
          </div>
          <p className="text-indigo-100 font-medium mb-1">종합 자동화 지수</p>
          <div className="flex items-end gap-2">
            <h3 className="text-5xl font-black">{result.overallScore}</h3>
            <span className="text-xl font-bold mb-1">/ 100</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm bg-white/20 px-3 py-1 rounded-full w-fit">
            <TrendingUp className="w-4 h-4" /> {result.overallScore > 70 ? '도입 강력 추천' : '부분 도입 권장'}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium mb-1">월간 예상 절약 시간</p>
          <div className="flex items-end gap-2">
            <h3 className="text-4xl font-extrabold text-slate-900">{result.estimatedTimeSavedMonthly}</h3>
            <span className="text-xl font-bold text-slate-400 mb-1">시간</span>
          </div>
          <p className="mt-4 text-sm text-slate-400">
            현재 업무 시간 대비 약 <span className="text-indigo-600 font-bold">{Math.min(100, Math.round((result.estimatedTimeSavedMonthly / (tasks.reduce((a,b)=>a+b.hoursPerWeek, 0) * 4)) * 100))}%</span> 효율 개선 가능
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <p className="text-slate-500 font-medium mb-1">추천 자동화 솔루션</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {Array.from(new Set(result.taskEvaluations.flatMap(e => e.suggestedTools))).slice(0, 5).map((tool, idx) => (
              <span key={idx} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-sm font-bold border border-slate-200">
                {tool}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 비즈니스 최적화 도구 셋
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h4 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-500" /> 업무 자동화 분석 맵
          </h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis type="number" dataKey="complexity" name="구현 복잡도" unit="점" domain={[0, 100]} />
                <YAxis type="number" dataKey="potential" name="자동화 가능성" unit="점" domain={[0, 100]} />
                <ZAxis type="number" dataKey="size" range={[100, 200]} />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }} 
                  formatter={(value: any, name: any) => [value + '점', name]}
                />
                <Scatter name="업무별 지표" data={scatterData}>
                  {scatterData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.potential > 70 ? '#4f46e5' : '#94a3b8'} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <h4 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" /> AI 핵심 진단 리포트
          </h4>
          <div className="prose prose-slate prose-sm max-w-none flex-grow">
            <p className="text-slate-700 leading-relaxed italic border-l-4 border-indigo-200 pl-4 py-2 bg-indigo-50/30 rounded-r-lg">
              "{result.summary}"
            </p>
            <h5 className="font-bold text-slate-800 mt-6 mb-2">권장 실행 로드맵:</h5>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-slate-700 font-medium text-sm">
              {result.recommendedWorkflow}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h4 className="text-lg font-bold text-slate-900">상세 업무별 처방전</h4>
        </div>
        <div className="divide-y divide-slate-100">
          {result.taskEvaluations.map((evalItem) => {
            const task = tasks.find(t => t.id === evalItem.taskId);
            return (
              <div key={evalItem.taskId} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="md:w-1/3">
                    <h5 className="font-bold text-slate-900 text-lg mb-1">{task?.title}</h5>
                    <p className="text-sm text-slate-500 line-clamp-2">{task?.description || '설명 없음'}</p>
                    <div className="mt-3">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                        evalItem.actionPriority === '높음' ? 'bg-red-50 text-red-600 border border-red-100' :
                        evalItem.actionPriority === '중간' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-slate-50 text-slate-400 border border-slate-100'
                      }`}>
                        우선순위: {evalItem.actionPriority}
                      </span>
                    </div>
                  </div>
                  <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                          <span>자동화 가능성</span>
                          <span className="text-indigo-600">{evalItem.automationPotential}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-indigo-500" style={{ width: `${evalItem.automationPotential}%` }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                          <span>구현 난이도</span>
                          <span className="text-slate-700">{evalItem.complexity}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-400" style={{ width: `${evalItem.complexity}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
                      <p className="text-sm text-slate-600 mb-3">{evalItem.benefitDescription}</p>
                      <div className="flex flex-wrap gap-2">
                        {evalItem.suggestedTools.map((tool, idx) => (
                          <span key={idx} className="text-xs font-medium text-slate-500 px-2 py-1 bg-white border border-slate-200 rounded">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
