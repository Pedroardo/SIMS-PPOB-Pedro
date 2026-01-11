const BannerSlider = ({ banners }) => {
  return (
    <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {banners.map((banner, index) => (
        <img 
          key={index}
          src={banner.banner_image} 
          alt={banner.banner_name}
          className="h-40 rounded-xl object-cover flex-shrink-0 hover:scale-105 transition shadow-md"
        />
      ))}
    </div>
  )
}

export default BannerSlider
