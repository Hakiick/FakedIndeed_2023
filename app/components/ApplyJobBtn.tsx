import Link from 'next/link';
import { FaBriefcase } from 'react-icons/fa';

export default function ApplyJobBtn() {
  return (
    <div className="flex space-x-4">
      <Link className="bg-blue-500 p-2 rounded-lg flex items-center new-text-2xl font-semibold" href="/apply">
        <FaBriefcase size={24} />&#8206; Apply Job
      </Link>
    </div>
  );
}
