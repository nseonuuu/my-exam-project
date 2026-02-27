import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import MyPage from './pages/MyPage';
import WrongNotePage from './pages/WrongNotePage';
import CustomExamPage from './pages/CustomExamPage';
import NavBar from './components/NavBar';
import PrivateRoute from './components/PrivateRoute';


export default function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/"             element={<MainPage />} />
        <Route path="/mypage"      element={<PrivateRoute><MyPage /></PrivateRoute>} />
        <Route path="/wrong-note"  element={<PrivateRoute><WrongNotePage /></PrivateRoute>} />
        <Route path="/custom-exam" element={<PrivateRoute><CustomExamPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}