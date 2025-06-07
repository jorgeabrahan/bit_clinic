import Navbar from '@/components/global/Navbar';
import { Toaster } from 'sonner';

export default function LayoutMain({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Toaster richColors />
    </>
  );
}
