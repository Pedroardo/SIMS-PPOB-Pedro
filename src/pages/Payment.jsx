import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { createTransaction, clearTransactionSuccess } from '../redux/slices/transactionSlice'
import { getBalance } from '../redux/slices/balanceSlice'
import { getProfile } from '../redux/slices/profileSlice'
import { getServices } from '../redux/slices/serviceSlice'
import Navbar from '../components/Navbar'
import BalanceCard from '../components/BalanceCard'
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'

const Payment = () => {
  const { serviceCode } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const { data: profile } = useSelector((state) => state.profile)
  const { services } = useSelector((state) => state.service)
  const { loading, error, transactionSuccess } = useSelector((state) => state.transaction)
  
  const [service, setService] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')

  useEffect(() => {
    dispatch(getProfile())
    dispatch(getBalance())
    dispatch(getServices())
  }, [dispatch])

  useEffect(() => {
    if (services.length > 0) {
      const found = services.find(s => s.service_code === serviceCode)
      setService(found)
    }
  }, [services, serviceCode])

  useEffect(() => {
    if (transactionSuccess) {
      setModalType('success')
      setShowModal(true)
      dispatch(clearTransactionSuccess())
    }
  }, [transactionSuccess, dispatch])

  useEffect(() => {
    if (error) {
      setModalType('error')
      setShowModal(true)
    }
  }, [error])

  const handlePayment = () => {
    setModalType('confirm')
    setShowModal(true)
  }

  const handleConfirmPayment = async () => {
    setShowModal(false)
    await dispatch(createTransaction(serviceCode))
    await dispatch(getBalance())
  }

  const closeModal = () => {
    setShowModal(false)
    if (modalType === 'success') {
      navigate('/')
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        <BalanceCard profile={profile} />

        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-2">Pembayaran</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
            <img src={service.service_icon} alt={service.service_name} className="w-10 h-10" />
            {service.service_name}
          </h2>

          <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }} className="space-y-6">
            <div>
              <input
                type="text"
                value={`Rp ${service.service_tariff.toLocaleString('id-ID')}`}
                className="w-full px-4 py-4 border border-gray-300 rounded-lg bg-gray-50 text-lg font-semibold"
                readOnly
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
              disabled={loading}
            >
              Bayar
            </button>
          </form>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-slideUp" onClick={(e) => e.stopPropagation()}>
            {modalType === 'confirm' && (
              <>
                <div className="text-6xl mb-4">💳</div>
                <p className="text-gray-600 mb-2">Beli {service.service_name} senilai</p>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Rp {service.service_tariff.toLocaleString('id-ID')} ?
                </h3>
                <div className="space-y-3">
                  <button
                    className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition"
                    onClick={handleConfirmPayment}
                    disabled={loading}
                  >
                    {loading ? 'Memproses...' : 'Ya, lanjutkan Bayar'}
                  </button>
                  <button 
                    className="w-full text-primary hover:text-primary-dark font-medium py-3"
                    onClick={closeModal}
                  >
                    Batalkan
                  </button>
                </div>
              </>
            )}

            {modalType === 'success' && (
              <>
                <div className="text-green-500 text-6xl mb-4"><FiCheckCircle className="mx-auto" /></div>
                <p className="text-gray-600 mb-2">Pembayaran {service.service_name} sebesar</p>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Rp {service.service_tariff.toLocaleString('id-ID')}
                </h3>
                <p className="text-gray-600 mb-6">berhasil!</p>
                <button 
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition"
                  onClick={closeModal}
                >
                  Kembali ke Beranda
                </button>
              </>
            )}

            {modalType === 'error' && (
              <>
                <div className="text-red-500 text-6xl mb-4"><FiXCircle className="mx-auto" /></div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Pembayaran Gagal</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition"
                  onClick={closeModal}
                >
                  Tutup
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Payment
