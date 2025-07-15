
export interface PersonalInfo {
  name: string;
  title: string;
  phone: string;
  email: string;
  linkedin: string;
  location: string;
}

export interface Experience {
  id: number;
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string;
}
