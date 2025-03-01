import FlashblocksSection from './components/flashblocks/FlashblocksSection';
import BlockSection from './components/blocks/BlockSection';
import FlashblocksIntro from './components/FlashblocksIntro';
import FlashblockFooter from './components/FlashblockFooter';

export default function FlashblocksPage() {
  return (
    <div className='relative min-h-screen bg-gradient-to-b from-gray-950 via-blue-950 to-gray-900 px-3 sm:px-4 py-8 sm:py-12 md:py-16'>
      {/* Background decorative elements */}
      <div className='absolute left-0 top-0 -z-10 h-full w-full overflow-hidden'>
        <div className='absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-blue-500/10 blur-3xl'></div>
        <div className='absolute -bottom-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-purple-500/10 blur-3xl'></div>
        <div className='absolute left-[50%] top-[20%] h-[30%] w-[30%] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl'></div>
      </div>

      <div className='mx-auto max-w-7xl'>
        <FlashblocksIntro />

        {/* Two-column layout for blocks */}
        <div className='grid gap-4 sm:gap-6 md:gap-8 md:grid-cols-2'>
          <div className='h-full'>
            <FlashblocksSection />
          </div>
          <div className='h-full'>
            <BlockSection />
          </div>
        </div>

        <FlashblockFooter />
      </div>
    </div>
  );
}
