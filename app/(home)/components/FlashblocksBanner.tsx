'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FlashblocksBannerProps {
  className?: string;
}

const FlashblocksBanner: React.FC<FlashblocksBannerProps> = ({
  className = ''
}) => {
  return (
    <Link
      href='https://base.mirror.xyz/HwG1GQ5hoxz0OTOF_nQhNcVTk4Ae9cRIrcqVQ14N4-c'
      target='_blank'
      rel='noopener noreferrer'
      className={`block ${className} transform transition-all duration-300 hover:scale-[1.02]`}
    >
      <div className='relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-900/80 via-blue-800/80 to-blue-900/80 p-4 backdrop-blur-sm border border-blue-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-600/50'>
        <div className='absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 animate-pulse'></div>
        <div
          className='absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-3xl -ml-10 -mb-10 animate-pulse'
          style={{ animationDelay: '1s' }}
        ></div>

        <div className='absolute top-1/2 right-4 transform -translate-y-1/2 opacity-5'>
          <svg
            className='w-24 h-24 text-blue-300'
            viewBox='0 0 24 24'
            fill='currentColor'
          >
            <path d='M13 10V3L4 14h7v7l9-11h-7z' />
          </svg>
        </div>

        <div className='flex items-center gap-4 relative z-10'>
          <div className='flex-shrink-0 relative w-12 h-12 bg-white rounded-full p-1.5 shadow-md'>
            <Image
              src='/base-logo.png'
              alt='Base Logo'
              width={48}
              height={48}
              className='object-contain'
            />
          </div>

          <div className='flex-1'>
            <h3 className='text-sm font-bold text-white flex items-center'>
              <span className='mr-1.5'>Flashblocks on Base</span>
              <span className='inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-0.5 text-xs font-medium text-white'>
                <span className='mr-0.5'>⚡</span>200ms
              </span>
            </h3>
            <p className='text-xs text-blue-100/90 mt-1 leading-relaxed'>
              Experience 10x faster block times than any other EVM chain with
              Base&apos;s revolutionary Flashblocks technology.
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FlashblocksBanner;
