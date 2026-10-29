import { useState } from 'react';
import { FullCourseSpecification, ReviewStatus, UserRole } from '../../types';
import { requestAIAcademicAssistance } from '../../api';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  RotateCcw,
  Send,
  AlertTriangle,
  History,
  Stamp
} from 'lucide-react';

interface ReviewApprovalsScreenProps {
  courseData: FullCourseSpecification;
  onStatusChange: (
    newStatus: ReviewStatus,
    stageNote: string,
    actionBy: string
  ) => void;
  currentRole: UserRole;
  onOpenExport: () => void;
}

export default function ReviewApprovalsScreen({
  courseData,
  onStatusChange,
  currentRole,
  onOpenExport,
}: ReviewApprovalsScreenProps) {
  const [decisionNotes, setDecisionNotes] = useState('');
  const [aiAuditing, setAiAuditing] = useState(false);
  const [aiAuditReport, setAiAuditReport] = useState<string | null>(null);

  const { status, approvalHistory, complianceChecks } = courseData;

  const validComplianceCount = complianceChecks.filter((c) => c.status === 'VALID').length;
  const isAllCompliant = validComplianceCount === complianceChecks.length;

  const getStatusBannerConfig = () => {
    switch (status) {
      case 'DRAFT':
        return {
          title: 'Curriculum Specification Stage: Preliminary Draft',
          description:
            'Course coordinator is actively drafting syllabus modules, credit calculations, and course outcomes. Submissions are open to departmental peers.',
          borderLeft: 'border-l-4 border-l-[#64748B]',
          bg: 'bg-[#F8FAFC]',
          badgeText: 'DRAFT IN PROGRESS',
          badgeClass: 'text-[#475569] bg-[#E2E8F0] border-[#CBD5E1]',
          icon: <Clock className="w-5 h-5 text-[#64748B]" />,
        };
      case 'IN_REVIEW':
        return {
          title: 'Curriculum Specification Stage: Departmental Committee Review',
          description:
            'Curriculum Review Committee is auditing syllabus depth, Bloom taxonomy metrics, and NBA PO matrix mappings for institutional compliance.',
          borderLeft: 'border-l-4 border-l-[#B45309]',
          bg: 'bg-[#FFFBEB]',
          badgeText: 'PEER COMMITTEE AUDIT ACTIVE',
          badgeClass: 'text-[#B45309] bg-[#FEF3C7] border-[#FDE68A]',
          icon: <AlertTriangle className="w-5 h-5 text-[#B45309]" />,
        };
      case 'HOD_APPROVED':
        return {
          title: 'Curriculum Specification Stage: Head of Department Accredited',
          description:
            'Course specification has attained formal departmental signoff and is cleared for presentation to the Academic Council Board of Studies (BoS).',
          borderLeft: 'border-l-4 border-l-[#15803D]',
          bg: 'bg-[#F0FDF4]',
          badgeText: 'HOD ACCREDITED & SIGNED',
          badgeClass: 'text-[#15803D] bg-[#DCFCE7] border-[#BBF7D0]',
          icon: <CheckCircle2 className="w-5 h-5 text-[#15803D]" />,
        };
      case 'BOS_LOCKED':
        return {
          title: 'Curriculum Specification Stage: Board of Studies (BoS) Locked',
          description:
            'Course is officially gazetted into the Academic Senate registry. All fields are cryptographically immutable and archived for NBA/ABET audits.',
          borderLeft: 'border-l-4 border-l-[#0F2756]',
          bg: 'bg-[#EAEDFF]',
          badgeText: 'STATUTORY GAZETTE LOCKED',
          badgeClass: 'text-[#0F2756] bg-white border-[#CBD5E1]',
          icon: <Lock className="w-5 h-5 text-[#0F2756]" />,
        };
    }
  };

  const banner = getStatusBannerConfig();

  const handleAction = (nextStatus: ReviewStatus, defaultNote: string) => {
    const note = decisionNotes.trim() || defaultNote;
    let actorName = 'Faculty Member';
    if (currentRole === 'Author') actorName = 'Dr. Arvind Ramanathan (Author)';
    if (currentRole === 'Reviewer') actorName = 'Prof. K. Venkatesh (Review Committee)';
    if (currentRole === 'HOD') actorName = 'Dr. Meenakshi Sundaram (HOD, CSE)';

    onStatusChange(nextStatus, note, actorName);
    setDecisionNotes('');
  };

  const handleRunAIAudit = async () => {
    setAiAuditing(true);
    setAiAuditReport(null);
    try {
      const res = await requestAIAcademicAssistance(
        `Perform comprehensive NBA / ABET accreditation compliance audit on course syllabus for ${courseData.metadata.courseTitle} (${courseData.metadata.courseCode}).`,
        {
          taskType: 'audit_syllabus',
          courseTitle: courseData.metadata.courseTitle,
          courseCode: courseData.metadata.courseCode,
        }
      );
      setAiAuditReport(res.text);
    } catch (err) {
      console.error(err);
    } finally {
      setAiAuditing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Title & Editorial Banner */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2756] uppercase tracking-wider mb-1">
            <FileCheck2 className="w-4 h-4" />
            <span>Curriculum Specification Phase V</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0F172A] tracking-tight">
            Governance Review, Audit & Statutory Signoff
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Formal institutional review workflow governed by role permissions (Author, Review Committee, Head of Department).
          </p>
        </div>

        <button
          type="button"
          onClick={handleRunAIAudit}
          disabled={aiAuditing}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2756] bg-[#EAEDFF] border border-[#CBD5E1] rounded hover:bg-[#D5E3FD] transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{aiAuditing ? 'Auditing Standards...' : 'Run AI Accreditation Audit'}</span>
        </button>
      </div>

      {/* Review Status Banner (with 4px solid left accent border) */}
      <div
        className={`p-5 rounded border border-[#CBD5E1] ${banner.borderLeft} ${banner.bg} shadow-xs space-y-2`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {banner.icon}
            <h2 className="font-serif text-base font-bold text-[#0F172A]">
              {banner.title}
            </h2>
          </div>
          <span
            className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded border ${banner.badgeClass}`}
          >
            {banner.badgeText}
          </span>
        </div>
        <p className="text-xs text-[#334155] leading-relaxed max-w-4xl">
          {banner.description}
        </p>
      </div>

      {aiAuditReport && (
        <div className="p-4 bg-white border border-[#CBD5E1] rounded shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between font-serif font-bold text-[#0F2756]">
            <span>Statutory Accreditation Assessment Report</span>
            <button
              type="button"
              onClick={() => setAiAuditReport(null)}
              className="text-[11px] text-[#64748B]"
            >
              Dismiss
            </button>
          </div>
          <pre className="font-sans whitespace-pre-wrap text-[#334155] leading-relaxed">
            {aiAuditReport}
          </pre>
        </div>
      )}

      {/* Role-Based Action Panel */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-serif text-base font-bold text-[#0F172A] flex items-center gap-2">
              <Stamp className="w-4 h-4 text-[#0F2756]" />
              Role Authority Action Console ({currentRole})
            </h3>
            <p className="text-xs text-[#64748B]">
              Permissions enforced based on current active governance role.
            </p>
          </div>

          <div className="text-right text-xs">
            <span className="text-[#64748B] block">Compliance Readiness:</span>
            <span
              className={`font-mono font-bold tabular-nums ${
                isAllCompliant ? 'text-[#15803D]' : 'text-[#B45309]'
              }`}
            >
              {validComplianceCount} / {complianceChecks.length} Criteria Passed
            </span>
          </div>
        </div>

        {/* Action Decision Notes Input */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
            Governance Decision Notes / Justification
          </label>
          <textarea
            rows={2}
            value={decisionNotes}
            onChange={(e) => setDecisionNotes(e.target.value)}
            placeholder={`Enter official remarks as ${currentRole} before committing state transition...`}
            className="w-full p-2.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756]"
          />
        </div>

        {/* Action Controls for Author */}
        {currentRole === 'Author' && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {status === 'DRAFT' && (
              <button
                type="button"
                onClick={() =>
                  handleAction(
                    'IN_REVIEW',
                    'Course specification finalized by lead faculty and submitted for formal committee review.'
                  )
                }
                className="px-4 py-2 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit for Committee Review</span>
              </button>
            )}

            {status === 'IN_REVIEW' && (
              <div className="text-xs text-[#64748B] italic">
                Specification is presently under active review by the Curriculum Committee. Edits are locked until feedback is issued.
              </div>
            )}

            {(status === 'HOD_APPROVED' || status === 'BOS_LOCKED') && (
              <div className="text-xs text-[#15803D] font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Specification successfully accredited by departmental authority.</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls for Reviewer */}
        {currentRole === 'Reviewer' && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {status === 'IN_REVIEW' ? (
              <>
                <button
                  type="button"
                  onClick={() =>
                    handleAction(
                      'DRAFT',
                      'Curriculum Review Committee requests revisions on syllabus topics and practical rubrics.'
                    )
                  }
                  className="px-4 py-2 text-xs font-medium text-[#B91C1C] bg-white border border-[#B91C1C] hover:bg-[#FEE2E2] rounded transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Request Revisions (Reopen Draft)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleAction(
                      'HOD_APPROVED',
                      'Curriculum Review Committee completed audit; all 5 units and CO-PO mappings recommended for HOD signoff.'
                    )
                  }
                  className="px-4 py-2 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Recommend for HOD Approval</span>
                </button>
              </>
            ) : (
              <div className="text-xs text-[#64748B] italic">
                Reviewer actions are available when the status is IN_REVIEW. Current status: {status}.
              </div>
            )}
          </div>
        )}

        {/* Action Controls for HOD */}
        {currentRole === 'HOD' && (
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {status !== 'HOD_APPROVED' && status !== 'BOS_LOCKED' && (
              <button
                type="button"
                onClick={() =>
                  handleAction(
                    'HOD_APPROVED',
                    'Executive HOD approval granted following curriculum committee recommendation.'
                  )
                }
                className="px-4 py-2 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Specification (HOD Signoff)</span>
              </button>
            )}

            {status === 'HOD_APPROVED' && (
              <button
                type="button"
                onClick={() =>
                  handleAction(
                    'BOS_LOCKED',
                    'Statutory ratification complete: Locked into Academic Senate Gazette registry.'
                  )
                }
                className="px-4 py-2 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Lock for Board of Studies (BoS) Gazette</span>
              </button>
            )}

            {status === 'BOS_LOCKED' && (
              <button
                type="button"
                onClick={() =>
                  handleAction(
                    'DRAFT',
                    'Executive HOD override: unlocked specification for curriculum amendment.'
                  )
                }
                className="px-3 py-1.5 text-xs font-medium text-[#B91C1C] bg-white border border-[#B91C1C] hover:bg-[#FEE2E2] rounded transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reopen Draft (Executive Override)</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenExport}
              className="px-3 py-2 text-xs font-medium text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded transition-colors"
            >
              Preview Official Gazette Document
            </button>
          </div>
        )}
      </div>

      {/* Official Audit Trail History */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h3 className="font-serif text-base font-bold text-[#0F172A] flex items-center gap-2">
              <History className="w-4 h-4 text-[#0F2756]" />
              Official Institutional Audit Trail
            </h3>
            <p className="text-xs text-[#64748B]">
              Immutable event log certifying accreditation provenance for statutory inspection.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {approvalHistory.map((item, idx) => (
            <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-serif font-bold text-[#0F172A]">{item.stage}</span>
                  <span className="font-mono text-[10px] bg-[#EAEDFF] text-[#0F2756] px-1.5 py-0.5 rounded">
                    {item.role}
                  </span>
                  <span className="text-[#64748B] font-medium">by {item.actionBy}</span>
                </div>
                <p className="text-[#334155]">{item.notes}</p>
              </div>

              <div className="font-mono text-[11px] text-[#64748B] shrink-0">
                {item.timestamp}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
