import React, { useState } from 'react';
import { CourseMetadata, ReviewStatus, UserRole } from '../../types';
import { requestAIAcademicAssistance } from '../../api';
import { BookOpen, Sparkles, Plus, Trash2, CheckCircle2, Lock, Upload, FileText } from 'lucide-react';

interface BasicDetailsScreenProps {
  metadata: CourseMetadata;
  onChange: (updated: CourseMetadata) => void;
  currentRole: UserRole;
  status: ReviewStatus;
  onOpenUpload?: () => void;
}

export default function BasicDetailsScreen({
  metadata,
  onChange,
  currentRole,
  status,
  onOpenUpload,
}: BasicDetailsScreenProps) {
  const isReadOnly = (currentRole === 'Reviewer') || status === 'BOS_LOCKED';
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Recalculate credits dynamically based on L-T-P
  const handleLTPChange = (field: 'lectureHours' | 'tutorialHours' | 'practicalHours', value: number) => {
    const val = Math.max(0, value);
    const updated = { ...metadata, [field]: val };
    // L-T-P-C standard formula: 1L = 1 Credit, 1T = 1 Credit, 2P = 1 Credit
    const calculatedCredits = updated.lectureHours + updated.tutorialHours + Math.floor(updated.practicalHours / 2);
    const totalHours = (updated.lectureHours + updated.tutorialHours) * 15 + (updated.practicalHours * 15);
    onChange({
      ...updated,
      totalCredits: calculatedCredits,
      totalContactHours: totalHours,
    });
  };

  const handleAddObjective = () => {
    onChange({
      ...metadata,
      courseObjectives: [
        ...metadata.courseObjectives,
        'Formulate advanced architectural solutions with verified computational bounds.'
      ]
    });
  };

  const handleRemoveObjective = (index: number) => {
    const list = [...metadata.courseObjectives];
    list.splice(index, 1);
    onChange({ ...metadata, courseObjectives: list });
  };

  const handleUpdateObjective = (index: number, text: string) => {
    const list = [...metadata.courseObjectives];
    list[index] = text;
    onChange({ ...metadata, courseObjectives: list });
  };

  const handleAIAssistObjectives = async () => {
    setAiLoading(true);
    setAiMessage(null);
    try {
      const res = await requestAIAcademicAssistance(
        `Draft 5 rigorous course objectives for ${metadata.courseTitle} (${metadata.courseCode}) following Bloom's Revised Taxonomy action verbs for undergraduate engineering.`,
        {
          taskType: 'generate_objectives',
          courseTitle: metadata.courseTitle,
          courseCode: metadata.courseCode,
        }
      );
      setAiMessage(res.text);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Screen Title & Editorial Banner */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2756] uppercase tracking-wider mb-1">
            <BookOpen className="w-4 h-4" />
            <span>Curriculum Specification Phase I</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0F172A] tracking-tight">
            Course Metadata & Credit Allocation
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Authoritative institutional record defining course nomenclature, regulatory alignment, and contact hour parity.
          </p>
        </div>

        {isReadOnly && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F1F5F9] border border-[#CBD5E1] rounded text-xs text-[#515F74]">
            <Lock className="w-3.5 h-3.5 text-[#64748B]" />
            <span>Read-Only ({currentRole === 'Reviewer' ? 'Review Mode' : 'BoS Locked'})</span>
          </div>
        )}
      </div>

      {/* Upload Course Files Prompt Banner */}
      {(!metadata.courseCode || !metadata.courseTitle) && onOpenUpload && (
        <div className="p-4 bg-[#EAEDFF] border border-[#CBD5E1] rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-[#0F2756] text-white flex items-center justify-center shrink-0">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-serif font-bold text-[#0F172A]">
                Have a syllabus document or course specification file?
              </div>
              <p className="text-[11px] text-[#334155]">
                Upload JSON, Markdown, or plain text syllabus files to automatically populate all units, topics, and course metadata.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenUpload}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Course File</span>
          </button>
        </div>
      )}

      {/* Primary Specification Panel */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-6">
        <h2 className="font-serif text-base font-bold text-[#0F172A] pb-2 border-b border-[#E2E8F0]">
          Institutional Nomenclature & Governance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Course Code */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Course Code <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={metadata.courseCode}
              onChange={(e) => onChange({ ...metadata, courseCode: e.target.value })}
              placeholder="e.g. CS-401 or ME-202"
              className="w-full px-3 py-2 text-xs font-mono font-semibold bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] disabled:bg-[#F8FAFC]"
            />
          </div>

          {/* Academic Regulation */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Academic Regulation <span className="text-[#B91C1C]">*</span>
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={metadata.academicRegulation}
              onChange={(e) => onChange({ ...metadata, academicRegulation: e.target.value })}
              placeholder="e.g. R-2024 (NEP Aligned)"
              className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] disabled:bg-[#F8FAFC]"
            />
          </div>

          {/* Academic Year */}
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Academic Year & Semester
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                disabled={isReadOnly}
                value={metadata.academicYear}
                onChange={(e) => onChange({ ...metadata, academicYear: e.target.value })}
                placeholder="2026-2027"
                className="w-full px-2 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
              />
              <select
                disabled={isReadOnly}
                value={metadata.semester}
                onChange={(e) => onChange({ ...metadata, semester: Number(e.target.value) })}
                className="w-full px-2 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                  <option key={s} value={s}>
                    Semester {s}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course Title */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
            Official Course Title <span className="text-[#B91C1C]">*</span>
          </label>
          <input
            type="text"
            disabled={isReadOnly}
            value={metadata.courseTitle}
            onChange={(e) => onChange({ ...metadata, courseTitle: e.target.value })}
            placeholder="e.g. Distributed Systems & Cloud Infrastructure"
            className="w-full px-3 py-2 text-sm font-serif font-semibold bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] disabled:bg-[#F8FAFC]"
          />
        </div>

        {/* Department & Category */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Offering Department
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={metadata.department}
              onChange={(e) => onChange({ ...metadata, department: e.target.value })}
              placeholder="e.g. Department of Computer Science & Engineering"
              className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Course Category
            </label>
            <select
              disabled={isReadOnly}
              value={metadata.courseCategory}
              onChange={(e) => onChange({ ...metadata, courseCategory: e.target.value as any })}
              className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
            >
              <option value="Professional Core">Professional Core</option>
              <option value="Professional Elective">Professional Elective</option>
              <option value="Open Elective">Open Elective</option>
              <option value="Basic Science">Basic Science</option>
              <option value="Engineering Science">Engineering Science</option>
            </select>
          </div>
        </div>

        {/* Credit Structure L-T-P-C */}
        <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-serif text-xs font-bold text-[#0F172A] uppercase tracking-wider">
                Credit Structure (L - T - P - C)
              </span>
              <p className="text-[11px] text-[#64748B]">
                AICTE / NEP standard: 1 Lecture Hr = 1 Credit, 1 Tutorial Hr = 1 Credit, 2 Practical Hrs = 1 Credit.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase text-[#64748B] block font-semibold">Total Credits</span>
                <span className="font-mono text-base font-bold text-[#0F2756] tabular-nums">
                  {metadata.totalCredits}.0
                </span>
              </div>
              <div className="text-right pl-3 border-l border-[#CBD5E1]">
                <span className="text-[10px] uppercase text-[#64748B] block font-semibold">Contact Hours</span>
                <span className="font-mono text-base font-bold text-[#0F2756] tabular-nums">
                  {metadata.totalContactHours} hrs
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#334155] uppercase mb-1">
                Lecture (L)
              </label>
              <input
                type="number"
                min={0}
                max={6}
                disabled={isReadOnly}
                value={metadata.lectureHours}
                onChange={(e) => handleLTPChange('lectureHours', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold text-center bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#334155] uppercase mb-1">
                Tutorial (T)
              </label>
              <input
                type="number"
                min={0}
                max={4}
                disabled={isReadOnly}
                value={metadata.tutorialHours}
                onChange={(e) => handleLTPChange('tutorialHours', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold text-center bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#334155] uppercase mb-1">
                Practical (P)
              </label>
              <input
                type="number"
                min={0}
                max={8}
                disabled={isReadOnly}
                value={metadata.practicalHours}
                onChange={(e) => handleLTPChange('practicalHours', Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs font-mono font-bold text-center bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#334155] uppercase mb-1">
                Course Type
              </label>
              <select
                disabled={isReadOnly}
                value={metadata.courseType}
                onChange={(e) => onChange({ ...metadata, courseType: e.target.value as any })}
                className="w-full px-2 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
              >
                <option value="Integrated (Theory + Lab)">Integrated (Theory + Lab)</option>
                <option value="Theory Only">Theory Only</option>
                <option value="Laboratory Only">Laboratory Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Prerequisites & Lead Faculty */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Prerequisites
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={metadata.prerequisites}
              onChange={(e) => onChange({ ...metadata, prerequisites: e.target.value })}
              className="w-full px-3 py-2 text-xs font-mono bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
              placeholder="e.g. CS-302 Operating Systems"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Course Coordinator / Lead Faculty
            </label>
            <input
              type="text"
              disabled={isReadOnly}
              value={metadata.leadFaculty}
              onChange={(e) => onChange({ ...metadata, leadFaculty: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
            />
          </div>
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
            Course Catalog Description
          </label>
          <textarea
            rows={3}
            disabled={isReadOnly}
            value={metadata.courseDescription}
            onChange={(e) => onChange({ ...metadata, courseDescription: e.target.value })}
            className="w-full p-3 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] disabled:bg-[#F8FAFC]"
          />
        </div>
      </div>

      {/* Course Objectives Panel with AI Generation */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-serif text-base font-bold text-[#0F172A]">
              Course Educational Objectives
            </h2>
            <p className="text-xs text-[#64748B]">
              Broad statements defining curricular intent, teaching focus, and foundational subject exposure.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isReadOnly && (
              <>
                <button
                  type="button"
                  onClick={handleAIAssistObjectives}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2756] bg-[#EAEDFF] border border-[#CBD5E1] rounded hover:bg-[#D5E3FD] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiLoading ? 'Synthesizing...' : 'AI Suggest Objectives'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Objective</span>
                </button>
              </>
            )}
          </div>
        </div>

        {aiMessage && (
          <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs text-[#0F172A] space-y-2">
            <div className="flex items-center justify-between font-semibold text-[#0F2756]">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                Accreditation Assistant Draft
              </span>
              <button
                type="button"
                onClick={() => setAiMessage(null)}
                className="text-[11px] text-[#64748B] hover:text-[#0F172A]"
              >
                Dismiss
              </button>
            </div>
            <pre className="font-sans whitespace-pre-wrap text-[#334155] leading-relaxed">
              {aiMessage}
            </pre>
          </div>
        )}

        <div className="space-y-2.5">
          {metadata.courseObjectives.length === 0 ? (
            <div className="p-4 border border-dashed border-[#CBD5E1] rounded text-center text-xs text-[#64748B] space-y-2 bg-[#F8FAFC]">
              <p>No educational objectives specified yet.</p>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleAddObjective}
                  className="px-3 py-1.5 text-xs font-semibold text-[#0F2756] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] transition-colors"
                >
                  + Add First Objective
                </button>
              )}
            </div>
          ) : (
            metadata.courseObjectives.map((obj, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="w-6 h-6 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F2756] font-mono font-semibold text-xs flex items-center justify-center shrink-0 mt-1">
                  {idx + 1}
                </span>
                <input
                  type="text"
                  disabled={isReadOnly}
                  value={obj}
                  onChange={(e) => handleUpdateObjective(idx, e.target.value)}
                  placeholder="State measurable course objective..."
                  className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] disabled:bg-[#F8FAFC]"
                />
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(idx)}
                    className="p-1.5 text-[#64748B] hover:text-[#B91C1C] rounded mt-0.5"
                    title="Remove objective"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
