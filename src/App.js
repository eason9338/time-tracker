import { BrowserRouter, Routes, Route } from 'react-router-dom';
// Importing components
import Navbar from './Navbar';
import Title from './Title';
import NotFound from './NotFound';
import Timer from './Timer';
import Login from './Login';
import Signup from './Signup';
import HomePage from './HomePage';
import ManageTag from './ManageTag';
import { UserProvider } from './UserContext';

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
