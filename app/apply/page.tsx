'use client';

import ApplyForm from './applyFrom';
import Job from '../components/jobs/Job';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import type { User } from '@/types/user';

interface ApplyFormUser {
  email: string | null;
  name: string | null;
  lastname: string | null;
  phone: string | null;
  website: string | null;
}

export default function ApplyJob() {
  const { user: authUser } = useAuth();
  const email = authUser?.email ?? null;
  const [user, setUser] = useState<User | null>(null);

  const getUsers = async (): Promise<User[] | undefined> => {
    try {
      const res = await fetch('/api/users', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      return res.json() as Promise<User[]>;
    } catch {
      return undefined;
    }
  };

  useEffect(() => {
    if (!email) return;

    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (data) {
          const matchingUser = data.find((item) => item.email === email);

          if (matchingUser) {
            setUser(matchingUser);
          }
        }
      } catch {
        // silently handle
      }
    };

    fetchUsers();
  }, [email]);

  if (user === null) {
    const userEmpty: ApplyFormUser = {
      email: null,
      name: null,
      lastname: null,
      phone: null,
      website: null,
    };
    return (
      <main className="lg:flex">
        <p>&#8206;</p>
        <div className="lg:max-w-2xl mx-4 p-2 flex-1">
          <ApplyForm user={userEmpty} />
        </div>
        <div className="max-w-6xl overflow-y-auto h-screen mx-4 p-2 flex-1">
          <Job />
        </div>
      </main>
    );
  }

  const applyUser: ApplyFormUser = {
    email: user.email,
    name: user.name,
    lastname: user.lastname,
    phone: user.phone,
    website: user.website,
  };

  return (
    <main className="lg:flex">
      <div className="lg:max-w-2xl mx-4 p-2 flex-1">
        <ApplyForm user={applyUser} />
      </div>
      <div className="max-w-6xl overflow-y-auto h-screen mx-4 p-2 flex-1">
        <Job />
      </div>
    </main>
  );
}
