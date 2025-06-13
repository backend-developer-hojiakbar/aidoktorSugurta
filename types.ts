export const AppMode = {
  None: 0,
  QuickDiagnosis: 1,
  ComprehensiveAnalysis: 2,
  HealthLibrary: 3,
  Physiotherapy: 4,
  CallCenter: 5,
  OnLab: 6,
  DrugIdentifier: 7,
  Login: 8,
  Register: 9,
  UserCabinet: 10,
  FirstAid: 11,
  OnlineHamshira: 12,
  MobileLaboratory: 13,
  GetInsurance: 14, // Yangi rejim: Sug'urta olish
  HealthTracker: 15, // Yangi rejim: Salomatlik Kundaligi
};
Object.freeze(AppMode);

export interface User {
  username: string;
  email?: string;
  fullName?: string;
  dob?: string;
  gender?: string;
  phone?: string;
  allergies?: string;
  chronicDiseases?: string;
  hasInsurance: boolean;
  insuranceNumber?: string | null;
}

/*
export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
  userImagePreviewUrl?: string;
}

export interface LabResultData {
  name: string;
  yourValue: number | string;
  normDisplayValue: string;
  normComparableValue: number | null;
  unit: string;
}

export interface AnalysisReport {
  summary: string;
  keyFindings: string[];
  riskFactors: string[];
  recommendations: string[];
  labResults: LabResultData[];
  disclaimer: string;
}
*/
export const FileType = {
  GeneralBloodTest: "Umumiy Qon Tahlili (CBC / ОАК)",
  BiochemicalBloodTest: "Bioximiyoviy Qon Tahlili (Биохимия крови)",
  GeneralUrineTest: "Umumiy Siydik Tahlili (Urinalysis / ОАМ)",
  HormoneBloodTest: "Qon Gormonlari Tahlili (Гормоны крови)",
  InfectionAnalysis: "Infeksiyalarga Tahlillar (TORCH, Gepatitlar, VICH va b.)",
  Immunogram: "Immunogramma",
  Coagulogram: "Koagulogramma (Qon ivish tahlili)",
  ECG: "EKG (Elektrokardiogramma)",
  EEG: "EEG (Elektroensefalogramma) Xulosasi (ЭЭГ)",
  Echocardiography: "Exokardiografiya (Yurak UZIsi / ЭхоКГ сердца)",
  HolterECG: "Xolter EKG Monitoringi Xulosasi (Холтер ЭКГ)",
  Ultrasound: "UZD (Ultratovush Diagnostikasi / УЗИ)",
  XRay: "Rentgen Surati/Xulosasi",
  MRI: "MRT (Magnit-Rezonans Tomografiya) Xulosasi",
  CT: "MSKT/KT (Multispiral/Kompyuter Tomografiya) Xulosasi",
  Densitometry: "Densitometriya (Suyak Zichligi Tahlili / Денситометрия)",
  Angiography: "Angiografiya Xulosasi (Ангиография)",
  Biopsy: "Biopsiya Natijasi / Gistologik Xulosa (Биопсия)",
  Endoscopy: "Endoskopiya (Gastroskopiya, Kolonoskopiya) Xulosasi",
  DoctorConsultation: "Shifokor Konsultatsiyasi/Xulosasi",
  MedicalRecordExtract: "Tibbiy Karta Ko'chirmasi (Выписка)",
  Prescription: "Retsept (Дори рецепти)",
  OtherMedicalDocument: "Boshqa Tibbiy Hujjat"
};
Object.freeze(FileType);

/*
export interface UploadedFile {
  id: string;
  file: File;
  type: string; // Should be one of the FileType values
  previewUrl?: string;
}

export interface HealthArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  keywords: string[];
  lastUpdated: string;
}

export interface DrugIdentificationResult {
  wasIdentified: boolean;
  responseText: string;
}
*/
export const Language = {
  UZ: 'uz',
};
Object.freeze(Language);
/*
// User interface is now defined above
*/