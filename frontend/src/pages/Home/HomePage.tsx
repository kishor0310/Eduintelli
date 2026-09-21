import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { SpeakButton } from '../../components/voice/SpeakButton';
import {
  Brain,
  Sparkles,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
  GraduationCap,
  Users,
  Shield,
  Target,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { quickLoginAs } = useAuth();
  const navigate = useNavigate();

  const handleDemoAccess = async (role: 'STUDENT' | 'TEACHER' | 'ADMIN', studentId?: string) => {
    await quickLoginAs(role, studentId);
    if (role === 'STUDENT') navigate('/student/dashboard');
    else if (role === 'TEACHER') navigate('/teacher/dashboard');
    else if (role === 'ADMIN') navigate('/admin/dashboard');
  };

  const heroSpeech = "Welcome to EduIntelli, the next generation academic early intervention platform. We convert raw attendance, assignments, and examination signals into a continuous predictive intelligence layer so students improve and teachers can intervene before exams occur.";

  return (
    <div className="space-y-24 py-8 lg:py-16 px-4 lg:px-8 max-w-7xl mx-auto text-slate-800 dark:text-slate-100">
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 pt-4 lg:pt-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
          <span>Next-Generation Academic Early-Intervention Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
          Turn Academic Data Into{' '}
          <span className="ai-gradient-text">Better Decisions.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          AI-powered academic intelligence that helps students improve before exams, teachers intervene early, and institutions make continuous data-driven decisions.
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <SpeakButton
            text={heroSpeech}
            title="EduIntelli Platform Overview"
            label="Listen to Introduction"
            size="md"
            variant="default"
          />

          <Button
            size="lg"
            variant="ai"
            onClick={() => handleDemoAccess('STUDENT', 'std-01')}
            className="gap-2 text-sm shadow-md"
          >
            <span>Explore Student Platform</span>
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleDemoAccess('TEACHER')}
            className="gap-2 text-sm"
          >
            <Users className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            <span>Faculty Intervention Portal</span>
          </Button>

          <Link to="/courses">
            <Button size="lg" variant="outline" className="gap-2 text-sm">
              <span>View Courses</span>
            </Button>
          </Link>
        </div>

        {/* Quick Demo Switch Hint */}
        <div className="pt-4 flex items-center justify-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>100% Interactive Demo Data with 21 seeded students, multi-factor risk engine & Voiceover.</span>
        </div>
      </section>

      {/* 2. STATS COUNTER */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
        <Card className="text-center p-6 bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-4xl font-extrabold text-slate-900 dark:text-white mb-1">95%</div>
          <div className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">Academic Visibility</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Unified intelligence layer eliminating fragmented data silos across classes.</p>
        </Card>

        <Card className="text-center p-6 bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 border border-purple-200 dark:border-purple-500/30 shadow-xs">
          <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-300 mb-1">87%</div>
          <div className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">Early Risk Detection</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Predictive trajectory warning students and faculty weeks prior to examination failure.</p>
        </Card>

        <Card className="text-center p-6 bg-white dark:bg-gradient-to-b dark:from-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mb-1">3x</div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Faster Intervention</div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Actionable 1-click teacher mentoring workflows that prevent course dropouts.</p>
        </Card>
      </section>

      {/* 3. HOW IT WORKS: 5-STAGE INTELLIGENCE PIPELINE */}
      <section id="how-it-works" className="space-y-8 text-center">
        <div>
          <Badge variant="ai" size="sm" className="mb-2">
            Continuous Intelligence Flow
          </Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            From Raw Data to Personalized Action
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto mt-2">
            EduIntelli converts fragmented records into early academic diagnostics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-left">
          {[
            {
              step: '01',
              title: 'Academic Data',
              desc: 'Continuous ingestion of attendance timestamps, assignment scores, and midterm marks.',
              icon: <BarChart3 className="w-5 h-5 text-sky-600 dark:text-sky-400" />,
            },
            {
              step: '02',
              title: 'AI Analysis',
              desc: 'Normalization, subject variance computation, and historical velocity delta modeling.',
              icon: <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
            },
            {
              step: '03',
              title: 'Risk Detection',
              desc: 'Transparent 4-factor risk scoring classifying students into Low, Medium, or High risk.',
              icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
            },
            {
              step: '04',
              title: 'Explainable Insights',
              desc: 'Causal diagnostics answering "Why am I at risk?" alongside positive milestones.',
              icon: <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
            },
            {
              step: '05',
              title: 'Targeted Action',
              desc: '7-day micro-study plans for students and instant intervention alerts for faculty.',
              icon: <Target className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
            },
          ].map((card, i) => (
            <Card
              key={i}
              className="p-5 relative bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:border-brand-300 dark:hover:border-slate-700 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{card.icon}</div>
                  <span className="font-mono text-xs font-bold text-slate-400">{card.step}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{card.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* 4. AI INTELLIGENCE HIGHLIGHT: SAMPLE EXPLAINABLE CARD */}
      <section id="ai-engine" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="ai" size="sm" className="mb-2">Explainable AI Core</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Not Just a Chatbot. An Active Intelligence Engine.
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Every insight is mathematically grounded with causal reasons and immediate remedy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
          {/* Sample AI Card Preview */}
          <Card className="border border-purple-200 dark:border-purple-500/40 bg-white dark:bg-gradient-to-br dark:from-slate-900 dark:via-slate-900/90 dark:to-purple-950/40 shadow-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-500/30">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">AI Academic Diagnostic</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Student: Jordan Hayes (CS2023-002)</p>
                </div>
              </div>
              <Badge variant="danger" size="sm">
                High Risk: 78/100
              </Badge>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
                <div className="font-bold text-rose-600 dark:text-rose-400 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Why is this student at risk?</span>
                </div>
                <ul className="space-y-1 text-slate-700 dark:text-slate-300 text-[11px] list-disc list-inside">
                  <li>Attendance dropped to 62% in Discrete Mathematics (below 75% threshold).</li>
                  <li>2 consecutive assignments submitted late in Operating Systems.</li>
                  <li>Midterm examination score declined by 18% compared to continuous baseline.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30">
                <div className="font-bold text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Personalized 7-Day Action Plan</span>
                </div>
                <p className="text-[11px] text-emerald-700 dark:text-emerald-200">
                  Prioritize Discrete Mathematics graph algorithms for the next 7 days. Attend Monday and Wednesday lectures without absence.
                </p>
              </div>
            </div>
          </Card>

          {/* Value Props Breakdown */}
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                <span>Transparent Scoring Formulation</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Risk is computed transparently: <strong>Attendance (25%) + Assignments (20%) + Exams (35%) + Performance Trend (20%)</strong>. No opaque black-box predictions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Positive Reinforcement & Strengths</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                The AI highlights strengths just as vigorously as risks — celebrating when a student improves Java mastery by 18% or achieves top 10% class velocity.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1 shadow-xs">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>Voice-First Conversational Intelligence</span>
              </h4>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Integrated SpeechSynthesis and Web Speech recognition allow real-time voice consultations, audio briefs, and diagnostic readouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ROLE PORTALS SHOWCASE */}
      <section id="features" className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <Badge variant="default" size="sm" className="mb-2">Role-Based Intelligence</Badge>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Designed for Every Stakeholder
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Tailored analytics and workflows for Students, Faculty, and Institutional Administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student Card */}
          <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex flex-col justify-between hover:border-emerald-500/50 transition-all shadow-xs">
            <div>
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30 inline-block mb-3">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Student Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Personalized dashboard with transparent risk score, weak subject priorities, 7-day action tasks, and downloadable official transcripts.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Interactive Risk Gauge & Voice Diagnostics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Subject Radar & Cohort Benchmarks</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>AI Study Priorities & Action Roadmap</span>
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoAccess('STUDENT', 'std-01')}
              className="mt-6 w-full gap-2 text-xs"
            >
              <span>Launch Student Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          {/* Teacher Card */}
          <Card className="p-6 border border-purple-200 dark:border-purple-500/30 bg-white dark:bg-slate-900/80 flex flex-col justify-between shadow-xs hover:border-purple-400 transition-all">
            <div>
              <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-500/30 inline-block mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Teacher Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Class health tracking, cohort risk distribution, 1-click batch attendance marking, assignment grading, and early intervention alerts.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>At-Risk Student Intervention Roster</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>1-Click Bulk Attendance Marker</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span>Assignment Grading & Pedagogical Feedback</span>
                </li>
              </ul>
            </div>
            <Button
              variant="ai"
              size="sm"
              onClick={() => handleDemoAccess('TEACHER')}
              className="mt-6 w-full gap-2 text-xs shadow-md"
            >
              <span>Launch Teacher Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>

          {/* Admin Card */}
          <Card className="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 flex flex-col justify-between hover:border-sky-500/50 transition-all shadow-xs">
            <div>
              <div className="p-3 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/30 inline-block mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Administrator Portal</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                Executive institution-wide KPIs, department performance comparisons, course failure probability analytics, and academic retention audits.
              </p>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Cross-Department Comparative Analytics</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Institutional Risk Trend Forecasting</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  <span>Faculty & Student Roster Audits</span>
                </li>
              </ul>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDemoAccess('ADMIN')}
              className="mt-6 w-full gap-2 text-xs"
            >
              <span>Launch Admin Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Card>
        </div>
      </section>

      {/* 6. BOTTOM BANNER */}
      <Card className="p-8 lg:p-12 text-center bg-gradient-to-r from-brand-50 via-purple-50 to-indigo-50 dark:from-brand-900/40 dark:via-purple-900/40 dark:to-slate-900 border border-purple-200 dark:border-purple-500/30 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ready to Experience the AI Academic Intelligence Layer?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Switch between personas with zero login friction or test your own custom academic workflows.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="ai"
              onClick={() => handleDemoAccess('STUDENT', 'std-02')}
              className="gap-2 text-xs"
            >
              <AlertTriangle className="w-4 h-4 text-amber-300" />
              <span>Inspect At-Risk Student (Jordan Hayes)</span>
            </Button>
            <Link to="/reports">
              <Button size="lg" variant="secondary" className="gap-2 text-xs">
                <span>View Performance Dossier</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
