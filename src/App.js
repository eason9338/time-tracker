import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importing components
import Navbar from './pages/Navbar';
import Title from './pages/Title';
import NotFound from './pages/NotFound';
import Timer from './pages/Timer';
import Login from './pages/Login';
import Signup from './pages/Signup';
import HomePage from './pages/HomePage';
import ManageTag from './pages/ManageTag';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <div className="App">
          <Navbar />
          <main className="content">
            <Routes>
              <Route path='/' element={<Title />} />
              <Route path='/timer' element={<Timer />} />
              <Route path='*' element={<NotFound />} />
              <Route path='/log-in' element={<Login />} />
              <Route path='/sign-up' element={<Signup />} />
              <Route path='/home-page' element={<HomePage />} />
              <Route path='/home-page/manage-tag' element={<ManageTag />} />
            </Routes>
          </main>
        </div>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App;
