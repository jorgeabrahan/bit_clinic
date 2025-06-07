import NavBar from '@/components/global/NavBar';
import { Toaster } from 'sonner';

export default function LayoutMain({ children }) {
  return (
    <>
      <NavBar />
      {children}
      <Toaster richColors />
    </>
  );
}
