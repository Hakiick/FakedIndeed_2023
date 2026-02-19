'use client';

import { FaThumbsUp } from 'react-icons/fa';

export default function LikeJobBtn() {
  const handleClick = () => {
    document.cookie = 'access=true; path=/; SameSite=Lax';
  };

  return (
    <button>
      <FaThumbsUp onClick={handleClick} className="bg-gray-200 p-2 rounded-lg flex items-center" size={48} />
    </button>
  );
}
