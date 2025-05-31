import PageLoading from '@/pages/PageLoading';
import { ServiceAuth } from '@/Services/ServiceAuth';
import useStoreUser from '@/stores/useStoreUser';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function RouteGuest({ children }) {
  const isLoggedIn = useStoreUser((store) => store.isLoggedIn);
  const user = useStoreUser((store) => store.user);
  const signIn = useStoreUser((store) => store.signIn);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (isLoggedIn && typeof user.id === 'string' && user.id.length > 0) {
        return setIsLoading(false);
      }
      const { ok, data } = await ServiceAuth.restoreSession();
      if (ok) {
        signIn(data);
      }
      setIsLoading(false);
    })();
  }, [isLoggedIn, user, signIn]);

  if (isLoading) {
    return <PageLoading message='Verificando sesión...' />;
  }

  if (isLoggedIn) {
    return <Navigate to='/' replace />;
  }

  return children;
}
