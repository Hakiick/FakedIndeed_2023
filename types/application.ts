export interface Application {
  id: number;
  ad_id: number;
  company_name: string;
  name: string;
  lastname: string;
  email: string;
  phone: string;
  motivations: string;
  website: string;
  cv: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationCreate = Omit<Application, 'id' | 'createdAt' | 'updatedAt'>;
