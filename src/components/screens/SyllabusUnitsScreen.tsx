import { useState } from 'react';
import { SyllabusUnit, Textbook, ReviewStatus, UserRole } from '../../types';
import { requestAIAcademicAssistance } from '../../api';
import { Layers, Plus, Trash2, Sparkles, BookCheck, Clock } from 'lucide-react';

interface SyllabusUnitsScreenProps {
  units: SyllabusUnit[];
  textbooks: Textbook[];
  onUnitsChange: (updated: SyllabusUnit[]) => void;
  onTextbooksChange: (updated: Textbook[]) => void;
  currentRole: UserRole;
  status: ReviewStatus;
}

export default function SyllabusUnitsScreen({
  units,
  textbooks,
  onUnitsChange,
  onTextbooksChange,
  currentRole,
  status,
}: SyllabusUnitsScreenProps) {
  const isReadOnly = currentRole === 'Reviewer' || status === 'BOS_LOCKED';
  const [selectedUnitIdx, setSelectedUnitIdx] = useState(0);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string | null>(null);

  const activeUnit = units[selectedUnitIdx] || units[0];

  const totalContactHours = units.reduce((acc, u) => acc + (u.contactHours || 0), 0);
  const targetContactHours = 60; // 4 Credits (3-0-2) standard

  const handleUpdateActiveUnit = (field: keyof SyllabusUnit, val: any) => {
    const list = [...units];
    list[selectedUnitIdx] = { ...list[selectedUnitIdx], [field]: val };
    onUnitsChange(list);
  };

  const handleAddTopic = () => {
    const list = [...units];
    list[selectedUnitIdx].topics = [
      ...list[selectedUnitIdx].topics,
      'New Advanced Module Topic (e.g., protocol verification, benchmark telemetry)',
    ];
    onUnitsChange(list);
  };

  const handleUpdateTopic = (tIdx: number, text: string) => {
    const list = [...units];
    const topics = [...list[selectedUnitIdx].topics];
    topics[tIdx] = text;
    list[selectedUnitIdx].topics = topics;
    onUnitsChange(list);
  };

  const handleRemoveTopic = (tIdx: number) => {
    const list = [...units];
    const topics = [...list[selectedUnitIdx].topics];
    topics.splice(tIdx, 1);
    list[selectedUnitIdx].topics = topics;
    onUnitsChange(list);
  };

  const handleAddTextbook = (type: 'Textbook' | 'Reference Book') => {
    const newBook: Textbook = {
      id: `BK-${Date.now().toString().slice(-4)}`,
      type,
      title: 'New Prescribed Academic Reference',
      authors: 'Author Names',
      publisher: 'Academic Press / University Publishing',
      year: 2024,
      edition: '1st Edition',
      isbn: '978-0000000000',
    };
    onTextbooksChange([...textbooks, newBook]);
  };

  const handleRemoveTextbook = (id: string) => {
    onTextbooksChange(textbooks.filter((b) => b.id !== id));
  };

  const handleUpdateTextbook = (id: string, field: keyof Textbook, val: any) => {
    onTextbooksChange(
      textbooks.map((b) => (b.id === id ? { ...b, [field]: val } : b))
    );
  };

  const handleAITopicAssist = async () => {
    setAiLoading(true);
    setAiSuggestions(null);
    try {
      const res = await requestAIAcademicAssistance(
        `Suggest curriculum expansion topics for ${activeUnit.unitRoman}: ${activeUnit.title} incorporating modern distributed cloud engineering standards.`,
        {
          taskType: 'suggest_topics',
          courseTitle: 'Distributed Systems and Cloud Infrastructure',
          courseCode: 'CS-401',
          currentContent: activeUnit.topics.join('; '),
        }
      );
      setAiSuggestions(res.text);
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
            <Layers className="w-4 h-4" />
            <span>Curriculum Specification Phase II</span>
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0F172A] tracking-tight">
            5-Unit Syllabus Blueprint & Prescribed Literature
          </h1>
          <p className="text-xs text-[#64748B] mt-1">
            Modular instructional syllabus breakdown with contact hour distribution, laboratory experiments, and citations.
          </p>
        </div>

        {/* Contact Hours Audit Pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#CBD5E1] rounded text-xs">
          <Clock className="w-3.5 h-3.5 text-[#0F2756]" />
          <span className="text-[#64748B]">Total Hours:</span>
          <span className="font-mono font-bold text-[#0F172A] tabular-nums">
            {totalContactHours} / {targetContactHours} hrs
          </span>
          {totalContactHours === targetContactHours ? (
            <span className="text-[10px] font-semibold text-[#15803D] uppercase ml-1">
              ✓ Parity Verified
            </span>
          ) : (
            <span className="text-[10px] font-semibold text-[#B45309] uppercase ml-1">
              ! Check Parity
            </span>
          )}
        </div>
      </div>

      {/* Unit Selector Tabs */}
      <div className="grid grid-cols-5 gap-2">
        {units.map((unit, idx) => {
          const isSelected = selectedUnitIdx === idx;
          return (
            <button
              key={unit.unitNumber}
              type="button"
              onClick={() => setSelectedUnitIdx(idx)}
              className={`p-3 text-left border rounded transition-all ${
                isSelected
                  ? 'bg-[#0F2756] text-white border-[#0F2756] shadow-xs'
                  : 'bg-white text-[#334155] border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                <span className={isSelected ? 'text-[#B1C6FE] font-bold' : 'text-[#64748B]'}>
                  {unit.unitRoman}
                </span>
                <span className={`tabular-nums ${isSelected ? 'text-white' : 'text-[#64748B]'}`}>
                  {unit.contactHours}h
                </span>
              </div>
              <div className="font-serif text-xs font-semibold truncate leading-tight">
                {unit.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Unit Detailed Panel */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-[#E2E8F0] gap-4">
          <div className="flex-1">
            <span className="text-[11px] font-mono font-bold text-[#0F2756] bg-[#EAEDFF] px-2 py-0.5 rounded">
              {activeUnit.unitRoman} MODULE SPECIFICATION
            </span>
            <div className="mt-2">
              <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
                Module Title
              </label>
              <input
                type="text"
                disabled={isReadOnly}
                value={activeUnit.title}
                onChange={(e) => handleUpdateActiveUnit('title', e.target.value)}
                placeholder={`Enter ${activeUnit.unitRoman} Title (e.g. Foundations & System Models)`}
                className="w-full px-3 py-1.5 font-serif text-base font-bold bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] disabled:bg-[#F8FAFC]"
              />
            </div>
          </div>

          <div className="w-36 shrink-0">
            <label className="block text-[11px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">
              Contact Hours
            </label>
            <input
              type="number"
              min={0}
              max={60}
              disabled={isReadOnly}
              value={activeUnit.contactHours || 0}
              onChange={(e) => handleUpdateActiveUnit('contactHours', Number(e.target.value))}
              className="w-full px-3 py-1.5 font-mono text-base font-bold text-center bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
            />
          </div>
        </div>

        {/* Module Scope & Pedagogical Strategy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Scope & Conceptual Coverage
            </label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={activeUnit.description}
              onChange={(e) => handleUpdateActiveUnit('description', e.target.value)}
              placeholder="Provide conceptual overview and scope of this module..."
              className="w-full p-2.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0F172A] uppercase tracking-wider mb-1">
              Instructional & Pedagogical Methodology
            </label>
            <textarea
              rows={2}
              disabled={isReadOnly}
              value={activeUnit.pedagogy}
              onChange={(e) => handleUpdateActiveUnit('pedagogy', e.target.value)}
              placeholder="e.g. Lectures with trace simulations, case studies, and lab sessions..."
              className="w-full p-2.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] disabled:bg-[#F8FAFC]"
            />
          </div>
        </div>

        {/* Detailed Topics List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-serif text-sm font-bold text-[#0F172A]">
                Detailed Curricular Topics ({activeUnit.topics.length} items)
              </h3>
              <p className="text-[11px] text-[#64748B]">
                Granular syllabus items tested in internal Continuous Assessment and Semester End Exams.
              </p>
            </div>

            {!isReadOnly && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleAITopicAssist}
                  disabled={aiLoading}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-[#0F2756] bg-[#EAEDFF] border border-[#CBD5E1] rounded hover:bg-[#D5E3FD]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiLoading ? 'Synthesizing...' : 'AI Topic Suggestions'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddTopic}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Topic</span>
                </button>
              </div>
            )}
          </div>

          {aiSuggestions && (
            <div className="p-3 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-[#0F2756]">
                <span>Accreditation Assistant: Recommended Expansion</span>
                <button
                  type="button"
                  onClick={() => setAiSuggestions(null)}
                  className="text-[11px] text-[#64748B]"
                >
                  Dismiss
                </button>
              </div>
              <pre className="font-sans whitespace-pre-wrap text-[#334155] text-xs">
                {aiSuggestions}
              </pre>
            </div>
          )}

          <div className="space-y-2">
            {activeUnit.topics.length === 0 ? (
              <div className="p-4 border border-dashed border-[#CBD5E1] rounded text-center text-xs text-[#64748B] space-y-2 bg-[#F8FAFC]">
                <p>No syllabus topics added for {activeUnit.unitRoman} yet.</p>
                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0F2756] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9] transition-colors"
                  >
                    + Add First Topic
                  </button>
                )}
              </div>
            ) : (
              activeUnit.topics.map((topic, tIdx) => (
                <div key={tIdx} className="flex items-start gap-2">
                  <span className="w-6 h-6 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F2756] font-mono font-semibold text-xs flex items-center justify-center shrink-0 mt-1">
                    {tIdx + 1}
                  </span>
                  <input
                    type="text"
                    disabled={isReadOnly}
                    value={topic}
                    onChange={(e) => handleUpdateTopic(tIdx, e.target.value)}
                    placeholder="Enter granular syllabus topic..."
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A] focus:outline-none focus:ring-1 focus:ring-[#0F2756] disabled:bg-[#F8FAFC]"
                  />
                  {!isReadOnly && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(tIdx)}
                      className="p-1.5 text-[#64748B] hover:text-[#B91C1C] rounded mt-0.5"
                      title="Remove topic"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Laboratory Experiments Linkage */}
        {activeUnit.labExperiments && activeUnit.labExperiments.length > 0 && (
          <div className="p-4 bg-[#F8FAFC] border border-[#CBD5E1] rounded space-y-2.5">
            <div className="font-serif text-xs font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2">
              <BookCheck className="w-4 h-4 text-[#0F2756]" />
              Integrated Laboratory Experiments (Mapped to {activeUnit.unitRoman})
            </div>
            <ul className="space-y-1.5 text-xs text-[#334155]">
              {activeUnit.labExperiments.map((exp, expIdx) => (
                <li key={expIdx} className="flex items-start gap-2">
                  <span className="font-mono text-[#0F2756] font-bold">Exp {expIdx + 1}:</span>
                  <span>{exp}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Prescribed Textbooks & Reference Literature Panel */}
      <div className="bg-white border border-[#CBD5E1] rounded shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div>
            <h2 className="font-serif text-base font-bold text-[#0F172A]">
              Prescribed Textbooks & Reference Literature
            </h2>
            <p className="text-xs text-[#64748B]">
              Standard academic citations in accordance with Academic Council guidelines (min 50% recency &lt; 5 years).
            </p>
          </div>

          {!isReadOnly && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleAddTextbook('Textbook')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#0F2756] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Textbook</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddTextbook('Reference Book')}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-[#0F2756] bg-[#EAEDFF] border border-[#CBD5E1] rounded hover:bg-[#D5E3FD]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Reference</span>
              </button>
            </div>
          )}
        </div>

        <div className="divide-y divide-[#E2E8F0]">
          {textbooks.length === 0 ? (
            <div className="p-6 border border-dashed border-[#CBD5E1] rounded text-center text-xs text-[#64748B] space-y-2 bg-[#F8FAFC]">
              <p>No prescribed textbooks or reference literature entered yet.</p>
              {!isReadOnly && (
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleAddTextbook('Textbook')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0F2756] bg-white border border-[#CBD5E1] rounded hover:bg-[#F1F5F9]"
                  >
                    + Add Textbook
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAddTextbook('Reference Book')}
                    className="px-3 py-1.5 text-xs font-semibold text-[#0F2756] bg-[#EAEDFF] border border-[#CBD5E1] rounded hover:bg-[#D5E3FD]"
                  >
                    + Add Reference
                  </button>
                </div>
              )}
            </div>
          ) : (
            textbooks.map((book, idx) => (
              <div key={book.id} className="py-3 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-7 h-7 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#0F2756] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                    {idx + 1}
                  </span>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded ${
                          book.type === 'Textbook'
                            ? 'bg-[#EAEDFF] text-[#0F2756]'
                            : 'bg-[#F1F5F9] text-[#515F74]'
                        }`}
                      >
                        {book.type}
                      </span>
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={book.title}
                        onChange={(e) => handleUpdateTextbook(book.id, 'title', e.target.value)}
                        placeholder="Book Title"
                        className="font-serif font-bold text-xs text-[#0F172A] bg-transparent border-b border-transparent hover:border-[#CBD5E1] focus:border-[#0F2756] focus:outline-none flex-1 px-1 py-0.5"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                      <div className="md:col-span-2">
                        <span className="text-[10px] text-[#64748B] block uppercase">Authors</span>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={book.authors}
                          onChange={(e) => handleUpdateTextbook(book.id, 'authors', e.target.value)}
                          placeholder="e.g. Author Names"
                          className="w-full px-2 py-1 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748B] block uppercase">Publisher</span>
                        <input
                          type="text"
                          disabled={isReadOnly}
                          value={book.publisher}
                          onChange={(e) => handleUpdateTextbook(book.id, 'publisher', e.target.value)}
                          placeholder="Publisher"
                          className="w-full px-2 py-1 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A]"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-[#64748B] block uppercase">Year / Edition</span>
                        <div className="flex gap-1">
                          <input
                            type="number"
                            disabled={isReadOnly}
                            value={book.year}
                            onChange={(e) => handleUpdateTextbook(book.id, 'year', Number(e.target.value))}
                            className="w-20 px-2 py-1 text-xs font-mono bg-white border border-[#CBD5E1] rounded text-[#0F172A]"
                          />
                          <input
                            type="text"
                            disabled={isReadOnly}
                            value={book.edition}
                            onChange={(e) => handleUpdateTextbook(book.id, 'edition', e.target.value)}
                            placeholder="Edition"
                            className="flex-1 px-2 py-1 text-xs bg-white border border-[#CBD5E1] rounded text-[#0F172A]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {!isReadOnly && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTextbook(book.id)}
                    className="p-1.5 text-[#64748B] hover:text-[#B91C1C] rounded mt-1"
                    title="Remove book"
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
