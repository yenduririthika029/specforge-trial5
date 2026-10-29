import { useState } from 'react';
import {
  CourseOutcome,
  ProgramOutcome,
  ProgramSpecificOutcome,
  MatrixValue,
  ReviewStatus,
  UserRole,
} from '../../types';
import { requestAIAcademicAssistance } from '../../api';
import { Grid, Sparkles, Plus, Trash2, HelpCircle } from 'lucide-react';

interface OutcomeMatrixScreenProps {
  courseOutcomes: CourseOutcome[];
  programOutcomes: ProgramOutcome[];
  programSpecificOutcomes: ProgramSpecificOutcome[];
  matrix: Record<string, MatrixValue>;
  onMatrixChange: (updated: Record<string, MatrixValue>) => void;
  onCourseOutcomesChange: (updated: CourseOutcome[]) => void;
  currentRole: UserRole;
  status: ReviewStatus;
}

export default function OutcomeMatrixScreen({
  courseOutcomes,
  programOutcomes,
  programSpecificOutcomes,
  matrix,
  onMatrixChange,
  onCourseOutcomesChange,
  currentRole,
  status,
}: OutcomeMatrixScreenProps) {
  const isReadOnly = currentRole === 'Reviewer' || status === 'BOS_LOCKED';
  const [selectedOutcomeHelp, setSelectedOutcomeHelp] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMatrixGuidance, setAiMatrixGuidance] = useState<string | null>(null);

  const allTargets = [
    ...programOutcomes.map((p) => ({ ...p, isPso: false })),
    ...programSpecificOutcomes.map((p) => ({ ...p, isPso: true })),
  ];

  const handleCellClick = (coId: string, targetId: string) => {
    if (isReadOnly) return;
    const key = `${coId}_${targetId}`;
    const currentVal = matrix[key] || 0;
    // Cycle 0 -> 1 -> 2 -> 3 -> 0
    const nextVal = ((currentVal + 1) % 4) as MatrixValue;
    onMatrixChange({ ...matrix, [key]: nextVal });
  };

  const handleSetCellDirect = (coId: string, targetId: string, val: MatrixValue) => {
    if (isReadOnly) return;
    const key = `${coId}_${targetId}`;
    onMatrixChange({ ...matrix, [key]: val });
  };

  const getCellColor = (val: MatrixValue) => {
    switch (val) {
      case 3:
        return 'bg-[#0F2756] text-white font-bold';
      case 2:
        return 'bg-[#515F74] text-white font-semibold';
      case 1:
        return 'bg-[#D5E3FD] text-[#0F2756] font-medium';
      case 0:
      default:
        return 'bg-white text-[#94A3B8]';
    }
  };

  // Compute column averages
  const calculateAverage = (targetId: string) => {
    let sum = 0;
    let count = 0;
    courseOutcomes.forEach((co) => {
      const val = matrix[`${co.id}_${targetId}`] || 0;
      if (val > 0) {
        sum += val;
        count++;
      }
    });
    return count > 0 ? (sum / count).toFixed(2) : '-';
  };

  const handleAddCO = () => {
    const nextNum = courseOutcomes.length + 1;
    const newCO: CourseOutcome = {
      id: `CO-${nextNum}`,
      code: `CS401.${nextNum}`,
      description: 'Formulate and evaluate distributed computing invariants with verifiable metrics.',
      bloomLevel: 'K5 - Evaluate',
    };
    onCourseOutcomesChange([...courseOutcomes, newCO]);
  };

  const handleRemoveCO = (id: string) => {
    onCourseOutcomesChange(courseOutcomes.filter((c) => c.id !== id));
  };

  const handleUpdateCO = (id: string, field: keyof CourseOutcome, val: string) => {
    onCourseOutcomesChange(
      courseOutcomes.map((c) => (c.id === id ? { ...c, [field]: val } : c))
    );
  };

  const handleAIMatrixAdvice = async () => {
    setAiLoading(true);
    setAiMatrixGuidance(null);
    try {
      const res = await requestAIAcademicAssistance(
        'Advise on NBA CO-PO articulation matrix mapping for CS-401 Distributed Systems, justifying correlation levels 1, 2, and 3.',
        {
          taskType: 'matrix_advisor',
          courseTitle: 'Distributed Systems and Cloud Infrastructure',
          courseCode: 'CS-401',
        }
      );
      setAiMatrixGuidance(res.text);
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
            <Grid className="w-4 h-4" />
            <span>Curriculum Specification Phase IV</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0F172A] tracking-tight">
            CO-PO-PSO Articulation Matrix Sheet
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Outcome-Based Education (OBE) correlation mapping across Washington Accord Graduate Attributes (PO 1–12) and PSOs.
          </p>
        </div>

        {/* AI Matrix Advisor Trigger */}
        <div className="flex items-center gap-2">
          {!isReadOnly && (
            <button
              type="button"
              onClick={handleAIMatrixAdvice}
              disabled={aiLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F2756] bg-[#EAEDFF] border border-[#CBD5E1] rounded hover:bg-[#D5E3FD] transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{aiLoading ? 'Auditing Matrix...' : 'AI Matrix Advisor'}</span>
            </button>
          )}
        </div>
      </div>

      {aiMatrixGuidance && (
        <div className="p-4 bg-white border border-[#CBD5E1] rounded shadow-xs space-y-2 text-xs">
          <div className="flex items-center justify-between font-serif font-bold text-[#0F2756]">
            <span>NBA Tier-I Correlation Matrix Justifications</span>
            <button
              type="button"
              onClick={() => setAiMatrixGuidance(null)}
              className="text-[11px] text-[#64748B]"
            >
              Dismiss
            </button>
          </div>
          <pre className="font-sans whitespace-pre-wrap text-[#334155] leading-relaxed">
            {aiMatrixGuidance}
          </pre>
        </div>
      )}

      {/* Matrix Sheet Container */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-serif text-base font-bold text-[#0F172A]">
              Articulation Correlation Grid
            </h2>
            <p className="text-xs text-[#64748B]">
              Correlation Levels: <strong className="text-[#0F172A]">3</strong> = Substantial (High),{' '}
              <strong className="text-[#0F172A]">2</strong> = Moderate (Medium),{' '}
              <strong className="text-[#0F172A]">1</strong> = Slight (Low),{' '}
              <strong className="text-[#0F172A]">-</strong> = No Correlation. Click cell to cycle or use keyboard.
            </p>
          </div>

          {/* Correlation Legend Chips */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[11px] text-[#64748B] font-semibold uppercase">Scale:</span>
            <span className="px-2 py-0.5 rounded bg-[#0F2756] text-white font-mono text-[11px] font-bold">
              3: High
            </span>
            <span className="px-2 py-0.5 rounded bg-[#515F74] text-white font-mono text-[11px] font-semibold">
              2: Medium
            </span>
            <span className="px-2 py-0.5 rounded bg-[#D5E3FD] text-[#0F2756] font-mono text-[11px] font-medium">
              1: Low
            </span>
            <span className="px-2 py-0.5 rounded bg-white border border-[#CBD5E1] text-[#94A3B8] font-mono text-[11px]">
              0: -
            </span>
          </div>
        </div>

        {/* Scrollable Matrix Table */}
        <div className="overflow-x-auto border border-[#CBD5E1] rounded">
          <table className="w-full border-collapse text-xs select-none">
            <thead>
              <tr className="bg-[#F8FAFC] border-b-2 border-[#CBD5E1] text-[#64748B]">
                <th className="py-2.5 px-3 text-left font-semibold uppercase text-[10px] w-20 sticky left-0 bg-[#F8FAFC] z-10 border-r border-[#CBD5E1]">
                  CO Code
                </th>
                <th className="py-2.5 px-3 text-left font-semibold uppercase text-[10px] min-w-[240px] border-r border-[#CBD5E1]">
                  Course Outcome Statement
                </th>
                <th className="py-2.5 px-2 text-center font-semibold uppercase text-[10px] w-24 border-r border-[#CBD5E1]">
                  Bloom Level
                </th>

                {/* Program Outcomes 1-12 */}
                {programOutcomes.map((po) => (
                  <th
                    key={po.id}
                    onClick={() => setSelectedOutcomeHelp(po.description)}
                    title={`${po.code}: ${po.shortName}\n${po.description}`}
                    className="py-2.5 px-1 text-center font-mono font-bold text-[11px] text-[#0F2756] w-10 border-r border-[#E2E8F0] hover:bg-[#EAEDFF] cursor-pointer"
                  >
                    {po.code}
                  </th>
                ))}

                {/* Program Specific Outcomes 1-3 */}
                {programSpecificOutcomes.map((pso) => (
                  <th
                    key={pso.id}
                    onClick={() => setSelectedOutcomeHelp(pso.description)}
                    title={`${pso.code}: ${pso.shortName}\n${pso.description}`}
                    className="py-2.5 px-1 text-center font-mono font-bold text-[11px] text-[#15803D] w-10 border-r border-[#E2E8F0] bg-[#F0FDF4] hover:bg-[#DCFCE7] cursor-pointer"
                  >
                    {pso.code}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#E2E8F0] font-sans">
              {courseOutcomes.length === 0 ? (
                <tr>
                  <td
                    colSpan={3 + allTargets.length}
                    className="py-10 text-center text-xs text-[#64748B] bg-[#F8FAFC]"
                  >
                    No Course Outcomes formulated yet. Click &ldquo;Add Course Outcome&rdquo; below or upload a course syllabus to populate outcomes.
                  </td>
                </tr>
              ) : (
                courseOutcomes.map((co) => (
                  <tr key={co.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-2 px-3 font-mono font-bold text-[#0F2756] sticky left-0 bg-white z-10 border-r border-[#CBD5E1]">
                      {co.id}
                    </td>
                    <td className="py-2 px-3 text-[#334155] border-r border-[#CBD5E1] text-[11px] leading-snug">
                      {co.description}
                    </td>
                    <td className="py-2 px-2 text-center border-r border-[#CBD5E1]">
                      <span className="text-[10px] font-mono font-semibold bg-[#F1F5F9] text-[#0F172A] px-1.5 py-0.5 rounded">
                        {co.bloomLevel}
                      </span>
                    </td>

                    {/* Matrix Cells */}
                    {allTargets.map((target) => {
                      const cellKey = `${co.id}_${target.id}`;
                      const val = (matrix[cellKey] ?? 0) as MatrixValue;
                      return (
                        <td
                          key={target.id}
                          className="p-1 text-center border-r border-[#E2E8F0] align-middle"
                        >
                          <button
                            type="button"
                            disabled={isReadOnly}
                            onClick={() => handleCellClick(co.id, target.id)}
                            title={`${co.id} -> ${target.code}: Level ${val}`}
                            className={`w-9 h-9 mx-auto rounded text-xs font-mono tabular-nums flex items-center justify-center transition-transform active:scale-95 border border-[#CBD5E1]/60 ${getCellColor(
                              val
                            )} ${isReadOnly ? 'cursor-default' : 'hover:ring-1 hover:ring-[#0F2756]'}`}
                          >
                            {val === 0 ? '-' : val}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>

            {/* Averages Row */}
            <tfoot>
              <tr className="bg-[#F8FAFC] border-t-2 border-[#CBD5E1] font-mono text-xs">
                <td
                  colSpan={3}
                  className="py-2.5 px-3 text-right font-serif font-bold uppercase text-[10px] text-[#0F172A] border-r border-[#CBD5E1] sticky left-0 bg-[#F8FAFC] z-10"
                >
                  Outcome Average Attainment Target
                </td>

                {allTargets.map((target) => {
                  const avg = calculateAverage(target.id);
                  return (
                    <td
                      key={target.id}
                      className="py-2.5 px-1 text-center font-bold text-[11px] tabular-nums border-r border-[#E2E8F0] text-[#0F2756]"
                    >
                      {avg}
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>

        {selectedOutcomeHelp && (
          <div className="p-3 bg-[#EAEDFF] border border-[#CBD5E1] rounded text-xs text-[#0F2756] flex items-start gap-2">
            <HelpCircle className="w-4 h-4 text-[#0F2756] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block">Graduate Attribute Definition:</span>
              <p className="mt-0.5">{selectedOutcomeHelp}</p>
            </div>
            <button
              onClick={() => setSelectedOutcomeHelp(null)}
              className="text-[11px] text-[#64748B] hover:text-[#0F172A]"
            >
              Close
            </button>
          </div>
        )}
      </div>

      {/* Course Outcomes Specification Panel */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-serif text-base font-bold text-[#0F172A]">
              Course Outcomes Formulation (CO-1 through CO-{courseOutcomes.length})
            </h2>
            <p className="text-xs text-[#64748B]">
              Measurable statements aligned with Bloom&apos;s Revised Cognitive Taxonomy (NBA Criterion 2.1).
            </p>
          </div>

          {!isReadOnly && (
            <button
              type="button"
              onClick={handleAddCO}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Course Outcome</span>
            </button>
          )}
        </div>

        <div className="space-y-3">
          {courseOutcomes.length === 0 ? (
            <div className="p-6 border border-dashed border-[#CBD5E1] rounded text-center text-xs text-[#64748B] space-y-2 bg-[#F8FAFC]">
              <p>No Course Outcomes defined yet.</p>
              {!isReadOnly && (
                <button
                  type="button"
                  onClick={handleAddCO}
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#0F2756] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] transition-colors"
                >
                  + Add First Course Outcome (CO-1)
                </button>
              )}
            </div>
          ) : (
            courseOutcomes.map((co) => (
              <div
                key={co.id}
                className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded flex items-start gap-3"
              >
                <span className="w-8 h-8 rounded bg-[#0F2756] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {co.id}
                </span>

                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      disabled={isReadOnly}
                      value={co.code}
                      onChange={(e) => handleUpdateCO(co.id, 'code', e.target.value)}
                      placeholder="e.g. CO.1"
                      className="w-24 px-2 py-1 text-xs font-mono font-bold bg-white border border-[#CBD5E1] rounded text-[#0F172A]"
                    />
                    <select
                      disabled={isReadOnly}
                      value={co.bloomLevel}
                      onChange={(e) => handleUpdateCO(co.id, 'bloomLevel', e.target.value)}
                      className="px-2 py-1 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A]"
                    >
                      <option value="K1 - Remember">K1 - Remember</option>
                      <option value="K2 - Understand">K2 - Understand</option>
                      <option value="K3 - Apply">K3 - Apply</option>
                      <option value="K4 - Analyze">K4 - Analyze</option>
                      <option value="K5 - Evaluate">K5 - Evaluate</option>
                      <option value="K6 - Create">K6 - Create</option>
                    </select>
                  </div>

                  <textarea
                    rows={2}
                    disabled={isReadOnly}
                    value={co.description}
                    onChange={(e) => handleUpdateCO(co.id, 'description', e.target.value)}
                    placeholder="Formulate measurable outcome using action verb (e.g., 'Implement distributed consensus algorithms...')"
                    className="w-full p-2 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] disabled:bg-[#F8FAFC]"
                  />
                </div>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveCO(co.id)}
                    className="p-1.5 text-[#64748B] hover:text-[#B91C1C] rounded mt-0.5"
                    title="Remove Course Outcome"
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
