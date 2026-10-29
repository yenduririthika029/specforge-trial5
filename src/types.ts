export type UserRole = 'Author' | 'Reviewer' | 'HOD';

export type ReviewStatus = 'DRAFT' | 'IN_REVIEW' | 'HOD_APPROVED' | 'BOS_LOCKED';

export interface CourseMetadata {
  courseCode: string;
  courseTitle: string;
  department: string;
  academicRegulation: string;
  academicYear: string;
  semester: number;
  courseCategory: 'Professional Core' | 'Professional Elective' | 'Open Elective' | 'Basic Science' | 'Engineering Science';
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  totalCredits: number;
  totalContactHours: number;
  prerequisites: string;
  courseType: 'Integrated (Theory + Lab)' | 'Theory Only' | 'Laboratory Only';
  leadFaculty: string;
  courseDescription: string;
  courseObjectives: string[];
}

export interface SyllabusUnit {
  unitNumber: number;
  unitRoman: string;
  title: string;
  contactHours: number;
  description: string;
  topics: string[];
  pedagogy: string;
  labExperiments?: string[];
  bloomLevels: string[];
}

export interface Textbook {
  id: string;
  type: 'Textbook' | 'Reference Book';
  title: string;
  authors: string;
  publisher: string;
  year: number;
  edition: string;
  isbn?: string;
}

export interface AssessmentComponent {
  id: string;
  name: string;
  weightage: number;
  type: 'CIE' | 'SEE';
  maxMarks: number;
  conductedBy: string;
}

export interface BloomDistribution {
  remember: number;
  understand: number;
  apply: number;
  analyze: number;
  evaluate: number;
  create: number;
}

export interface CourseOutcome {
  id: string;
  code: string;
  description: string;
  bloomLevel: string;
}

export interface ProgramOutcome {
  id: string;
  code: string;
  shortName: string;
  description: string;
}

export interface ProgramSpecificOutcome {
  id: string;
  code: string;
  shortName: string;
  description: string;
}

export type MatrixValue = 0 | 1 | 2 | 3;

export interface MatrixCell {
  coId: string;
  outcomeId: string;
  level: MatrixValue;
}

export interface ComplianceCheck {
  id: string;
  criterion: string;
  requirement: string;
  status: 'VALID' | 'PENDING' | 'VIOLATION' | 'INFO';
  description: string;
  standardRef: string;
}

export interface ReviewComment {
  id: string;
  author: string;
  role: UserRole;
  timestamp: string;
  section: string;
  comment: string;
  resolved: boolean;
}

export interface AISettings {
  provider: 'gemini' | 'openai' | 'anthropic' | 'custom';
  apiKey: string;
  model: string;
  temperature: number;
  systemPromptPreset: string;
}

export interface FullCourseSpecification {
  id: string;
  status: ReviewStatus;
  lastUpdated: string;
  metadata: CourseMetadata;
  units: SyllabusUnit[];
  textbooks: Textbook[];
  assessments: AssessmentComponent[];
  bloomDistribution: BloomDistribution;
  courseOutcomes: CourseOutcome[];
  programOutcomes: ProgramOutcome[];
  programSpecificOutcomes: ProgramSpecificOutcome[];
  matrix: Record<string, MatrixValue>; // key: `${coId}_${outcomeId}`
  complianceChecks: ComplianceCheck[];
  comments: ReviewComment[];
  approvalHistory: {
    stage: string;
    actionBy: string;
    role: UserRole;
    timestamp: string;
    notes: string;
  }[];
}
