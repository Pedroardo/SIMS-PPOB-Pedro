const ServiceCard = ({ service, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition group"
    >
      <div className="w-16 h-16 bg-white rounded-lg shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-110 transition">
        <img 
          src={service.service_icon} 
          alt={service.service_name}
          className="w-10 h-10 object-contain"
        />
      </div>
      <p className="text-xs text-center text-gray-700 font-medium line-clamp-2">
        {service.service_name}
      </p>
    </div>
  )
}

export default ServiceCard
