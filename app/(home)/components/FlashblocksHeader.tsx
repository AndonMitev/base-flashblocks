'use client';

import React, { useState } from 'react';
import AnimatedTitle from './AnimatedTitle';

const FlashblocksHeader: React.FC = () => {
  const [isTypingComplete, setIsTypingComplete] = useState(false);

  const handleTypingComplete = () => {
    setIsTypingComplete(true);
  };

  return (
    <div className='mb-8 sm:mb-10 md:mb-14 text-center relative'>
      {/* Decorative lightning bolt in background */}
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 opacity-5 pointer-events-none'>
        <svg
          className='w-full h-full text-blue-300'
          viewBox='0 0 24 24'
          fill='currentColor'
        >
          <path d='M13 10V3L4 14h7v7l9-11h-7z' />
        </svg>
      </div>

      <div className='mb-3 sm:mb-4 inline-flex items-center rounded-full bg-blue-900/50 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium text-blue-300 shadow-inner'>
        <span className='mr-1.5 animate-pulse'>⚡</span> Base: The Fastest EVM
        Chain
      </div>

      <div className='relative mb-4 sm:mb-5'>
        <h1 className='bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-transparent'>
          <AnimatedTitle
            text='Flashblocks Explorer'
            speed={80}
            delay={300}
            scrambleIntensity={2}
            onComplete={handleTypingComplete}
          />
        </h1>
      </div>

      <p
        className={`mx-auto max-w-2xl text-sm sm:text-base md:text-lg text-blue-100/90 leading-relaxed transition-opacity duration-1000 ${
          isTypingComplete ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Experience the future of blockchain speed on
        <span className='mx-1 font-semibold text-blue-300'>Base</span>
        with revolutionary Flashblocks technology —
        <span className='mx-1 inline-flex items-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-2 py-0.5 text-xs sm:text-sm font-medium text-white shadow-sm'>
          <span className='mr-1 animate-pulse'>⚡</span> 200ms
        </span>
        block times make Base
        <span className='mx-1 sm:mx-2 font-bold text-blue-300'>10x faster</span>
        than any other EVM chain!
      </p>
    </div>
  );
};

export default FlashblocksHeader;
