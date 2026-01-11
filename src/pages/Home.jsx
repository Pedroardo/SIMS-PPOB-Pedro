import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getProfile } from '../redux/slices/profileSlice'
import { getBalance } from '../redux/slices/balanceSlice'
import { getServices } from '../redux/slices/serviceSlice'
import { getBanners } from '../redux/slices/bannerSlice'
import Navbar from '../components/Navbar'
import BalanceCard from '../components/BalanceCard'
import ServiceCard from '../components/ServiceCard'
import BannerSlider from '../components/BannerSlider'

const Home = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data: profile } = useSelector((state) => state.profile)
  const { services } = useSelector((state) => state.service)
  const { banners } = useSelector((state) => state.banner)

  useEffect(() => {
    dispatch(getProfile())
    dispatch(getBalance())
    dispatch(getServices())
    dispatch(getBanners())
  }, [dispatch])

  const handleServiceClick = (serviceCode) => {
    navigate(`/payment/${serviceCode}`)
  }

  if (!profile) {
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

        <section className="mb-12">
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.service_code}
                service={service}
                onClick={() => handleServiceClick(service.service_code)}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Temukan promo menarik</h3>
          <BannerSlider banners={banners} />
        </section>
      </div>
    </div>
  )
}

export default Home
