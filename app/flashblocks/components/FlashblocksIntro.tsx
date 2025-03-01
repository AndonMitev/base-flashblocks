import React from 'react';
import FlashblocksHeader from './FlashblocksHeader';
import FlashblocksBanner from './shared/FlashblocksBanner';

const FlashblocksIntro: React.FC = () => {
  return (
    <div className='relative'>
      {/* Add subtle animated gradient background */}
      <div className='absolute inset-0 -z-10 bg-gradient-to-b from-blue-900/10 to-transparent rounded-3xl opacity-30'></div>

      <FlashblocksHeader />

      <div className='mb-8 sm:mb-10 max-w-3xl mx-auto transform transition-all'>
        <FlashblocksBanner />
      </div>
    </div>
  );
};

export default FlashblocksIntro;
