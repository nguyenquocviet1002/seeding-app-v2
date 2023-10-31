import { Navigate, Route, Routes } from 'react-router-dom';
import ScreenLogin from './screens/Login';
import ScreenDashboard from './screens/Dashboard';
import Form from './components/Form';
import Booking from './components/Booking';

function App() {
  const token = true;
  return (
    <Routes>
      <Route index element={token ? <Navigate to="/form" replace /> : <Navigate to="/login" replace />} />
      <Route path="/login" element={<ScreenLogin />} />
      <Route path="/" element={<ScreenDashboard />}>
        <Route path="form" element={<Form />} />
        <Route path="lead-booking" element={<Booking />} />
      </Route>
    </Routes>
  );
}

export default App;
