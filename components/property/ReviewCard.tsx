import { Star } from 'lucide-react';

interface ReviewCardProps {
  author: string;
  rating: number;
  text: string;
  date: string;
}

export default function ReviewCard({ author, rating, text, date }: ReviewCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{author}</h3>
          <p className="text-sm text-gray-500">{date}</p>
        </div>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={i < rating ? 'fill-gold text-gold' : 'text-gray-300'}
            />
          ))}
        </div>
      </div>
      <p className="text-gray-700">{text}</p>
    </div>
  );
}
