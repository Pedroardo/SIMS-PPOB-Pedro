import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  topUp,
  clearTopUpSuccess,
  getBalance,
} from "../redux/slices/balanceSlice";
import { getProfile } from "../redux/slices/profileSlice";
import Navbar from "../components/Navbar";
import BalanceCard from "../components/BalanceCard";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

const TopUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: profile } = useSelector((state) => state.profile);
  const { loading, error, topUpSuccess } = useSelector(
    (state) => state.balance
  );

  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
  }, [dispatch]);

  useEffect(() => {
    if (topUpSuccess) {
      setModalType("success");
      setShowModal(true);
      dispatch(clearTopUpSuccess());
      setAmount("");
    }
  }, [topUpSuccess, dispatch]);

  useEffect(() => {
    if (error) {
      setModalType("error");
      setShowModal(true);
    }
  }, [error]);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setAmount(value);
  };

  const isValidAmount = () => {
    const numAmount = parseInt(amount);
    return numAmount >= 10000 && numAmount <= 1000000;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValidAmount()) {
      setModalType("confirm");
      setShowModal(true);
    }
  };

  const handleConfirmTopUp = async () => {
    setShowModal(false);
    await dispatch(topUp(parseInt(amount)));
    await dispatch(getBalance());
  };

  const closeModal = () => {
    setShowModal(false);
    if (modalType === "success") {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <BalanceCard profile={profile} />

        <div className="max-w-2xl mx-auto">
          <p className="text-gray-600 mb-2">Silahkan masukan</p>
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Nominal Top Up
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="masukan nominal Top Up"
                    className="w-full px-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-lg"
                    value={
                      amount
                        ? `Rp ${parseInt(amount).toLocaleString("id-ID")}`
                        : ""
                    }
                    onChange={handleAmountChange}
                  />
                  {amount && !isValidAmount() && (
                    <p className="mt-2 text-sm text-red-500">
                      Nominal minimal Rp 10.000 dan maksimal Rp 1.000.000
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
                  disabled={!isValidAmount() || loading}
                >
                  Top Up
                </button>
              </form>
            </div>

            <div>
              <div className="grid grid-cols-3 gap-3">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    className="border border-gray-300 hover:border-primary text-gray-700 font-medium py-3 rounded-lg transition text-sm"
                    onClick={() => setAmount(value.toString())}
                  >
                    Rp {value / 1000}rb
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full text-center animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {modalType === "confirm" && (
              <>
                <div className=" mb-4 justify-center flex">
                  <img src="/assets/Logo.png" alt="" className="w-20" />
                </div>
                <p className="text-gray-600 mb-2">
                  Anda yakin untuk Top Up sebesar
                </p>
                <h3 className="text-3xl font-bold text-gray-800 mb-6">
                  Rp {parseInt(amount).toLocaleString("id-ID")} ?
                </h3>
                <div className="space-y-3">
                  <button
                    className="w-full  text-primary font-medium py-3 rounded-lg transition"
                    onClick={handleConfirmTopUp}
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Ya, lanjutkan Top Up"}
                  </button>
                  <button
                    className="w-full text-gray-500 font-medium py-3"
                    onClick={closeModal}
                  >
                    Batalkan
                  </button>
                </div>
              </>
            )}

            {modalType === "success" && (
              <>
                <div className="text-green-500 text-6xl mb-4">
                  <FiCheckCircle className="mx-auto" />
                </div>
                <p className="text-gray-600 mb-2">Top Up sebesar</p>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">
                  Rp {parseInt(amount).toLocaleString("id-ID")}
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

            {modalType === "error" && (
              <>
                <div className="text-red-500 text-6xl mb-4">
                  <FiXCircle className="mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Top Up Gagal
                </h3>
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
  );
};

export default TopUp;
