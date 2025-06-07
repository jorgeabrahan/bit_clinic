import PageLoading from '@/pages/PageLoading';
import { ServiceAuth } from '@/Services/ServiceAuth';
import useStoreUser from '@/stores/useStoreUser';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

export default function RoutePrivate({ children }) {
  const isLoggedIn = useStoreUser((store) => store.isLoggedIn);
  const user = useStoreUser((store) => store.user);
  const storeSetUser = useStoreUser((store) => store.setUser);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (isLoggedIn && typeof user.id === 'string' && user.id.length > 0) {
        return setIsLoading(false);
      }
      const { ok, data } = await ServiceAuth.restoreSession();
      if (ok) {
        storeSetUser(data);
      }
      setIsLoading(false);
    })();
  }, [isLoggedIn, user, storeSetUser]);

  if (isLoading) {
    return <PageLoading message='Restaurando sesión...' />;
  }
  if (!isLoggedIn) {
    return <Navigate to='/sign-in' replace />;
  }
  return children;
}
