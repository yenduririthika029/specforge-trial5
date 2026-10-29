import React, { useState, useRef } from 'react';
import { FullCourseSpecification } from '../types';
import { parseSyllabusFileContent, createBlankCourseSpecification } from '../api';
import { Upload, FileText, Check, AlertCircle, X, Download, RotateCcw } from 'lucide-react';

interface UploadCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCourse: (course: FullCourseSpecification) => void;
  onResetToBlank: () => void;
}

export default function UploadCourseModal({
  isOpen,
  onClose,
  onApplyCourse,
  onResetToBlank,
}: UploadCourseModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'template'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [parsedData, setParsedData] = useState<Partial<FullCourseSpecification> | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleProcessContent = (content: string, name: string) => {
    try {
      const parsed = parseSyllabusFileContent(content, name);
      setParsedData(parsed);
      setFileName(name);
      setStatusMessage('Course syllabus parsed successfully. Review the detected details below.');
    } catch {
      setStatusMessage('Could not parse file. Please verify formatting or use the paste tool.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleProcessContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      handleProcessContent(content, file.name);
    };
    reader.readAsText(file);
  };

  const handlePasteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim()) return;
    handleProcessContent(pastedText, 'Pasted_Syllabus.txt');
  };

  const handleConfirmApply = () => {
    if (!parsedData) return;
    const base = createBlankCourseSpecification();
    const merged: FullCourseSpecification = {
      ...base,
      ...parsedData,
      metadata: {
        ...base.metadata,
        ...(parsedData.metadata || {}),
      },
      units: parsedData.units && parsedData.units.length > 0 ? parsedData.units : base.units,
      textbooks: parsedData.textbooks || base.textbooks,
      courseOutcomes: parsedData.courseOutcomes || base.courseOutcomes,
      assessments: parsedData.assessments || base.assessments,
      bloomDistribution: parsedData.bloomDistribution || base.bloomDistribution,
    };
    onApplyCourse(merged);
    onClose();
  };

  const handleDownloadTemplate = () => {
    const template = createBlankCourseSpecification();
    template.metadata.courseCode = 'CS-101';
    template.metadata.courseTitle = 'Introduction to Computing';
    template.metadata.department = 'Department of Computer Science';
    template.metadata.academicRegulation = 'R-2024';
    template.units[0].title = 'Computational Foundations';
    template.units[0].topics = ['Algorithms', 'Data structures', 'Complexity'];
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'course_syllabus_template.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-2xl bg-white border border-[#CBD5E1] rounded shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#0F2756] text-white flex items-center justify-center">
              <Upload className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#0F172A]">
                Upload Course Files & Syllabus
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <span>Self-Service Course Intake</span>
                <span aria-hidden="true">·</span>
                <span>JSON / TXT / Markdown Supported</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="px-6 pt-3 pb-2 border-b border-[#E2E8F0] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#F1F5F9] p-1 rounded text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-1 font-medium rounded ${
                activeTab === 'upload' ? 'bg-white text-[#0F2756] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Upload File
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-3 py-1 font-medium rounded ${
                activeTab === 'paste' ? 'bg-white text-[#0F2756] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Paste Text / Markdown
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('template')}
              className={`px-3 py-1 font-medium rounded ${
                activeTab === 'template' ? 'bg-white text-[#0F2756] shadow-xs' : 'text-[#64748B]'
              }`}
            >
              Format Guide
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              if (confirm('Start with a completely blank course template?')) {
                onResetToBlank();
                onClose();
              }
            }}
            className="text-xs text-[#B91C1C] hover:underline flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Blank Template</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {activeTab === 'upload' && (
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-[#0F2756] bg-[#EAEDFF]'
                  : 'border-[#CBD5E1] hover:border-[#0F2756] bg-[#F8FAFC]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.txt,.md,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <FileText className="w-10 h-10 mx-auto text-[#64748B] mb-2" />
              <div className="font-serif text-sm font-semibold text-[#0F172A]">
                Click or drag & drop course syllabus file
              </div>
              <p className="text-xs text-[#64748B] mt-1">
                Accepts JSON course specifications, syllabus text, or syllabus outlines (.json, .txt, .md).
              </p>
            </div>
          )}

          {activeTab === 'paste' && (
            <form onSubmit={handlePasteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
                  Paste Syllabus Content
                </label>
                <textarea
                  rows={8}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste your syllabus text outline here... (e.g. Course Code: CS-101, Title: Advanced Algorithms, UNIT I: ..., Textbooks: ...)"
                  className="w-full p-3 font-mono text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756]"
                />
              </div>
              <button
                type="submit"
                disabled={!pastedText.trim()}
                className="px-4 py-2 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] disabled:opacity-50 rounded transition-colors"
              >
                Parse Pasted Content
              </button>
            </form>
          )}

          {activeTab === 'template' && (
            <div className="space-y-3 text-xs text-[#334155]">
              <p>
                You can upload a standardized JSON file or a plain text syllabus outline. The portal will automatically detect:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Course Code & Title</strong>: lines like <code className="bg-[#F1F5F9] px-1 py-0.5 rounded">Course Code: CS-301</code></li>
                <li><strong>Credits / Hours</strong>: lines like <code className="bg-[#F1F5F9] px-1 py-0.5 rounded">Credits: 3-0-2 (4.0 Credits)</code></li>
                <li><strong>Units / Modules</strong>: headings like <code className="bg-[#F1F5F9] px-1 py-0.5 rounded">UNIT I: Foundations</code> followed by bulleted topics</li>
                <li><strong>Textbooks & References</strong>: lines starting with <code className="bg-[#F1F5F9] px-1 py-0.5 rounded">Textbook: Title by Author</code></li>
                <li><strong>Course Outcomes (COs)</strong>: lines like <code className="bg-[#F1F5F9] px-1 py-0.5 rounded">CO1: Outcome statement</code></li>
              </ul>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="px-3 py-1.5 text-xs font-medium text-[#0F2756] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded transition-colors flex items-center gap-1.5 mt-2"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Sample Course Template (.json)</span>
              </button>
            </div>
          )}

          {/* Status and Parsed Preview */}
          {statusMessage && (
            <div className="p-3 bg-[#EAEDFF] border border-[#CBD5E1] rounded text-xs text-[#0F2756] flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{statusMessage}</span>
            </div>
          )}

          {parsedData && (
            <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded space-y-3">
              <div className="font-serif text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center justify-between">
                <span>Detected Course Details ({fileName})</span>
                <span className="text-[10px] text-[#15803D] font-mono font-bold">READY TO LOAD</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Course Code</span>
                  <span className="font-mono font-bold text-[#0F172A]">
                    {parsedData.metadata?.courseCode || '(Not specified - enter manually)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Course Title</span>
                  <span className="font-serif font-bold text-[#0F172A] truncate block">
                    {parsedData.metadata?.courseTitle || '(Not specified - enter manually)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Department</span>
                  <span className="text-[#0F172A]">
                    {parsedData.metadata?.department || '(Not specified)'}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block text-[10px] uppercase font-semibold">Units Detected</span>
                  <span className="font-mono font-bold text-[#0F172A]">
                    {parsedData.units?.filter((u) => u.title || u.topics.length > 0).length || 0} Modules
                  </span>
                </div>
              </div>

              {parsedData.textbooks && parsedData.textbooks.length > 0 && (
                <div className="text-[11px] text-[#334155]">
                  <span className="font-semibold">Textbooks:</span> {parsedData.textbooks.length} references found.
                </div>
              )}

              {parsedData.courseOutcomes && parsedData.courseOutcomes.length > 0 && (
                <div className="text-[11px] text-[#334155]">
                  <span className="font-semibold">Outcomes:</span> {parsedData.courseOutcomes.length} Course Outcomes (COs) found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-[#334155] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9]"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!parsedData}
            onClick={handleConfirmApply}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2756] hover:bg-[#1E3A8A] disabled:opacity-40 rounded transition-colors flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply to Course Specification</span>
          </button>
        </div>
      </div>
    </div>
  );
}
