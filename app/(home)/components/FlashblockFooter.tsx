export default function FlashblockFooter() {
  return (
    <footer className='mt-6 sm:mt-8 md:mt-12 overflow-hidden rounded-xl border border-blue-800/30 bg-gradient-to-br from-blue-900/40 to-purple-900/30 p-4 sm:p-6 backdrop-blur-sm'>
      <a
        href='https://github.com/AndonMitev/base-flashblocks'
        target='_blank'
        rel='noopener noreferrer'
        className='group flex items-center justify-center gap-2 sm:gap-4 transition-all duration-300'
      >
        <svg
          className='w-6 h-6 sm:w-8 sm:h-8 text-blue-300'
          fill='currentColor'
          viewBox='0 0 24 24'
          aria-hidden='true'
        >
          <path
            fillRule='evenodd'
            d='M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z'
            clipRule='evenodd'
          />
        </svg>

        <span className='text-base sm:text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
          View Source Code
        </span>

        <svg
          className='w-4 h-4 sm:w-5 sm:h-5 text-blue-300 transition-transform duration-300 group-hover:translate-x-1'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M14 5l7 7m0 0l-7 7m7-7H3'
          />
        </svg>
      </a>
    </footer>
  );
}
