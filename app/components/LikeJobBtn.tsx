'use client';

import { FaThumbsUp } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function LikeJobBtn() {
  const handleClick = () => {
    Cookies.set('access', 'true');
  };

  return (
    <button>
      <FaThumbsUp onClick={handleClick} className="bg-gray-200 p-2 rounded-lg flex items-center" size={48} />
    </button>
  );
}
