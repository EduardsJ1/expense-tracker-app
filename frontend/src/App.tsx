import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Login from './pages/Login';
import TransactionsPage from './pages/Transactions';
import LandingPage from './pages/Landingpage';
import ProtectedRoute from './components/ProtectedRoute';
function App() {

  return (
    <>
     <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage/>} />
          <Route path='/register' element={<Register/>}/>
          <Route path='/login' element={<Login/>}/>

          <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
          <Route path='/transactions' element={<ProtectedRoute><TransactionsPage/></ProtectedRoute>}/>
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
