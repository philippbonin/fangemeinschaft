import React, { Fragment, useState, useEffect } from 'react';
import { Dialog as HeadlessDialog, Transition } from '@headlessui/react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  id?: string;
}

export default function Dialog({ isOpen: initialIsOpen, onClose: externalOnClose, title, children, id }: DialogProps) {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  
  useEffect(() => {
    const stateElement = document.getElementById(`dialog-state-${id}`);
    if (!stateElement) return;

    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
      setIsOpen(false);
      externalOnClose();
    };

    stateElement.addEventListener('open', handleOpen);
    stateElement.addEventListener('close', handleClose);

    // Define global function
    if (id) {
      (window as any)[`showJourneyDetails_${id}`] = handleOpen;
    }

    return () => {
      stateElement.removeEventListener('open', handleOpen);
      stateElement.removeEventListener('close', handleClose);
      
      // Clean up global function
      if (id) {
        delete (window as any)[`showJourneyDetails_${id}`];
      }
    };
  }, [id, externalOnClose]);

  const onClose = () => {
    setIsOpen(false);
    externalOnClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <HeadlessDialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <HeadlessDialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <HeadlessDialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-4">
                  {title}
                </HeadlessDialog.Title>
                {children}
              </HeadlessDialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </HeadlessDialog>
    </Transition>
  );
}