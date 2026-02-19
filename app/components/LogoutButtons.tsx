import { FaUserSlash } from 'react-icons/fa';

interface LogoutButtonsProps {
  Logout: () => void;
}

export default function LogoutButtons({ Logout }: LogoutButtonsProps) {
  return (
    <div className="flex space-x-4">
      <button className="bg-white p-2 rounded-lg flex items-center">
        <FaUserSlash onClick={Logout} size={24} />&#8206; Log-Out
      </button>
    </div>
  );
}
