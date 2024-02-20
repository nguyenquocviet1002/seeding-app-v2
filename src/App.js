import { Navigate, Route, Routes } from 'react-router-dom';
import { tokenName } from './utils/config';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useToast } from './hooks/useToast';
import ScreenLogin from './screens/Login';
import ScreenDashboard from './screens/Dashboard';
import ScreenPageNotFound from './screens/PageNotFound';
import Form from './components/Form';
import Booking from './components/Booking';
import ToastList from './components/ToastList/ToastList';
import QuantityFB from './components/QuantityFB';
import QuantitySuccess from './components/QuantitySuccess';
import CheckData from './components/CheckData';

function App() {
  const [token] = useLocalStorage(tokenName, null);
  const { toasts, showToast, removeToast } = useToast();

  return (
    <>
      <Routes>
        <Route index element={token ? <Navigate to="/form" replace /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<ScreenLogin showToast={showToast} />} />
        <Route path="/" element={<ScreenDashboard showToast={showToast} />}>
          <Route path="form" element={<Form />} />
          <Route path="lead-booking" element={<Booking />} />
          <Route path="quantity-fb" element={<QuantityFB />} />
          <Route path="quantity-success" element={<QuantitySuccess />} />
          <Route path="check-data" element={<CheckData />} />
        </Route>
        <Route path="*" element={<ScreenPageNotFound />} />
      </Routes>
      <ToastList data={toasts} removeToast={removeToast} />
    </>
  );
}

export default App;
