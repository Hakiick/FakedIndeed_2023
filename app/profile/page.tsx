'use client';

import EditProfile from './EditProfile';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import type { User } from '@/types/user';

export default function ProfilePage() {
  const email = Cookies.get('CookieUser');
  const [userType, setUserType] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [companiesList, setCompaniesList] = useState<string[]>([]);
  const [editProfileKey, setEditProfileKey] = useState(0);

  const getUsers = async (): Promise<User[] | undefined> => {
    try {
      const res = await fetch('/api/users', {
        cache: 'no-store',
      });

      if (!res.ok) {
        throw new Error('Failed to fetch users');
      }

      return res.json() as Promise<User[]>;
    } catch (error) {
      return undefined;
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        if (data) {
          const matchingUser = data.find((item) => item.email === email);

          if (matchingUser) {
            setUser(matchingUser);
            setUserType(matchingUser.userType);
          }

          if (data.length) {
            const usersEmail = data.map((u) => u.email);
            setCompaniesList(usersEmail);
          }
        }
      } catch (error) {
        // silently handle
      }
    };

    fetchUsers();
  }, [email]);

  const handleUserChange = async (newEmail: string) => {
    setSelectedEmail(newEmail);
    try {
      const data = await getUsers();
      if (data) {
        const matchingUser = data.find((item) => item.email === newEmail);

        if (matchingUser) {
          setUser(matchingUser);
        }
      }
    } catch (error) {
      // silently handle
    }
    setEditProfileKey((prevKey) => prevKey + 1);
  };

  if (user === null) {
    return <p className="text-2xl font-light">Loading your Profile...</p>;
  }

  return (
    <div>
      {userType === 'admin' && (
        <div className="p-6">
          <h1 className="text-2xl pt-3 font-bold mb-4">See users</h1>
          <div>
            <label>Select a user email:</label>
            <select
              value={selectedEmail}
              onChange={(e) => handleUserChange(e.target.value)}
              className="border border-slate-500 px-3 py-2 required-custom-input"
            >
              <option value="">--- Select a user email ---</option>
              {companiesList.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      <div className="max-w-8xl mx-16 p-2 flex-1">
        <EditProfile key={editProfileKey} user={user} />
      </div>
    </div>
  );
}
