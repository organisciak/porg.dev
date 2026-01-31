interface CSLDate {
  "date-parts": number[][];
}

interface CSLName {
  family: string;
  given: string;
}

export type Award = {
  title: string;
  amount: string;
  funder: string;
  grantNumber?: string;
  grantUrl?: string;
  investigators: string[];
  timeframe: string;
  subgrant?: string;
};

export type Product = {
  category: string;
  items: {
    name: string;
    url?: string;
    description?: string;
  }[];
};

export type Course = {
  code: string;
  title: string;
  credits: string;
  format?: string;
  materials?: string;
};

export type Position = {
  position: string;
  organization: string;
  timeframe: string;
};

export type Education = {
  degree: string;
  university: string;
  year: string;
  additionalDetails: {
    major?: string;
    dissertationTitle?: string;
    thesisTitle?: string;
    committee?: string[];
  };
};

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
  "event-place"?: string;
  custom?: CSLCustomField[];
}

export type DirectedStudentLearning = {
  category: "Dissertation" | "Capstone" | "Thesis";
  role: "Committee Member" | "Committee Chair";
  student: string;
  title: string;
  institution?: string; // Optional
  year: string;
}[];
