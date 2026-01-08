import React from 'react';
import { Link } from 'react-router-dom';
import Layout from "@/components/layout/Layout";
import { BookOpen, FolderOpen, FileText, Trophy, Plus, HelpCircle, LayoutDashboard, TrendingUp } from 'lucide-react';
import { useQuizStats } from "@/hooks/useQuiz";
import LoadingState from "@/components/common/LoadingState";

const QuizDashboard = () => {
  const { data: stats, isLoading } = useQuizStats();

  const cards = [
    { title: 'Total Courses', value: stats?.courses || 0, icon: BookOpen, link: '/quiz/courses', color: 'bg-indigo-500' },
    { title: 'Categories', value: stats?.categories || 0, icon: FolderOpen, link: '/quiz/categories', color: 'bg-emerald-500' },
    { title: 'Question Sets', value: stats?.questionSets || 0, icon: FileText, link: '/quiz/question-sets', color: 'bg-amber-500' },
    { title: 'Quiz Results', value: stats?.results || 0, icon: Trophy, link: '/quiz/results', color: 'bg-cyan-500' },
  ];

  if (isLoading) {
    return (
      <div className="p-8">
        <LoadingState type="stats" />
      </div>
    );
  }

  return (
    <Layout>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3 tracking-tight">
              <LayoutDashboard size={32} className="text-indigo-600" />
              Quiz Management
            </h1>
            <p className="text-gray-500 mt-2 font-medium">
              Monitor and coordinate your assessment environment in real-time.
            </p>
          </div>
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-2xl text-xs font-black uppercase tracking-widest border border-indigo-100">
            <TrendingUp size={14} />
            Live Metrics Active
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="group relative bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-gray-50 hover:border-indigo-100 hover:shadow-indigo-100/50 transition-all duration-500 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full -mr-16 -mt-16 group-hover:bg-indigo-50 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <div className={`${card.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <Icon size={28} className="text-white" />
                  </div>
                  <h3 className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{card.title}</h3>
                  <p className="text-4xl font-black text-gray-900 tracking-tighter mb-4">{card.value.toLocaleString()}</p>
                  <Link
                    to={card.link}
                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-xs font-black uppercase tracking-widest group/link"
                  >
                    Configure
                    <span className="group-hover/link:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-indigo-600/10 rounded-full -mr-48 -mb-48 blur-3xl"></div>
          <div className="relative z-10">
            <h3 className="text-xl font-black text-white mb-8 flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl">
                <Plus size={20} className="text-white" />
              </div>
              Streamlined Actions
            </h3>
            <div className="flex gap-4 flex-wrap">
              <Link
                to="/quiz/categories"
                className="px-8 py-4 bg-indigo-600 text-white rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:scale-105 transition-all shadow-xl shadow-indigo-600/20"
              >
                Add Category
              </Link>
              <Link
                to="/quiz/question-sets"
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-md"
              >
                Create Question Set
              </Link>
              <Link
                to="/quiz/questions"
                className="px-8 py-4 bg-white/10 text-white border border-white/20 rounded-[1.25rem] font-black text-xs uppercase tracking-widest hover:bg-white/20 hover:scale-105 transition-all backdrop-blur-md"
              >
                Manage Question Bank
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default QuizDashboard;
