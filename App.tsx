
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { DiagnosisForm } from './components/DiagnosisForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import { LoadingScreen } from './components/LoadingScreen';
import { IntroScreen } from './components/IntroScreen';
import { AppStep, Task, DiagnosisResult, SavedDiagnosis } from './types';
import { analyzeAutomationPotential } from './services/geminiService';

const STORAGE_KEY = 'ai_autoscan_history';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.INTRO);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [history, setHistory] = useState<SavedDiagnosis[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleStartDiagnosis = () => {
    setTasks([]);
    setResult(null);
    setStep(AppStep.DIAGNOSIS);
  };

  const handleFinishDiagnosis = async (submittedTasks: Task[]) => {
    setTasks(submittedTasks);
    setStep(AppStep.LOADING);
    setError(null);

    try {
      const diagnosisResult = await analyzeAutomationPotential(submittedTasks);
      setResult(diagnosisResult);
      setStep(AppStep.RESULTS);
    } catch (err) {
      console.error(err);
      setError("AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요.");
      setStep(AppStep.DIAGNOSIS);
    }
  };

  const saveToHistory = () => {
    if (!result) return;
    
    const newEntry: SavedDiagnosis = {
      id: Date.now().toString(),
      date: new Date().toLocaleString('ko-KR'),
      tasks: [...tasks],
      result: { ...result }
    };

    const updatedHistory = [newEntry, ...history].slice(0, 10); // Keep last 10
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    alert("현재 결과가 진단 기록에 저장되었습니다.");
  };

  const loadFromHistory = (item: SavedDiagnosis) => {
    setTasks(item.tasks);
    setResult(item.result);
    setStep(AppStep.RESULTS);
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleReset = () => {
    setStep(AppStep.INTRO);
  };

  return (
    <Layout>
      {step === AppStep.INTRO && (
        <IntroScreen 
          onStart={handleStartDiagnosis} 
          history={history}
          onSelectHistory={loadFromHistory}
          onDeleteHistory={deleteHistoryItem}
        />
      )}
      
      {step === AppStep.DIAGNOSIS && (
        <DiagnosisForm 
          onComplete={handleFinishDiagnosis} 
          initialTasks={tasks}
          error={error}
        />
      )}

      {step === AppStep.LOADING && (
        <LoadingScreen />
      )}

      {step === AppStep.RESULTS && result && (
        <ResultsDashboard 
          result={result} 
          tasks={tasks} 
          onReset={handleReset} 
          onSave={saveToHistory}
        />
      )}
    </Layout>
  );
};

export default App;
