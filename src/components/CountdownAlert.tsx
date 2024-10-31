import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const CountdownAlert = () => {
  const [dismissed, setDismissed] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const deadline = new Date('2024-11-17T22:00:00-05:00').getTime();
      const now = new Date().getTime();
      const remaining = deadline - now;

      const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

      setTimeRemaining(`${days}d ${hours}h ${minutes}m`);
    };

    calculateTime();
    const interval = setInterval(calculateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  return (
    <div className="mb-8">
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8 bg-zinc-50 dark:bg-[#212121] border border-zinc-200 dark:border-zinc-800 rounded-lg">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            <span className="flex p-2">
              <span className="text-gray-600 dark:text-gray-400">
                Voting ends in: <span className="font-semibold text-red-700 dark:text-red-400">{timeRemaining}</span>
              </span>
            </span>
          </div>
          <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
            <button
              type="button"
              onClick={() => setDismissed(true)}
              className="-mr-1 flex p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800/30 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            >
              <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountdownAlert;