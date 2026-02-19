import Link from 'next/link';
import { FaUserAlt } from 'react-icons/fa';

export default function AuthButtons() {
  return (
    <div className="flex space-x-4">
      <Link className="bg-white p-2 rounded-lg flex items-center" href="/account">
        <FaUserAlt size={24} />&#8206; Login
      </Link>
    </div>
  );
}
