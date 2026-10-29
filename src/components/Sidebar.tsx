import React from 'react';
import { Check, BookOpen, Layers, BarChart3, Grid, FileCheck2, Award } from 'lucide-react';
import { CourseMetadata } from '../types';

export interface StepItem {
  id: number;
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
  metadata: CourseMetadata;
  completedSteps: number[];
}

export const STEPS: StepItem[] = [
  {
    id: 1,
    key: 'overview',
    title: 'Course Overview',
    subtitle: 'Metadata & L-T-P-C Credits',
    icon: <BookOpen className="w-4 h-4" />,
  },
  {
    id: 2,
    key: 'units',
    title: 'Syllabus Units',
    subtitle: '5-Unit Modules & Topics',
    icon: <Layers className="w-4 h-4" />,
  },
  {
    id: 3,
    key: 'assessment',
    title: 'Assessment Pattern',
    subtitle: 'CIE, SEE & Bloom Weight',
    icon: <BarChart3 className="w-4 h-4" />,
  },
  {
    id: 4,
    key: 'matrix',
    title: 'CO-PO-PSO Matrix',
    subtitle: 'Outcome Correlation Grid',
    icon: <Grid className="w-4 h-4" />,
  },
  {
    id: 5,
    key: 'review',
    title: 'Governance Review',
    subtitle: 'Compliance & BoS Locking',
    icon: <FileCheck2 className="w-4 h-4" />,
  },
];

export default function Sidebar({
  currentStep,
  onSelectStep,
  metadata,
  completedSteps,
}: SidebarProps) {
  return (
    <aside className="w-64 shrink-0 bg-white border-r border-[#CBD5E1] p-5 flex flex-col justify-between min-h-[calc(100vh-4rem)]">
      <div>
        {/* Institutional Course Header Card */}
        <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded p-3 mb-6">
          <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
            Course Specification
          </div>
          <div className="font-serif text-sm font-bold text-[#0F172A] leading-snug line-clamp-2">
            {metadata.courseTitle}
          </div>
          <div className="mt-2.5 pt-2 border-t border-[#E2E8F0] grid grid-cols-2 gap-2 text-[11px]">
            <div>
              <span className="text-[#64748B] block">Code:</span>
              <span className="font-mono font-semibold text-[#0F172A]">{metadata.courseCode}</span>
            </div>
            <div>
              <span className="text-[#64748B] block">Credits:</span>
              <span className="font-mono font-semibold text-[#0F172A]">
                {metadata.totalCredits}.0 ({metadata.lectureHours}-{metadata.tutorialHours}-{metadata.practicalHours})
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Label */}
        <div className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-3 px-1">
          Specification Pipeline
        </div>

        {/* Vertical Stepper */}
        <div className="relative pl-1">
          {/* Continuous vertical line guide */}
          <div
            className="absolute left-[19px] top-4 bottom-5 w-[2px] bg-[#E2E8F0]"
            aria-hidden="true"
          />

          <nav className="space-y-4 relative" aria-label="Curriculum specification steps">
            {STEPS.map((step) => {
              const isActive = currentStep === step.id;
              const isCompleted = completedSteps.includes(step.id);

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => onSelectStep(step.id)}
                  className={`w-full text-left flex items-start gap-3 p-1 rounded transition-colors group focus:outline-none focus:ring-1 focus:ring-[#0F2756] ${
                    isActive ? 'bg-[#F8FAFC]' : 'hover:bg-[#F8FAFC]/60'
                  }`}
                >
                  {/* Step Node */}
                  <div className="relative shrink-0 z-10">
                    {isCompleted && !isActive ? (
                      <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center shadow-xs">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    ) : isActive ? (
                      <div className="w-8 h-8 rounded-full bg-[#0F2756] text-white flex items-center justify-center font-semibold text-xs shadow-xs ring-4 ring-[#EAEDFF]">
                        {step.id}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white border border-[#CBD5E1] text-[#64748B] flex items-center justify-center font-medium text-xs group-hover:border-[#94A3B8]">
                        {step.id}
                      </div>
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="pt-0.5 min-w-0">
                    <div
                      className={`text-xs font-semibold leading-tight truncate ${
                        isActive ? 'text-[#0F2756]' : 'text-[#334155]'
                      }`}
                    >
                      {step.title}
                    </div>
                    <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {step.subtitle}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Institutional Accreditation Footnote */}
      <div className="pt-4 border-t border-[#E2E8F0] text-[11px] text-[#64748B] space-y-1.5">
        <div className="flex items-center gap-1.5 font-semibold text-[#0F172A]">
          <Award className="w-3.5 h-3.5 text-[#15803D]" />
          <span>Accreditation Standard</span>
        </div>
        <p className="leading-tight text-[10px]">
          Compliant with NBA Tier-I OBE guidelines, Washington Accord & NEP 2024.
        </p>
      </div>
    </aside>
  );
}
