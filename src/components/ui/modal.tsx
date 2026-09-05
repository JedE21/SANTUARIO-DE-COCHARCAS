import * as React from 'react';
import { cva } from 'class-variance-authority';

const modalOverlayVariants = cva('fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50', {
  variants: {},
  defaultVariants: {},
});

const modalContentVariants = cva(
  'relative z-50 max-h-[85vh] w-full max-w-lg overflow-y-auto border-none rounded-lg bg-card px-6 py-6 shadow-xl ring-1 ring-ring',
  {
    variants: {},
    defaultVariants: {},
  }
);

interface ModalProps {
  children: React.ReactNode;
  className?: string;
  onClose: () => void;
}

export const Modal = ({
  children,
  className = '',
  onClose,
}: ModalProps) => {
  return (
    <div onClick={onClose} className={modalOverlayVariants({ className })}>
      <div onClick={(e) => e.stopPropagation()} className={modalContentVariants()}>
        {children}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground transition-normal hover:text-foreground/80"
          aria-label="Cerrar"
        >
          <span className="block h-4 w-4" aria-hidden="true">×</span>
        </button>
      </div>
    </div>
  );
};
