import React from 'react';

interface AmenityCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function AmenityCard({ icon, title, description }: AmenityCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200 hover:border-mountain-light hover:shadow-lg transition-all">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center text-gold">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>
      </div>
    </div>
  );
}
