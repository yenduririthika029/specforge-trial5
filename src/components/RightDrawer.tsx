import React, { useState } from 'react';
import { ComplianceCheck, ReviewComment, UserRole } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  MessageSquare,
  Send,
  ChevronRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface RightDrawerProps {
  isOpen: boolean;
  onToggle: () => void;
  complianceChecks: ComplianceCheck[];
  comments: ReviewComment[];
  currentRole: UserRole;
  onAddComment: (comment: string, section: string) => void;
  onResolveComment: (commentId: string) => void;
}

export default function RightDrawer({
  isOpen,
  onToggle,
  complianceChecks,
  comments,
  currentRole,
  onAddComment,
  onResolveComment,
}: RightDrawerProps) {
  const [activeTab, setActiveTab] = useState<'compliance' | 'comments'>('compliance');
  const [newComment, setNewComment] = useState('');
  const [selectedSection, setSelectedSection] = useState('General');

  const getStatusToken = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'VALID':
        return {
          text: 'text-[#15803D]',
          bg: 'bg-[#DCFCE7]',
          border: 'border-[#BBF7D0]',
          icon: <CheckCircle2 className="w-3.5 h-3.5" />,
          label: 'VALIDATED',
        };
      case 'PENDING':
        return {
          text: 'text-[#B45309]',
          bg: 'bg-[#FEF3C7]',
          border: 'border-[#FDE68A]',
          icon: <AlertTriangle className="w-3.5 h-3.5" />,
          label: 'PENDING',
        };
      case 'VIOLATION':
        return {
          text: 'text-[#B91C1C]',
          bg: 'bg-[#FEE2E2]',
          border: 'border-[#FECACA]',
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: 'VIOLATION',
        };
      case 'INFO':
        return {
          text: 'text-[#1D4ED8]',
          bg: 'bg-[#DBEAFE]',
          border: 'border-[#BFDBFE]',
          icon: <Info className="w-3.5 h-3.5" />,
          label: 'GUIDELINE',
        };
    }
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    onAddComment(newComment.trim(), selectedSection);
    setNewComment('');
  };

  const validCount = complianceChecks.filter((c) => c.status === 'VALID').length;

  return (
    <aside
      className={`shrink-0 bg-white border-l border-[#CBD5E1] transition-all duration-200 flex flex-col min-h-[calc(100vh-4rem)] ${
        isOpen ? 'w-80' : 'w-10'
      }`}
    >
      {/* Collapsed Bar */}
      {!isOpen && (
        <button
          onClick={onToggle}
          title="Open Compliance & Review Drawer"
          className="h-full w-full py-4 flex flex-col items-center justify-between text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC] transition-colors"
        >
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="w-4 h-4 text-[#0F2756]" />
            <span
              className="text-[11px] font-semibold uppercase tracking-widest text-[#334155] select-none"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              Audits & Review ({validCount}/{complianceChecks.length})
            </span>
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
      )}

      {/* Expanded Drawer */}
      {isOpen && (
        <div className="flex flex-col h-full">
          {/* Drawer Header */}
          <div className="p-4 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#0F2756]" />
              <h3 className="font-serif text-sm font-semibold text-[#0F172A]">
                Governance & Audit
              </h3>
            </div>
            <button
              onClick={onToggle}
              className="p-1 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded text-xs"
              title="Collapse drawer"
            >
              Collapse
            </button>
          </div>

          {/* Segmented Tab Switcher */}
          <div className="p-2 border-b border-[#E2E8F0] bg-white">
            <div className="grid grid-cols-2 gap-1 bg-[#F1F5F9] p-1 rounded">
              <button
                type="button"
                onClick={() => setActiveTab('compliance')}
                className={`py-1 text-xs font-semibold rounded text-center transition-all ${
                  activeTab === 'compliance'
                    ? 'bg-white text-[#0F2756] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Audits ({validCount}/{complianceChecks.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('comments')}
                className={`py-1 text-xs font-semibold rounded text-center transition-all ${
                  activeTab === 'comments'
                    ? 'bg-white text-[#0F2756] shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                Comments ({comments.length})
              </button>
            </div>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === 'compliance' ? (
              <div className="space-y-3">
                <div className="text-[11px] text-[#64748B]">
                  Automated checks validating NBA Tier-1 accreditation and NEP 2024 compliance.
                </div>

                {complianceChecks.map((item) => {
                  const token = getStatusToken(item.status);
                  return (
                    <div
                      key={item.id}
                      className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-1.5">
                        <span className="font-serif text-xs font-bold text-[#0F172A]">
                          {item.criterion}
                        </span>
                        <div
                          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-semibold uppercase rounded border ${token.text} ${token.bg} ${token.border}`}
                        >
                          {token.icon}
                          <span>{token.label}</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-[#334155] leading-relaxed">
                        {item.description}
                      </p>

                      <div className="pt-1 border-t border-[#E2E8F0] text-[10px] text-[#64748B] font-mono">
                        Ref: {item.standardRef}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="text-[11px] text-[#64748B]">
                  Formal curriculum review log between Author, Review Committee, and HOD.
                </div>

                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`p-3 rounded border text-xs space-y-1.5 ${
                      comment.resolved
                        ? 'bg-[#F8FAFC] border-[#E2E8F0] opacity-80'
                        : 'bg-white border-[#CBD5E1] shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-semibold text-[#0F172A] truncate">
                        {comment.author}
                      </div>
                      <span className="text-[10px] text-[#64748B] font-mono">
                        {comment.timestamp}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono font-medium text-[#0F2756] bg-[#EAEDFF] px-1.5 py-0.5 rounded inline-block">
                      {comment.section}
                    </div>

                    <p className="text-[#334155] leading-snug">{comment.comment}</p>

                    <div className="pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between">
                      <span
                        className={`text-[10px] font-semibold uppercase ${
                          comment.resolved ? 'text-[#15803D]' : 'text-[#B45309]'
                        }`}
                      >
                        {comment.resolved ? '✓ Resolved' : '● Action Required'}
                      </span>

                      {!comment.resolved && (currentRole === 'Reviewer' || currentRole === 'HOD') && (
                        <button
                          type="button"
                          onClick={() => onResolveComment(comment.id)}
                          className="text-[11px] text-[#0F2756] hover:underline flex items-center gap-1 font-medium"
                        >
                          <Check className="w-3 h-3" />
                          Mark Resolved
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Comment Input */}
                <form onSubmit={handlePostComment} className="pt-2 space-y-2">
                  <div className="text-[11px] font-semibold text-[#0F172A] uppercase tracking-wider">
                    Add Committee Review Note
                  </div>

                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value)}
                    className="w-full px-2 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A]"
                  >
                    <option value="General">General Specification</option>
                    <option value="Course Objectives">Course Objectives</option>
                    <option value="Unit I: Foundations">Unit I: Foundations</option>
                    <option value="Unit II: Consensus">Unit II: Consensus</option>
                    <option value="Unit III: Virtualization">Unit III: Virtualization</option>
                    <option value="Unit IV: Microservices">Unit IV: Microservices</option>
                    <option value="Unit V: Security">Unit V: Security</option>
                    <option value="Assessment Pattern">Assessment Pattern</option>
                    <option value="CO-PO-PSO Matrix">CO-PO-PSO Matrix</option>
                  </select>

                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={`Write committee observation as ${currentRole}...`}
                    className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756]"
                  />

                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    className="w-full py-1.5 px-3 text-xs font-semibold text-white bg-[#0F2756] hover:bg-[#1E3A8A] disabled:opacity-50 rounded transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>Post Review Note</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
