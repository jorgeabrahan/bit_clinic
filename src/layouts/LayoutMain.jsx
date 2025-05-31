import Navbar from '@/components/global/NavBar';

export default function LayoutMain({ children }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
