import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTransactionHistory,
  resetHistory,
} from "../redux/slices/transactionSlice";
import { getProfile } from "../redux/slices/profileSlice";
import { getBalance } from "../redux/slices/balanceSlice";
import Navbar from "../components/Navbar";
import BalanceCard from "../components/BalanceCard";
import { FiPlus, FiMinus } from "react-icons/fi";

const Transaction = () => {
  const dispatch = useDispatch();
  const { data: profile } = useSelector((state) => state.profile);
  const { history, loading, hasMore, offset } = useSelector(
    (state) => state.transaction
  );

  useEffect(() => {
    dispatch(getProfile());
    dispatch(getBalance());
    dispatch(resetHistory());
    dispatch(getTransactionHistory({ offset: 0, limit: 5 }));
  }, [dispatch]);

  const loadMore = () => {
    dispatch(getTransactionHistory({ offset, limit: 5 }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <BalanceCard profile={profile} />

        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Semua Transaksi
          </h2>

          <div className="space-y-4">
            {history.length === 0 && !loading && (
              <p className="text-center text-gray-500 py-12">
                Belum ada transaksi
              </p>
            )}

            {history.map((trx, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 border border-gray-200 flex justify-between items-center"
              >
                <div>
                  <div
                    className={`flex items-center gap-2 mb-1 ${
                      trx.transaction_type === "TOPUP"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {trx.transaction_type === "TOPUP" ? (
                      <>
                        <FiPlus /> <span className="font-semibold"></span>
                      </>
                    ) : (
                      <>
                        <FiMinus /> <span className="font-semibold"></span>
                      </>
                    )}
                    <span className="font-bold text-xl">
                      Rp {trx.total_amount.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {formatDate(trx.created_on)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {trx.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {hasMore && !loading && (
            <button
              onClick={loadMore}
              className="w-full mt-6 text-primary hover:text-primary-dark font-semibold py-3 transition"
            >
              Show more
            </button>
          )}

          {loading && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Transaction;
