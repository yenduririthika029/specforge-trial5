import { ReviewStatus, UserRole } from '../types';
import { Shield, Sparkles, Printer, Lock, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  status: ReviewStatus;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  courseCode: string;
}

export default function Header({
  currentRole,
  onRoleChange,
  status,
  onOpenSettings,
  onOpenExport,
  courseCode,
}: HeaderProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'DRAFT':
        return {
          label: 'DRAFT SPECIFICATION',
          textColor: 'text-[#64748B]',
          bgColor: 'bg-[#F1F5F9]',
          borderColor: 'border-[#CBD5E1]',
          icon: <Clock className="w-3.5 h-3.5" />,
        };
      case 'IN_REVIEW':
        return {
          label: 'IN COMMITTEE REVIEW',
          textColor: 'text-[#B45309]',
          bgColor: 'bg-[#FEF3C7]',
          borderColor: 'border-[#FDE68A]',
          icon: <AlertCircle className="w-3.5 h-3.5" />,
        };
      case 'HOD_APPROVED':
        return {
          label: 'HOD ACCREDITED',
          textColor: 'text-[#15803D]',
          bgColor: 'bg-[#DCFCE7]',
          borderColor: 'border-[#BBF7D0]',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
        };
      case 'BOS_LOCKED':
        return {
          label: 'BOARD OF STUDIES LOCKED',
          textColor: 'text-[#0F2756]',
          bgColor: 'bg-[#EAEDFF]',
          borderColor: 'border-[#CBD5E1]',
          icon: <Lock className="w-3.5 h-3.5" />,
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <header className="bg-white border-b border-[#CBD5E1] sticky top-0 z-40 select-none">
      <div className="max-w-[1520px] mx-auto px-6 h-16 flex items-center justify-between gap-6">
        {/* Zone 1: Wordmark & Institutional Anchor */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-[#0F2756] text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              CP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif text-lg font-bold text-[#0F172A] tracking-tight">
                  CurriculaPro
                </span>
                <span className="text-[11px] font-mono font-medium px-1.5 py-0.5 bg-[#F1F5F9] border border-[#E2E8F0] rounded text-[#334155]">
                  {courseCode}
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] tracking-tight">
                Academic Council Specification & Accreditation Portal
              </p>
            </div>
          </div>
        </div>

        {/* Zone 2: Status Indicator & Role Switcher */}
        <div className="hidden lg:flex items-center gap-5">
          {/* Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wider rounded border ${statusInfo.textColor} ${statusInfo.bgColor} ${statusInfo.borderColor}`}
          >
            {statusInfo.icon}
            <span>{statusInfo.label}</span>
          </div>

          {/* Role Switcher */}
          <div className="flex items-center gap-1.5 bg-[#F1F5F9] border border-[#E2E8F0] p-1 rounded">
            <span className="text-[11px] font-semibold text-[#64748B] uppercase px-2 tracking-wider">
              Role:
            </span>
            {(['Author', 'Reviewer', 'HOD'] as const).map((role) => {
              const active = currentRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => onRoleChange(role)}
                  className={`px-3 py-1 text-xs font-semibold rounded transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#0F2756] border border-[#E2E8F0] shadow-xs'
                      : 'text-[#515F74] hover:text-[#0F172A]'
                  }`}
                >
                  {role === 'Author' && 'Author (Faculty)'}
                  {role === 'Reviewer' && 'Reviewer (Committee)'}
                  {role === 'HOD' && 'HOD (Dean)'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Zone 3: Header Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] transition-colors"
            title="Configure AI Drafting Engine & Model Keys"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#0F2756]" />
            <span>AI Settings</span>
          </button>

          <button
            type="button"
            onClick={onOpenExport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export Gazette</span>
          </button>
        </div>
      </div>
    </header>
  );
}
