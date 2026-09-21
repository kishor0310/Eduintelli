import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../context/ToastContext';
import { SpeakButton } from '../../components/voice/SpeakButton';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
  Sparkles,
  ShieldCheck,
  Headphones,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    category: 'Risk Engine',
    question: 'How is the Multi-Factor Academic Risk Score computed?',
    answer: 'The EduIntelli Risk Engine computes an explainable 0-100 index based on 4 configurable weighted components: Attendance Risk (25%), Assignment Completion & Scores (20%), Examination Mastery (35%), and Longitudinal Velocity Trajectory (20%), plus compounding multi-factor failure penalties.',
  },
  {
    category: 'Attendance Policy',
    question: 'What is the mandatory attendance threshold?',
    answer: 'The institutional requirement is a minimum of 75% present attendance per course module. Students below 75% are automatically flagged with critical attendance threshold warnings.',
  },
  {
    category: 'Interventions',
    question: 'How do faculty interventions work?',
    answer: 'When a teacher or AI detects a student at risk, faculty can trigger a 1-click intervention (Academic Alert, 7-Day Micro Study Roadmap, or 1-on-1 Office Hour Meeting). The student is instantly notified with prioritized remediation steps.',
  },
  {
    category: 'AI Privacy',
    question: 'Is student data shared with external LLMs?',
    answer: 'EduIntelli runs an on-premise deterministic mathematical statistical engine. LLM integration (such as Google Gemini) is anonymized and runs on secure enterprise tokens with strict academic FERPA/GDPR compliance.',
  },
  {
    category: 'Reports & Transcripts',
    question: 'Can I print or download official performance dossiers?',
    answer: 'Yes! The Performance Dossier page (/reports) provides a print-ready, digitally hashed official academic report card including student profile, CGPA, AI diagnostic audit, and Dean authentication signature.',
  },
];

export const ContactPage: React.FC = () => {
  const toast = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [subject, setSubject] = useState('Academic Risk Assistance');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('Inquiry Dispatched', 'Academic Support Team will contact you within 24 hours.');
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  const contactVoiceSummary = `Welcome to the EduIntelli Academic Support and Advisory Center. If you have questions regarding attendance recovery, risk scores, or faculty mentoring, you can dispatch an inquiry or reach our hotline at 1 800 456 INTEL, or visit the Dean's office in Block 4.`;

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-4 px-4 lg:px-8">
      {/* 1. HEADER */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <Badge variant="ai" size="sm">
          Academic Support & Advisory Center
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          We&apos;re Here to Help You{' '}
          <span className="ai-gradient-text">Succeed.</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          Have questions regarding academic risk diagnostics, attendance recovery, or faculty interventions? Contact our Academic Affairs & Intelligence Team.
        </p>
        <div className="flex justify-center pt-2">
          <SpeakButton
            text={contactVoiceSummary}
            label="Listen to Advisory Overview"
            size="sm"
            variant="outline"
          />
        </div>
      </div>

      {/* 2. CONTACT CHANNELS & INTERVENTION REQUEST FORM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Contact Information Cards */}
        <div className="space-y-4">
          <Card className="p-5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Headphones className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>Institutional Support Channels</span>
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Email Academic Advisory</div>
                  <div className="text-slate-900 dark:text-slate-200 font-semibold mt-0.5">support@eduintelli.edu</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Response within 24 hours</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Advisory Helpline</div>
                  <div className="text-slate-900 dark:text-slate-200 font-semibold mt-0.5">+1 (800) 456-INTEL</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Mon - Fri: 8:00 AM - 6:00 PM EST</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Campus Headquarters</div>
                  <div className="text-slate-900 dark:text-slate-200 font-semibold mt-0.5">Academic Complex, Block 4</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Dean of Academic Affairs & QA</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400">Walk-in Office Hours</div>
                  <div className="text-slate-900 dark:text-slate-200 font-semibold mt-0.5">Monday – Friday</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">10:00 AM – 4:00 PM</div>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick System Status Card */}
          <Card className="p-4 border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>AI Intelligence Engine Status: 100% Operational</span>
            </div>
            <p className="text-[11px] text-slate-700 dark:text-slate-300">
              All 4 diagnostic models (Risk, Weak Subject, Recommendations, Insights) are processing continuous records with zero latency.
            </p>
          </Card>
        </div>

        {/* Right 2 Columns: Contact / Academic Assistance Form */}
        <Card className="lg:col-span-2 p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 space-y-5 shadow-sm">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Send Academic Inquiry or Intervention Request</span>
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Submit your inquiry and our academic counsellors will coordinate with your course faculty.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Your Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Institutional Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jordan.hayes@demo.com"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Your Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="STUDENT">Student</option>
                  <option value="TEACHER">Faculty / Instructor</option>
                  <option value="ADMIN">Institutional Administrator</option>
                  <option value="PARENT">Parent / Guardian</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Inquiry Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-brand-500"
                >
                  <option value="Academic Risk Assistance">Academic Risk Score Query</option>
                  <option value="Attendance Recovery">Attendance Threshold & Shortage</option>
                  <option value="Assignment & Examination Review">Assignment & Examination Review</option>
                  <option value="Faculty Mentoring Session">Request 1-on-1 Faculty Mentoring</option>
                  <option value="Technical Support">Platform Technical Issue</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Detailed Message / Description</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question, course code, or academic support requirements..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-brand-500 resize-none"
                required
              />
            </div>

            <Button
              type="submit"
              variant="ai"
              size="md"
              isLoading={isSubmitting}
              className="gap-2 text-xs shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Dispatch Academic Inquiry</span>
            </Button>
          </form>
        </Card>
      </div>

      {/* 3. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <div className="space-y-6 pt-4">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-5 h-5 text-sky-500 dark:text-sky-400" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Common questions regarding EduIntelli intelligence workflows, metrics, and scoring.
          </p>
        </div>

        <div className="space-y-3 max-w-4xl mx-auto">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <Card
                key={idx}
                className="p-4 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 cursor-pointer transition-all hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
                onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold border border-purple-200 dark:border-purple-500/30">
                      {faq.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{faq.question}</h4>
                  </div>
                  <div className="p-1 text-slate-400">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>

                {isOpen && (
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed animate-in fade-in">
                    {faq.answer}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
