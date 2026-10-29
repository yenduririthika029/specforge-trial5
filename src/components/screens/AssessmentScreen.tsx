import { AssessmentComponent, BloomDistribution, ReviewStatus, UserRole } from '../../types';
import { BarChart3, CheckCircle2, AlertTriangle, Scale, Award } from 'lucide-react';

interface AssessmentScreenProps {
  assessments: AssessmentComponent[];
  bloomDistribution: BloomDistribution;
  onAssessmentsChange: (updated: AssessmentComponent[]) => void;
  onBloomChange: (updated: BloomDistribution) => void;
  currentRole: UserRole;
  status: ReviewStatus;
}

export default function AssessmentScreen({
  assessments,
  bloomDistribution,
  onAssessmentsChange,
  onBloomChange,
  currentRole,
  status,
}: AssessmentScreenProps) {
  const isReadOnly = currentRole === 'Reviewer' || status === 'BOS_LOCKED';

  // Calculate CIE and SEE totals
  const cieTotal = assessments
    .filter((a) => a.type === 'CIE')
    .reduce((acc, a) => acc + (a.weightage || 0), 0);

  const seeTotal = assessments
    .filter((a) => a.type === 'SEE')
    .reduce((acc, a) => acc + (a.weightage || 0), 0);

  const totalWeightage = cieTotal + seeTotal;

  // Calculate Bloom's total and HOTS
  const bloomTotal =
    bloomDistribution.remember +
    bloomDistribution.understand +
    bloomDistribution.apply +
    bloomDistribution.analyze +
    bloomDistribution.evaluate +
    bloomDistribution.create;

  const hotsTotal =
    bloomDistribution.apply +
    bloomDistribution.analyze +
    bloomDistribution.evaluate +
    bloomDistribution.create;

  const handleUpdateWeightage = (id: string, weight: number) => {
    onAssessmentsChange(
      assessments.map((a) => (a.id === id ? { ...a, weightage: Math.max(0, weight) } : a))
    );
  };

  const handleUpdateBloom = (level: keyof BloomDistribution, val: number) => {
    onBloomChange({
      ...bloomDistribution,
      [level]: Math.max(0, Math.min(100, val)),
    });
  };

  return (
    <div className="space-y-6">
      {/* Screen Title & Editorial Banner */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#CBD5E1]">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#0F2756] uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Curriculum Specification Phase III</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0F172A] tracking-tight">
            Assessment Scheme & Cognitive Depth Distribution
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Evaluation metrics establishing CIE:SEE ratio (40:60) and Bloom&apos;s Revised Cognitive Taxonomy distribution.
          </p>
        </div>

        {/* Parity Status Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs">
          <Scale className="w-3.5 h-3.5 text-[#0F2756]" />
          <span className="text-[#64748B]">CIE:SEE Ratio:</span>
          <span className="font-mono font-bold text-[#0F172A] tabular-nums">
            {cieTotal}% : {seeTotal}%
          </span>
          {totalWeightage === 100 && cieTotal === 40 && seeTotal === 60 ? (
            <span className="text-[10px] font-semibold text-[#15803D] uppercase ml-1">
              ✓ Parity 40:60
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-[#B45309] uppercase ml-1">
              ! Check Ratio
            </span>
          )}
        </div>
      </div>

      {/* CIE vs SEE Evaluation Breakdown */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-serif text-base font-bold text-[#0F172A]">
              Continuous & Semester End Assessment Matrix
            </h2>
            <p className="text-xs text-[#64748B]">
              Standard statutory split: 40% Continuous Internal Evaluation (CIE) + 60% Semester End Examination (SEE).
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-[10px] uppercase text-[#64748B] block">CIE Component</span>
              <span
                className={`font-bold tabular-nums ${
                  cieTotal === 40 ? 'text-[#15803D]' : 'text-[#B45309]'
                }`}
              >
                {cieTotal}% / 40%
              </span>
            </div>
            <div className="text-right pl-4 border-l border-[#CBD5E1]">
              <span className="text-[10px] uppercase text-[#64748B] block">SEE Component</span>
              <span
                className={`font-bold tabular-nums ${
                  seeTotal === 60 ? 'text-[#15803D]' : 'text-[#B45309]'
                }`}
              >
                {seeTotal}% / 60%
              </span>
            </div>
          </div>
        </div>

        {/* Assessment Items Table */}
        <div className="overflow-x-auto border border-[#CBD5E1] rounded">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#64748B] uppercase font-semibold text-[11px]">
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Evaluation Component</th>
                <th className="py-2.5 px-3">Conducting Authority</th>
                <th className="py-2.5 px-3 text-center">Max Marks</th>
                <th className="py-2.5 px-3 text-right">Weightage (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] font-sans">
              {assessments.map((item) => (
                <tr key={item.id} className="hover:bg-[#F8FAFC]/70 transition-colors">
                  <td className="py-2.5 px-3">
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                        item.type === 'CIE'
                          ? 'bg-[#EAEDFF] text-[#0F2756]'
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-[#0F172A]">{item.name}</td>
                  <td className="py-2.5 px-3 text-[#515F74]">{item.conductedBy}</td>
                  <td className="py-2.5 px-3 font-mono font-medium text-center tabular-nums text-[#0F172A]">
                    {item.maxMarks}
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                    {isReadOnly ? (
                      <span className="text-[#0F172A]">{item.weightage}%</span>
                    ) : (
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={item.weightage}
                          onChange={(e) => handleUpdateWeightage(item.id, Number(e.target.value))}
                          className="w-16 px-2 py-1 text-xs font-mono font-bold text-right bg-white border border-[#CBD5E1] rounded text-[#0F172A]"
                        />
                        <span className="text-[#64748B]">%</span>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#F8FAFC] border-t-2 border-[#CBD5E1] font-bold text-[#0F172A]">
                <td colSpan={4} className="py-2.5 px-3 uppercase text-[11px]">
                  Aggregate Course Weightage
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-sm tabular-nums text-[#0F2756]">
                  {totalWeightage}%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Bloom's Taxonomy Cognitive Depth Distribution */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-serif text-base font-bold text-[#0F172A]">
              Cognitive Domain Depth (Bloom&apos;s Revised Taxonomy)
            </h2>
            <p className="text-xs text-[#64748B]">
              Autonomous assessment alignment requiring Higher-Order Thinking Skills (Apply, Analyze, Evaluate, Create) &ge; 60%.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F8FAFC] border border-[#CBD5E1] text-xs">
              <Award className="w-3.5 h-3.5 text-[#15803D]" />
              <span className="text-[#64748B]">HOTS Ratio:</span>
              <span
                className={`font-mono font-bold tabular-nums ${
                  hotsTotal >= 60 ? 'text-[#15803D]' : 'text-[#B45309]'
                }`}
              >
                {hotsTotal}%
              </span>
              <span className="text-[10px] text-[#64748B]">(Min 60%)</span>
            </div>

            <div
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border ${
                bloomTotal === 100
                  ? 'bg-[#DCFCE7] text-[#15803D] border-[#BBF7D0]'
                  : 'bg-[#FEF3C7] text-[#B45309] border-[#FDE68A]'
              }`}
            >
              {bloomTotal === 100 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Sum: 100% Valid</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Sum: {bloomTotal}% (Must equal 100%)</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stacked Visual Bar */}
        <div className="space-y-1.5">
          <div className="h-5 w-full bg-[#F1F5F9] rounded overflow-hidden flex border border-[#CBD5E1]">
            <div
              style={{ width: `${bloomDistribution.remember}%` }}
              className="bg-[#94A3B8] h-full transition-all"
              title={`Remember (K1): ${bloomDistribution.remember}%`}
            />
            <div
              style={{ width: `${bloomDistribution.understand}%` }}
              className="bg-[#7B8FC5] h-full transition-all"
              title={`Understand (K2): ${bloomDistribution.understand}%`}
            />
            <div
              style={{ width: `${bloomDistribution.apply}%` }}
              className="bg-[#1D4ED8] h-full transition-all"
              title={`Apply (K3): ${bloomDistribution.apply}%`}
            />
            <div
              style={{ width: `${bloomDistribution.analyze}%` }}
              className="bg-[#0F2756] h-full transition-all"
              title={`Analyze (K4): ${bloomDistribution.analyze}%`}
            />
            <div
              style={{ width: `${bloomDistribution.evaluate}%` }}
              className="bg-[#002071] h-full transition-all"
              title={`Evaluate (K5): ${bloomDistribution.evaluate}%`}
            />
            <div
              style={{ width: `${bloomDistribution.create}%` }}
              className="bg-[#15803D] h-full transition-all"
              title={`Create (K6): ${bloomDistribution.create}%`}
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#64748B]">
            <span>Lower Order Thinking Skills (LOTS: {bloomDistribution.remember + bloomDistribution.understand}%)</span>
            <span className="font-semibold text-[#0F2756]">
              Higher Order Thinking Skills (HOTS: {hotsTotal}%)
            </span>
          </div>
        </div>

        {/* Granular Cognitive Level Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
          {[
            { key: 'remember', label: 'K1: Remember', desc: 'Recall & definitions', color: 'text-[#64748B]' },
            { key: 'understand', label: 'K2: Understand', desc: 'Comprehend & explain', color: 'text-[#7B8FC5]' },
            { key: 'apply', label: 'K3: Apply', desc: 'Execute & implement', color: 'text-[#1D4ED8]' },
            { key: 'analyze', label: 'K4: Analyze', desc: 'Deconstruct & compare', color: 'text-[#0F2756]' },
            { key: 'evaluate', label: 'K5: Evaluate', desc: 'Judge & verify', color: 'text-[#002071]' },
            { key: 'create', label: 'K6: Create', desc: 'Synthesize & construct', color: 'text-[#15803D]' },
          ].map((level) => (
            <div
              key={level.key}
              className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded space-y-1.5"
            >
              <div className="text-xs font-serif font-bold text-[#0F172A] leading-tight">
                {level.label}
              </div>
              <p className="text-[10px] text-[#64748B]">{level.desc}</p>
              <div className="pt-1 flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  max={100}
                  disabled={isReadOnly}
                  value={bloomDistribution[level.key as keyof BloomDistribution]}
                  onChange={(e) =>
                    handleUpdateBloom(
                      level.key as keyof BloomDistribution,
                      Number(e.target.value)
                    )
                  }
                  className="w-full px-2 py-1 text-xs font-mono font-bold text-center bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
                />
                <span className="text-xs text-[#64748B]">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
