import { useState } from 'react';
import { FullCourseSpecification } from '../types';
import { Printer, Copy, Check, X, BookOpen, Download } from 'lucide-react';

interface ExportGazetteModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseData: FullCourseSpecification;
}

export default function ExportGazetteModal({
  isOpen,
  onClose,
  courseData,
}: ExportGazetteModalProps) {
  const [copied, setCopied] = useState(false);
  const [activeFormat, setActiveFormat] = useState<'preview' | 'html'>('preview');

  if (!isOpen) return null;

  const { metadata, units, textbooks, assessments, bloomDistribution, courseOutcomes, programOutcomes, matrix } =
    courseData;

  const generateHTMLDocument = () => {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${metadata.courseCode}: ${metadata.courseTitle} - Academic Syllabus Gazette</title>
  <style>
    body { font-family: 'Times New Roman', Times, serif; color: #111; max-width: 900px; margin: 40px auto; padding: 0 20px; line-height: 1.5; font-size: 14px; }
    h1, h2, h3 { font-family: 'Georgia', serif; color: #0F2756; margin-bottom: 6px; }
    .header-box { text-align: center; border-bottom: 2px solid #0F2756; padding-bottom: 16px; margin-bottom: 24px; }
    .meta-table, .data-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    .meta-table td, .meta-table th, .data-table td, .data-table th { border: 1px solid #CBD5E1; padding: 6px 10px; font-size: 13px; }
    .meta-table th, .data-table th { background: #F8FAFC; text-align: left; }
    .unit-box { margin-bottom: 20px; }
    .unit-title { font-weight: bold; color: #0F2756; margin-bottom: 4px; }
    .tabular { font-variant-numeric: tabular-nums; }
    @media print { body { margin: 0; padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  <div class="header-box">
    <h2>ACADEMIC COUNCIL SYLLABUS GAZETTE</h2>
    <h3>${metadata.department.toUpperCase()}</h3>
    <p>Regulation: ${metadata.academicRegulation} | Academic Year: ${metadata.academicYear}</p>
  </div>

  <h2>${metadata.courseCode}: ${metadata.courseTitle}</h2>
  <table class="meta-table">
    <tr>
      <th>Course Category</th><td>${metadata.courseCategory}</td>
      <th>Credits (L-T-P-C)</th><td class="tabular">${metadata.lectureHours}-${metadata.tutorialHours}-${metadata.practicalHours}-${metadata.totalCredits} (${metadata.totalCredits} Credits)</td>
    </tr>
    <tr>
      <th>Total Contact Hours</th><td class="tabular">${metadata.totalContactHours} Hours</td>
      <th>Prerequisites</th><td>${metadata.prerequisites}</td>
    </tr>
  </table>

  <h3>Course Objectives</h3>
  <ol>
    ${metadata.courseObjectives.map((o) => `<li>${o}</li>`).join('')}
  </ol>

  <h3>Syllabus Content (5 Modules)</h3>
  ${units
    .map(
      (u) => `
    <div class="unit-box">
      <div class="unit-title">${u.unitRoman}: ${u.title} (${u.contactHours} Contact Hours)</div>
      <p>${u.description}</p>
      <ul>
        ${u.topics.map((t) => `<li>${t}</li>`).join('')}
      </ul>
      ${u.labExperiments && u.labExperiments.length > 0 ? `<strong>Lab Component:</strong> ${u.labExperiments.join('; ')}` : ''}
    </div>
  `
    )
    .join('')}

  <h3>Course Outcomes (COs)</h3>
  <table class="data-table">
    <thead>
      <tr><th>Code</th><th>Course Outcome Statement</th><th>Bloom's Taxonomy</th></tr>
    </thead>
    <tbody>
      ${courseOutcomes
        .map(
          (co) => `
        <tr>
          <td><strong>${co.id}</strong></td>
          <td>${co.description}</td>
          <td>${co.bloomLevel}</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h3>Assessment Scheme</h3>
  <table class="data-table">
    <thead><tr><th>Assessment</th><th>Type</th><th>Max Marks</th><th>Weightage</th></tr></thead>
    <tbody>
      ${assessments
        .map(
          (a) => `
        <tr>
          <td>${a.name}</td><td>${a.type}</td><td>${a.maxMarks}</td><td>${a.weightage}%</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h3>Prescribed Textbooks</h3>
  <ol>
    ${textbooks.map((b) => `<li>${b.authors}, <em>"${b.title}"</em>, ${b.edition}, ${b.publisher}, ${b.year}. ISBN: ${b.isbn || 'N/A'}.</li>`).join('')}
  </ol>
</body>
</html>`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateHTMLDocument());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHTML = () => {
    const html = generateHTMLDocument();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${metadata.courseCode}_Syllabus_Gazette.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F172A]/60 backdrop-blur-xs p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-4xl bg-white border border-[#CBD5E1] rounded shadow-xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F8FAFC] border-b border-[#CBD5E1] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#0F2756] text-white flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif text-base font-bold text-[#0F172A]">
                Academic Senate Gazette Document Preview
              </h2>
              <div className="flex items-center gap-2 text-xs text-[#64748B]">
                <span>{metadata.courseCode}</span>
                <span aria-hidden="true">·</span>
                <span>{metadata.academicRegulation}</span>
                <span aria-hidden="true">·</span>
                <span>Formal Archival Record</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F1F5F9] border border-[#CBD5E1] rounded p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setActiveFormat('preview')}
                className={`px-3 py-1 font-medium rounded ${
                  activeFormat === 'preview'
                    ? 'bg-white text-[#0F2756] shadow-xs'
                    : 'text-[#64748B]'
                }`}
              >
                Gazette Preview
              </button>
              <button
                type="button"
                onClick={() => setActiveFormat('html')}
                className={`px-3 py-1 font-medium rounded ${
                  activeFormat === 'html'
                    ? 'bg-white text-[#0F2756] shadow-xs'
                    : 'text-[#64748B]'
                }`}
              >
                HTML Source
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          {activeFormat === 'preview' ? (
            <div className="max-w-3xl mx-auto bg-white border border-[#CBD5E1] rounded p-10 shadow-sm space-y-6 text-xs text-[#0F172A]">
              {/* Institutional Header */}
              <div className="text-center pb-6 border-b-2 border-[#0F2756] space-y-1">
                <div className="font-serif text-xs uppercase tracking-widest text-[#64748B] font-semibold">
                  Academic Council Specification Record
                </div>
                <h1 className="font-serif text-xl font-bold text-[#0F172A]">
                  {metadata.department.toUpperCase()}
                </h1>
                <p className="text-xs text-[#334155]">
                  Curriculum Regulation: <strong>{metadata.academicRegulation}</strong> · Academic Year: <strong>{metadata.academicYear}</strong>
                </p>
              </div>

              {/* Course Title and L-T-P-C */}
              <div className="space-y-1">
                <div className="text-[11px] font-mono font-bold text-[#0F2756]">
                  {metadata.courseCode} · {metadata.courseCategory}
                </div>
                <h2 className="font-serif text-lg font-bold text-[#0F172A]">
                  {metadata.courseTitle}
                </h2>
              </div>

              {/* Metadata Table */}
              <table className="w-full border-collapse border border-[#CBD5E1] text-xs">
                <tbody>
                  <tr className="border-b border-[#CBD5E1]">
                    <td className="bg-[#F8FAFC] font-semibold py-2 px-3 w-1/4 border-r border-[#CBD5E1]">
                      Credit Structure (L-T-P-C)
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums border-r border-[#CBD5E1]">
                      {metadata.lectureHours} - {metadata.tutorialHours} - {metadata.practicalHours} - {metadata.totalCredits} ({metadata.totalCredits}.0 Credits)
                    </td>
                    <td className="bg-[#F8FAFC] font-semibold py-2 px-3 w-1/4 border-r border-[#CBD5E1]">
                      Total Contact Hours
                    </td>
                    <td className="py-2 px-3 font-mono tabular-nums">
                      {metadata.totalContactHours} Hours
                    </td>
                  </tr>
                  <tr>
                    <td className="bg-[#F8FAFC] font-semibold py-2 px-3 border-r border-[#CBD5E1]">
                      Prerequisites
                    </td>
                    <td colSpan={3} className="py-2 px-3 font-mono text-[11px]">
                      {metadata.prerequisites}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Course Objectives */}
              <div>
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#0F2756] mb-2">
                  1. Course Educational Objectives
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-[#334155]">
                  {metadata.courseObjectives.map((obj, i) => (
                    <li key={i}>{obj}</li>
                  ))}
                </ol>
              </div>

              {/* 5-Unit Breakdown */}
              <div className="space-y-4">
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#0F2756]">
                  2. Modular Syllabus Blueprint (5 Units)
                </h3>
                {units.map((unit) => (
                  <div key={unit.unitNumber} className="border-t border-[#E2E8F0] pt-2 space-y-1">
                    <div className="flex items-center justify-between font-serif font-bold text-xs text-[#0F172A]">
                      <span>
                        {unit.unitRoman}: {unit.title}
                      </span>
                      <span className="font-mono text-[11px] font-semibold text-[#0F2756]">
                        {unit.contactHours} Contact Hours
                      </span>
                    </div>
                    <p className="text-[11px] text-[#64748B] italic">{unit.description}</p>
                    <ul className="list-disc pl-5 space-y-0.5 text-[#334155] text-[11px]">
                      {unit.topics.map((t, ti) => (
                        <li key={ti}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Course Outcomes */}
              <div>
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#0F2756] mb-2">
                  3. Course Outcomes (COs)
                </h3>
                <table className="w-full border-collapse border border-[#CBD5E1] text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#64748B] text-[10px] uppercase">
                      <th className="py-1.5 px-2 text-left w-16 border-r border-[#CBD5E1]">Code</th>
                      <th className="py-1.5 px-3 text-left border-r border-[#CBD5E1]">Statement</th>
                      <th className="py-1.5 px-2 text-center w-28">Bloom Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {courseOutcomes.map((co) => (
                      <tr key={co.id}>
                        <td className="py-1.5 px-2 font-mono font-bold text-[#0F2756] border-r border-[#CBD5E1]">
                          {co.id}
                        </td>
                        <td className="py-1.5 px-3 text-[#334155] border-r border-[#CBD5E1]">
                          {co.description}
                        </td>
                        <td className="py-1.5 px-2 text-center font-mono text-[10px]">
                          {co.bloomLevel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Assessment Table */}
              <div>
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#0F2756] mb-2">
                  4. Assessment & Evaluation Scheme
                </h3>
                <table className="w-full border-collapse border border-[#CBD5E1] text-xs">
                  <thead>
                    <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#64748B] text-[10px] uppercase">
                      <th className="py-1.5 px-3 text-left border-r border-[#CBD5E1]">Component</th>
                      <th className="py-1.5 px-2 text-center w-20 border-r border-[#CBD5E1]">Type</th>
                      <th className="py-1.5 px-2 text-center w-20 border-r border-[#CBD5E1]">Max Marks</th>
                      <th className="py-1.5 px-2 text-right w-24">Weightage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {assessments.map((a) => (
                      <tr key={a.id}>
                        <td className="py-1.5 px-3 font-medium border-r border-[#CBD5E1]">{a.name}</td>
                        <td className="py-1.5 px-2 text-center font-mono text-[11px] border-r border-[#CBD5E1]">{a.type}</td>
                        <td className="py-1.5 px-2 text-center font-mono tabular-nums border-r border-[#CBD5E1]">{a.maxMarks}</td>
                        <td className="py-1.5 px-2 text-right font-mono font-bold tabular-nums">{a.weightage}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Prescribed Literature */}
              <div>
                <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-[#0F2756] mb-2">
                  5. Prescribed Textbooks & References
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-[#334155] text-xs">
                  {textbooks.map((b) => (
                    <li key={b.id}>
                      {b.authors}, <em>&ldquo;{b.title}&rdquo;</em>, {b.edition}, {b.publisher}, {b.year}. ISBN: {b.isbn || 'N/A'}.
                    </li>
                  ))}
                </ol>
              </div>

              {/* Signoff Blocks */}
              <div className="pt-8 border-t border-[#CBD5E1] grid grid-cols-3 gap-6 text-center text-xs">
                <div>
                  <div className="h-10 border-b border-dashed border-[#CBD5E1] mb-1"></div>
                  <div className="font-bold text-[#0F172A]">{metadata.leadFaculty}</div>
                  <div className="text-[10px] text-[#64748B]">Course Coordinator (Author)</div>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-[#CBD5E1] mb-1"></div>
                  <div className="font-bold text-[#0F172A]">Prof. K. Venkatesh</div>
                  <div className="text-[10px] text-[#64748B]">Curriculum Review Committee Chair</div>
                </div>
                <div>
                  <div className="h-10 border-b border-dashed border-[#CBD5E1] mb-1"></div>
                  <div className="font-bold text-[#0F172A]">Dr. Meenakshi Sundaram</div>
                  <div className="text-[10px] text-[#64748B]">Head of Department (CSE)</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto bg-[#0F172A] text-[#E2E8F0] p-6 rounded font-mono text-xs overflow-x-auto">
              <pre className="whitespace-pre-wrap">{generateHTMLDocument()}</pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-[#CBD5E1] flex items-center justify-between">
          <div className="text-xs text-[#64748B]">
            Certified for statutory archiving under Academic Regulation {metadata.academicRegulation}.
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3 py-2 text-xs font-medium text-[#0F172A] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] transition-colors flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Copied HTML</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy HTML</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadHTML}
              className="px-3 py-2 text-xs font-medium text-[#0F172A] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Official Gazette</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
