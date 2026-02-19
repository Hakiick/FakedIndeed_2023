export interface Job {
  id: number;
  title: string;
  description: string;
  jobTypes: string; // JSON array stored as string in DB
  minSalary: number;
  maxSalary: number;
  advantages: string;
  company: string;
  location: string;
  positionLocation: 'On-Site' | 'Semi-Remote' | 'Full-Remote';
  createdAt: Date;
  updatedAt: Date;
}

export type JobCreate = Omit<Job, 'id' | 'createdAt' | 'updatedAt'>;
export type JobUpdate = Partial<Omit<Job, 'id' | 'createdAt' | 'updatedAt'>>;
