import { Monitor } from 'lucide-react';
import { LaptopModel } from '../lib/supabase';

interface LaptopCardProps {
  laptop: LaptopModel;
  onRequest: (laptop: LaptopModel) => void;
}

export default function LaptopCard({ laptop, onRequest }: LaptopCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200 flex items-center justify-center">
        {laptop.image_url ? (
          <img
            src={laptop.image_url}
            alt={laptop.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Monitor className="w-16 h-16 text-gray-400" />
        )}
        {!laptop.available && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{laptop.name}</h3>
            <p className="text-sm text-gray-600">{laptop.brand}</p>
          </div>
          <span className="text-2xl font-bold text-blue-600">${laptop.price.toLocaleString()}</span>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Processor:</span>
            <span className="font-medium text-gray-900">{laptop.processor}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">RAM:</span>
            <span className="font-medium text-gray-900">{laptop.ram}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Storage:</span>
            <span className="font-medium text-gray-900">{laptop.storage}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Screen:</span>
            <span className="font-medium text-gray-900">{laptop.screen_size}</span>
          </div>
        </div>

        <button
          onClick={() => onRequest(laptop)}
          disabled={!laptop.available}
          className={`mt-6 w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
            laptop.available
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {laptop.available ? 'Request This Laptop' : 'Unavailable'}
        </button>
      </div>
    </div>
  );
}
