'use client';

import JobForm from '@/components/jobs/JobForm';

export default function NewJobPage() {
  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Publier une offre</h1>
      <JobForm mode="create" />
    </div>
  );
}
