'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useGame } from '../context/GameContext';

interface WithdrawPopupProps {
  onClose: () => void;
  onSuccess: (points: number, amount: number) => void;
}

export default function WithdrawPopup({ onClose, onSuccess }: WithdrawPopupProps) {
  const { balance } = useGame();
  const [points, setPoints] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);
  const [error, setError] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const POINT_TO_BIRR = 0.04;
  const COMMISSION_RATE = 0.05;
  const MIN_WITHDRAW_BIRR = 100;
  const MIN_POINTS = MIN_WITHDRAW_BIRR / POINT_TO_BIRR;

  useEffect(() => {
    const numPoints = parseFloat(points) || 0;
    
    // Validate points against balance
    if (numPoints > balance) {
      setError(`You only have ${balance.toFixed(2)} points available`);
    } else if (numPoints > 0 && numPoints < MIN_POINTS) {
      setError(`Minimum withdrawal is ${MIN_WITHDRAW_BIRR} Birr (${MIN_POINTS} Points)`);
    } else {
      setError('');
    }

    const calculatedAmount = numPoints * POINT_TO_BIRR;
    setAmount(calculatedAmount);
    setFinalAmount(calculatedAmount * (1 - COMMISSION_RATE));
  }, [points, balance]);

  const handleWithdraw = () => {
    const numPoints = parseFloat(points);
    if (numPoints <= balance && amount >= MIN_WITHDRAW_BIRR) {
      onSuccess(numPoints, finalAmount);
      setShowSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm dark:bg-black/70" onClick={onClose} />
      <div className="relative bg-white dark:bg-gaming-dark rounded-2xl p-6 md:p-8 max-w-md w-full animate-slideUpAndFade shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-theme-secondary hover:text-primary"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900 dark:text-primary mb-6">Withdraw Points</h2>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-gray-600 dark:text-theme-secondary">
                Points to Withdraw
              </label>
              <span className="text-sm text-gray-600 dark:text-theme-secondary">
                Available: {balance.toFixed(2)} Points
              </span>
            </div>
            <input
              type="number"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full bg-gray-100 dark:bg-white/5 rounded-lg p-3 text-gray-900 dark:text-white
                border border-gray-200 dark:border-orange-500 focus:outline-none focus:border-primary"
              placeholder="Enter points"
              min={MIN_POINTS}
              max={balance}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}
          </div>

          <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 space-y-3">
            <div className="text-sm text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-white/10 pb-2 font-medium">
              Conversion Details
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Amount in Birr</span>
              <span className="text-primary">{amount.toFixed(2)} Birr</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400 font-medium">Commission (5%)</span>
              <span className="text-red-500">-{(amount * COMMISSION_RATE).toFixed(2)} Birr</span>
            </div>
            <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200 dark:border-white/10">
              <span className="text-gray-600 dark:text-gray-400">Final Amount</span>
              <span className="text-green-500">{finalAmount.toFixed(2)} Birr</span>
            </div>
          </div>

          <button
            onClick={handleWithdraw}
            disabled={!points || parseFloat(points) > balance || amount < MIN_WITHDRAW_BIRR}
            className={`
              w-full py-3 rounded-lg font-bold transition-all duration-300
              ${(!points || parseFloat(points) > balance || amount < MIN_WITHDRAW_BIRR)
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 text-white'}
            `}
          >
            Withdraw Now
          </button>
        </div>
      </div>
    </div>
  );
} 