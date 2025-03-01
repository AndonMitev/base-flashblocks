import { ConnectButton } from './components/ConnectButton';
import Link from 'next/link';

export default function Home() {
  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex flex-col gap-8'>
        <div className='flex justify-between items-center'>
          <ConnectButton />
        </div>

        <div className='grid grid-cols-1 gap-8'>
          <section>
            <h1 className='text-3xl font-bold mb-6'>Welcome to Base</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <Link
                href='/flashblocks'
                className='p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100'
              >
                <h2 className='text-xl font-semibold mb-2'>
                  Flashblocks Explorer
                </h2>
                <p className='text-gray-600'>
                  View real-time Flashblocks data from the Base Sepolia testnet.
                </p>
              </Link>

              {/* Add more feature cards here as they become available */}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
