import { useSelector } from "react-redux";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useState } from "react";

const BalanceCard = ({ profile }) => {
  const { balance } = useSelector((state) => state.balance);
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="grid md:grid-cols-2 gap-6 mb-12">
      {/* Profile Section */}
      <div>
        <img
          src="/assets/Profile Photo.png"
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg mb-4"
        />
        <p className="text-gray-600 text-lg">Selamat datang,</p>
        <h2 className="text-3xl font-bold text-gray-800">
          {profile?.first_name} {profile?.last_name}
        </h2>
      </div>

      {/* Balance Section */}
      <div className="bg-gradient-to-r from-primary to-red-600 rounded-2xl p-6 text-white shadow-xl">
        <p className="text-sm opacity-90 mb-2">Saldo anda</p>
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-bold">
            {showBalance
              ? `Rp ${balance.toLocaleString("id-ID")}`
              : "Rp •••••••"}
          </h1>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-white hover:text-gray-200 transition text-xl"
          >
            {showBalance ? <FiEye /> : <FiEyeOff />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
