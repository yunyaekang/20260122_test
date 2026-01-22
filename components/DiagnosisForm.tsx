
import React, { useState } from 'react';
import { Plus, Trash2, Info, AlertCircle } from 'lucide-react';
import { Task } from '../types';

interface DiagnosisFormProps {
  onComplete: (tasks: Task[]) => void;
  initialTasks: Task[];
  error: string | null;
}

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ onComplete, initialTasks, error }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks.length > 0 ? initialTasks : [
    { id: '1', title: '', description: '', frequency: 'daily', hoursPerWeek: 1, repetitionLevel: 3, dataDigitalized: true }
  ]);

  const addTask = () => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      frequency: 'daily',
      hoursPerWeek: 1,
      repetitionLevel: 3,
      dataDigitalized: true
    };
    setTasks([...tasks, newTask]);
  };

  const removeTask = (id: string) => {
    if (tasks.length > 1) {
      setTasks(tasks.filter(t => t.id !== id));
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validTasks = tasks.filter(t => t.title.trim() !== '');
    if (validTasks.length === 0) {
      alert("최소 하나 이상의 업무를 입력해주세요.");
      return;
    }
    onComplete(validTasks);
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">분석할 업무 등록</h2>
        <p className="text-slate-500">당신의 주요 일과나 반복되는 업무를 나열해 보세요.</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {tasks.map((task, index) => (
          <div key={task.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm relative group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">업무 #{index + 1}</span>
              {tasks.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => removeTask(task.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">업무 명칭</label>
                <input
                  type="text"
                  required
                  placeholder="예: 주간 매출 보고서 작성, 고객 문의 메일 응대"
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  value={task.title}
                  onChange={(e) => updateTask(task.id, { title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">상세 설명 (선택)</label>
                <textarea
                  placeholder="업무가 구체적으로 어떻게 진행되는지 적어주시면 AI가 더 정확하게 분석합니다."
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-20"
                  value={task.description}
                  onChange={(e) => updateTask(task.id, { description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">빈도</label>
                  <select
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                    value={task.frequency}
                    onChange={(e) => updateTask(task.id, { frequency: e.target.value as any })}
                  >
                    <option value="daily">매일</option>
                    <option value="weekly">매주</option>
                    <option value="monthly">매월</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">주간 투입 시간</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0.5"
                      step="0.5"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                      value={task.hoursPerWeek}
                      onChange={(e) => updateTask(task.id, { hoursPerWeek: parseFloat(e.target.value) })}
                    />
                    <span className="absolute right-4 top-2 text-slate-400 text-sm">시간</span>
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                  단순 반복 수준 (1~5)
                  <div className="group relative">
                    <Info className="w-4 h-4 text-slate-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                      정해진 룰에 따라 반복되는 정도입니다. 높을수록 자동화에 유리합니다.
                    </div>
                  </div>
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="5"
                    className="flex-grow accent-indigo-600"
                    value={task.repetitionLevel}
                    onChange={(e) => updateTask(task.id, { repetitionLevel: parseInt(e.target.value) })}
                  />
                  <span className="text-lg font-bold text-indigo-600 w-4">{task.repetitionLevel}</span>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={addTask}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center gap-2 text-slate-500 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all font-medium"
        >
          <Plus className="w-5 h-5" /> 업무 추가하기
        </button>

        <div className="pt-8 sticky bottom-0 bg-slate-50/80 backdrop-blur-sm pb-4">
          <button
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg"
          >
            AI 정밀 분석 시작
          </button>
        </div>
      </form>
    </div>
  );
};
