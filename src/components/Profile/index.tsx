'use client';

import { useRouter } from 'next/navigation';

const ProfileClient = () => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push('/settings');
  };

  return (
    <button
      className="flex cursor-pointer items-center justify-center gap-2 rounded bg-primary px-2 py-1 text-sm font-medium text-white hover:bg-opacity-80 xsm:px-4"
      onClick={handleClick}
    >
      <span>
        {/* SVG icon or any other content */}
      </span>
      <span>Edit</span>
    </button>
  );
};

export default ProfileClient;
