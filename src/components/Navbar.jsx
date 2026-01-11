import { Link, useLocation } from 'react-router-dom'
import { FiUser } from 'react-icons/fi'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname === path ? 'text-primary' : 'text-gray-600 hover:text-primary'
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-800">SIMS PPOB</span>
          </Link>

          <div className="flex items-center gap-8">
            <Link to="/topup" className={`font-medium transition ${isActive('/topup')}`}>
              Top Up
            </Link>
            <Link to="/transaction" className={`font-medium transition ${isActive('/transaction')}`}>
              Transaction
            </Link>
            <Link to="/profile" className={`font-medium transition ${isActive('/profile')}`}>
              Akun
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
