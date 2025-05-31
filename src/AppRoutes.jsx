import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PageSignIn from './pages/PageSignIn';
import PageSignUp from './pages/PageSignUp';
import RoutePrivate from './routes/RoutePrivate';
import RouteGuest from './routes/RouteGuest';
import LayoutMain from './layouts/LayoutMain';
import PageHome from './pages/PageHome';
import PageProfile from './pages/PageProfile';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <RoutePrivate>
              <LayoutMain>
                <PageHome />
              </LayoutMain>
            </RoutePrivate>
          }
        />
        <Route
          path='/profile'
          element={
            <RoutePrivate>
              <LayoutMain>
                <PageProfile />
              </LayoutMain>
            </RoutePrivate>
          }
        />
        <Route
          path='/sign-in'
          element={
            <RouteGuest>
              <PageSignIn />
            </RouteGuest>
          }
        />
        <Route
          path='/sign-up'
          element={
            <RouteGuest>
              <PageSignUp />
            </RouteGuest>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
