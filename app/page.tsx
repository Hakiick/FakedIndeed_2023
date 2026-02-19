'use client';

import React, { useState } from 'react';
import JobList from './components/jobs/JobList';
import Job from './components/jobs/Job';

export default function Home() {
  const [reloadJob, setReloadJob] = useState(false);

  const reloadJobComponent = () => {
    setReloadJob(!reloadJob);
  };

  return (
    <>
      <main className="lg:flex">
        <div className="lg:max-w-2xl overflow-y-auto h-52 lg:h-screen mx-4 p-2 flex-1">
          <JobList reloadJobComponent={reloadJobComponent} selectedCompany="" />
        </div>
        <div className="lg:max-w-6xl overflow-y-auto h-screen mx-4 p-2 flex-1">
          <Job key={reloadJob ? 1 : 0} />
        </div>
      </main>
    </>
  );
}
