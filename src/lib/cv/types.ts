interface CSLDate {
  "date-parts": number[][];
}

interface CSLName {
  family: string;
  given: string;
}

interface CSLEditor extends CSLName {}

interface CSLCustomField {
  key: string;
  value: string;
}

export interface CSLPublication {
  id: string;
  type: string;
  title: string;
  "container-title"?: string;
  page?: string;
  volume?: string;
  issue?: string;
  event?: string;
  "publisher-place"?: string;
  references?: string;
  edition?: string;
  publisher?: string;
  URL?: string;
  DOI?: string;
  abstract?: string;
  author: CSLName[];
  editor?: CSLEditor[];
  issued: CSLDate;
  status?: string;
  genre?: string; //"Long Paper Talk" | "Poster" | "Proceedings Short Article" | "Proceedings Long Article" | "Panel";
  extra?: string;
  custom?: CSLCustomField[];
}

export type DirectedStudentLearning = {
  category: 'Dissertation' | 'Capstone' | 'Thesis';
  role: 'Committee Member' | 'Committee Chair';
  student: string;
  title: string;
  institution?: string; // Optional
  year: string;
}[];