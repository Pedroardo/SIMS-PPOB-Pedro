import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import TopUp from './pages/TopUp'
import Payment from './pages/Payment'
import Transaction from './pages/Transaction'
import Profile from './pages/Profile'

const ProtectedRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)
  return token ? children : <Navigate to="/login" />
}

const PublicRoute = ({ children }) => {
  const { token } = useSelector((state) => state.auth)
  return !token ? children : <Navigate to="/" />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/topup" 
          element={
            <ProtectedRoute>
              <TopUp />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/payment/:serviceCode" 
          element={
            <ProtectedRoute>
              <Payment />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transaction" 
          element={
            <ProtectedRoute>
              <Transaction />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App
