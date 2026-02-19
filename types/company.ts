export interface Company {
  id: number;
  name: string;
  emails: string; // JSON array stored as string in DB
  createdAt: Date;
  updatedAt: Date;
}

export type CompanyCreate = Omit<Company, 'id' | 'createdAt' | 'updatedAt'>;
