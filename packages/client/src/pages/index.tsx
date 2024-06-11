import { useAccount } from 'wagmi';

import LeftBar from '@/components/AppLayout/LeftBar';
import Middle from '@/components/AppLayout/Middle';
import RightBar from '@/components/AppLayout/RightBar';
import Layout from '@/components/layout/Layout';
import Wallet from '@/components/Providers/wallet';

export default function HomePage() {
  const {address} = useAccount()
  return (
    <Layout>
      {address ?
        <div className='grid grid-cols-12'>
        <div className='col-span-3'>
          <LeftBar />
        </div>
        <div className='col-span-6'>
          <Middle />
        </div>
        <div className='col-span-3'>
          <RightBar />
        </div>
      </div>
      :
      <div className='flex w-full justify-center items-center flex-col'>
        <p className='text-3xl mb-4'>Please connect wallet to continue</p>
        <Wallet />
      </div>
    }
    </Layout>
  );
}
