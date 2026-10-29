import { useState, useEffect } from 'react';
import {
  FullCourseSpecification,
  UserRole,
  ReviewStatus,
  CourseMetadata,
  SyllabusUnit,
  Textbook,
  AssessmentComponent,
  BloomDistribution,
  CourseOutcome,
  MatrixValue,
} from './types';
import { getCourseSpecification, saveCourseSpecification } from './api';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import RightDrawer from './components/RightDrawer';
import Settings from './Settings';
import ExportGazetteModal from './components/ExportGazetteModal';
import BasicDetailsScreen from './components/screens/BasicDetailsScreen';
import SyllabusUnitsScreen from './components/screens/SyllabusUnitsScreen';
import AssessmentScreen from './components/screens/AssessmentScreen';
import OutcomeMatrixScreen from './components/screens/OutcomeMatrixScreen';
import ReviewApprovalsScreen from './components/screens/ReviewApprovalsScreen';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';

export default function App() {
  const [courseData, setCourseData] = useState<FullCourseSpecification>(() => getCourseSpecification());
  const [currentRole, setCurrentRole] = useState<UserRole>('Author');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1, 2, 3]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<boolean>(false);

  // Sync state changes with persistence
  const updateCourseData = (updated: FullCourseSpecification) => {
    setCourseData(updated);
    saveCourseSpecification(updated);
  };

  const handleManualSave = () => {
    saveCourseSpecification(courseData);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  // Step completions
  const markStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const handleNextStep = () => {
    markStepComplete(currentStep);
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Screen update handlers
  const handleMetadataChange = (metadata: CourseMetadata) => {
    updateCourseData({ ...courseData, metadata });
  };

  const handleUnitsChange = (units: SyllabusUnit[]) => {
    updateCourseData({ ...courseData, units });
  };

  const handleTextbooksChange = (textbooks: Textbook[]) => {
    updateCourseData({ ...courseData, textbooks });
  };

  const handleAssessmentsChange = (assessments: AssessmentComponent[]) => {
    updateCourseData({ ...courseData, assessments });
  };

  const handleBloomChange = (bloomDistribution: BloomDistribution) => {
    updateCourseData({ ...courseData, bloomDistribution });
  };

  const handleCourseOutcomesChange = (courseOutcomes: CourseOutcome[]) => {
    updateCourseData({ ...courseData, courseOutcomes });
  };

  const handleMatrixChange = (matrix: Record<string, MatrixValue>) => {
    updateCourseData({ ...courseData, matrix });
  };

  const handleStatusChange = (newStatus: ReviewStatus, stageNote: string, actionBy: string) => {
    const newHistory = [
      ...courseData.approvalHistory,
      {
        stage: `Status transition to ${newStatus}`,
        actionBy,
        role: currentRole,
        timestamp: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        notes: stageNote,
      },
    ];

    updateCourseData({
      ...courseData,
      status: newStatus,
      approvalHistory: newHistory,
    });
  };

  const handleAddComment = (commentText: string, section: string) => {
    const newComment = {
      id: `CMT-${Date.now().toString().slice(-4)}`,
      author:
        currentRole === 'Author'
          ? 'Dr. Arvind Ramanathan (Author)'
          : currentRole === 'Reviewer'
          ? 'Prof. K. Venkatesh (Review Committee)'
          : 'Dr. Meenakshi Sundaram (HOD)',
      role: currentRole,
      timestamp: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      section,
      comment: commentText,
      resolved: false,
    };

    updateCourseData({
      ...courseData,
      comments: [newComment, ...courseData.comments],
    });
  };

  const handleResolveComment = (commentId: string) => {
    updateCourseData({
      ...courseData,
      comments: courseData.comments.map((c) =>
        c.id === commentId ? { ...c, resolved: true } : c
      ),
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] font-sans flex flex-col">
      {/* Top Bar Header */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        status={courseData.status}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        courseCode={courseData.metadata.courseCode}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-[1520px] w-full mx-auto">
        {/* Persistent 240px Utility Stepper Sidebar */}
        <Sidebar
          currentStep={currentStep}
          onSelectStep={(s) => {
            markStepComplete(currentStep);
            setCurrentStep(s);
          }}
          metadata={courseData.metadata}
          completedSteps={completedSteps}
        />

        {/* Central Flexible Canvas (pinned 960px to 1200px) */}
        <main className="flex-1 min-w-0 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Render Screen Based on Stepper */}
            {currentStep === 1 && (
              <BasicDetailsScreen
                metadata={courseData.metadata}
                onChange={handleMetadataChange}
                currentRole={currentRole}
                status={courseData.status}
              />
            )}

            {currentStep === 2 && (
              <SyllabusUnitsScreen
                units={courseData.units}
                textbooks={courseData.textbooks}
                onUnitsChange={handleUnitsChange}
                onTextbooksChange={handleTextbooksChange}
                currentRole={currentRole}
                status={courseData.status}
              />
            )}

            {currentStep === 3 && (
              <AssessmentScreen
                assessments={courseData.assessments}
                bloomDistribution={courseData.bloomDistribution}
                onAssessmentsChange={handleAssessmentsChange}
                onBloomChange={handleBloomChange}
                currentRole={currentRole}
                status={courseData.status}
              />
            )}

            {currentStep === 4 && (
              <OutcomeMatrixScreen
                courseOutcomes={courseData.courseOutcomes}
                programOutcomes={courseData.programOutcomes}
                programSpecificOutcomes={courseData.programSpecificOutcomes}
                matrix={courseData.matrix}
                onMatrixChange={handleMatrixChange}
                onCourseOutcomesChange={handleCourseOutcomesChange}
                currentRole={currentRole}
                status={courseData.status}
              />
            )}

            {currentStep === 5 && (
              <ReviewApprovalsScreen
                courseData={courseData}
                onStatusChange={handleStatusChange}
                currentRole={currentRole}
                onOpenExport={() => setIsExportOpen(true)}
              />
            )}

            {/* Stepper Navigation Footer Buttons */}
            <div className="pt-6 border-t border-[#CBD5E1] flex items-center justify-between">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={handlePrevStep}
                className="px-4 py-2 text-xs font-semibold text-[#0F172A] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] disabled:opacity-40 disabled:pointer-events-none rounded transition-colors flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous Stage</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleManualSave}
                  className="px-3 py-2 text-xs font-medium text-[#334155] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] rounded transition-colors flex items-center gap-1.5"
                >
                  {saveToast ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[#15803D]" />
                      <span className="text-[#15803D] font-semibold">Changes Saved</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-[#64748B]" />
                      <span>Save Draft</span>
                    </>
                  )}
                </button>

                {currentStep < 5 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5"
                  >
                    <span>Proceed to Next Stage</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsExportOpen(true)}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2756] hover:bg-[#1E3A8A] rounded transition-colors flex items-center gap-1.5"
                  >
                    <span>Export Official Gazette</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Persistent 320px Compliance & Review Drawer */}
        <RightDrawer
          isOpen={isDrawerOpen}
          onToggle={() => setIsDrawerOpen(!isDrawerOpen)}
          complianceChecks={courseData.complianceChecks}
          comments={courseData.comments}
          currentRole={currentRole}
          onAddComment={handleAddComment}
          onResolveComment={handleResolveComment}
        />
      </div>

      {/* AI Settings Modal */}
      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Official Gazette Export Modal */}
      <ExportGazetteModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        courseData={courseData}
      />
    </div>
  );
}
