"use client";
import React, { useEffect, useState } from 'react';
import { FaFileAlt, FaCalendarAlt, FaUserAlt } from 'react-icons/fa';
import { getTotalDocuments, getNewDocumentsThisMonth } from '@/services/documentService';
import { getTotalUsers } from '@/services/utilisateurService';
import Link from 'next/link';  // Import Link from next/link

const ECommerce: React.FC = () => {
  const [totalDocuments, setTotalDocuments] = useState<number>(0);
  const [newDocumentsThisMonth, setNewDocumentsThisMonth] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const totalDocs = await getTotalDocuments();
        const newDocsThisMonth = await getNewDocumentsThisMonth();
        const totalUsrs = await getTotalUsers();
        setTotalDocuments(totalDocs);
        setNewDocumentsThisMonth(newDocsThisMonth);
        setTotalUsers(totalUsrs);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchData();
  }, []);

  const stats = [
    { id: 1, title: 'Total documents', value: totalDocuments, icon: <FaFileAlt />, link: '/Documents' },
    { id: 2, title: 'New documents this month', value: newDocumentsThisMonth, icon: <FaCalendarAlt />, link: '/Documents' },
    { id: 3, title: 'Total users', value: totalUsers, icon: <FaUserAlt />, link: '/users' },
  ];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3">
        {stats.map((stat) => (
          <div key={stat.id} className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center">
            <div className="text-4xl text-teal-500 mb-2">{stat.icon}</div>
            <div className="text-lg font-semibold mb-1 text-black">{stat.title}</div>
            <div className="text-xl mb-2 text-black">{stat.value}</div>
            {/* No need for <a>, just use Link */}
            <Link href={stat.link} className="text-teal-500 hover:underline">
              View details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ECommerce;
