'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import type { Job } from '@/types/job';

interface ApplyFormUser {
  email: string | null;
  name: string | null;
  lastname: string | null;
  phone: string | null;
  website: string | null;
}

interface ApplyFormProps {
  user: ApplyFormUser;
}

const getAds = async (): Promise<Job[] | undefined> => {
  try {
    const res = await fetch('/api/ads', {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error('Failed to fetch ads');
    }

    return res.json() as Promise<Job[]>;
  } catch (error) {
    return undefined;
  }
};

export default function ApplyForm({ user }: ApplyFormProps) {
  const { email, name, lastname, phone, website } = user;

  const [ad, setAd] = useState<Job | null | undefined>(undefined);

  useEffect(() => {
    const lastAdViewId = Number(Cookies.get('LastAdView'));

    getAds().then((data) => {
      if (data) {
        const matchingAd = data.find((item) => item.id === lastAdViewId);

        if (matchingAd) {
          setAd(matchingAd);
          setAdId(matchingAd.id);
          setCompany(matchingAd.company);
        } else {
          setAd(null);
          setAdId(null);
          setCompany('');
        }
      }
    });
  }, []);

  const [emailForm, setEmailForm] = useState(email ?? '');
  const [nameForm, setNameForm] = useState(name ?? '');
  const [lastnameForm, setLastnameForm] = useState(lastname ?? '');
  const [phoneForm, setPhoneForm] = useState(phone ?? '');
  const [websiteForm, setWebsiteForm] = useState(website ?? '');
  const [motivationsForm, setMotivationsForm] = useState('');

  const [adId, setAdId] = useState<number | null>(null);
  const [company, setCompany] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const confirmed = confirm('Are you sure you want to apply for this job? Make sure all the informations are correct');
    if (!confirmed) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          ad_id: adId,
          company_name: company,
          name: nameForm,
          lastname: lastnameForm,
          email: emailForm,
          phone: phoneForm,
          motivations: motivationsForm,
          website: websiteForm,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to submit application');
      }

      alert('You successfully applied for this job!');
      router.refresh();
      router.push('/');
    } catch (error) {
      setIsLoading(false);
    }
  };

  if (ad) {
    return (
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <label>
            Name: <span className="text-red-600">*</span>
          </label>
          <input
            onChange={(e) => setNameForm(e.target.value)}
            value={nameForm}
            className="border border-slate-500 px-8 py-2 required-custom-input"
            type="text"
            required
            placeholder="Doe"
            disabled={name !== null}
          />
          <label htmlFor="lastname">
            Lastname: <span className="text-red-600">*</span>
          </label>
          <input
            onChange={(e) => setLastnameForm(e.target.value)}
            value={lastnameForm}
            className="border border-slate-500 px-8 py-2 required-custom-input"
            type="text"
            required
            placeholder="John"
            disabled={lastname !== null}
          />
          <label>
            Email: <span className="text-red-600">*</span>
          </label>
          <input
            onChange={(e) => setEmailForm(e.target.value)}
            value={emailForm}
            className="border border-slate-500 px-8 py-2 required-custom-input"
            type="email"
            required
            placeholder="john.doe@example.com"
            disabled={email !== null}
          />
          <label>Phone:</label>
          <input
            onChange={(e) => setPhoneForm(e.target.value)}
            value={phoneForm}
            className="border border-slate-500 px-8 py-2 required-custom-input"
            type="tel"
            minLength={12}
            maxLength={12}
            placeholder="+33612345678"
            disabled={phone !== null}
          />
          <label>Your Motivations: </label>
          <textarea
            onChange={(e) => setMotivationsForm(e.target.value)}
            value={motivationsForm}
            className="border border-slate-500 px-8 py-2 required-custom-input"
            minLength={20}
            maxLength={200}
            placeholder="I really want to have this job."
          />
          <label>Website:</label>
          <input
            onChange={(e) => setWebsiteForm(e.target.value)}
            value={websiteForm}
            className="border border-slate-500 px-8 py-2 required-custom-input"
            type="url"
            pattern="http.*"
            placeholder="https://johndoe.com"
            disabled={website !== null}
          />
          <div className="flex flex-col py-8 items-center justify-center">
            <div className="w-1/2">
              <button
                type="submit"
                className={`bg-blue-500 rounded-lg font-semibold text-white py-3 px-6 w-full ${
                  isLoading ? 'cursor-not-allowed opacity-50' : ''
                }`}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Apply Job'}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  } else {
    return <p className="text-2xl font-light">Loading your Profile...</p>;
  }
}
