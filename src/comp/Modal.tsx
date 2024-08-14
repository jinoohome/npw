import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const CommonModal = ({ isOpen, onClose, title, children, size = 'lg' }: CommonModalProps) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const sizeClass = {
    sm: 'w-1/3',
    md: 'w-1/2',
    lg: 'w-9/12',
  };

  return (
    <div className={`fixed inset-0 z-40 ${isOpen ? 'block' : 'hidden'}`} aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity cursor-pointer" aria-hidden="true">
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" onClick={handleOverlayClick}>
            <div className={`relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all my-8 ${sizeClass[size]}`}>
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="pb-4 border-b flex justify-between">
                  <h4 className="text-sm font-medium">{title}</h4>
                  <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-4 space-y-3">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default CommonModal;
