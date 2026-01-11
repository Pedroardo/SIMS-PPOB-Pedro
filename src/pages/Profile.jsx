import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getProfile,
  updateProfile,
  updateProfileImage,
  clearUpdateSuccess,
} from "../redux/slices/profileSlice";
import { logout } from "../redux/slices/authSlice";
import Navbar from "../components/Navbar";
import {
  FiEdit2,
  FiUser,
  FiMail,
  FiLogOut,
  FiCheckCircle,
  FiCamera,
  FiAlertCircle,
} from "react-icons/fi";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const {
    data: profile,
    loading,
    error,
    updateSuccess,
  } = useSelector((state) => state.profile);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
  });
  const [imageError, setImageError] = useState("");

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        first_name: profile.first_name,
        last_name: profile.last_name,
      });
    }
  }, [profile]);

  useEffect(() => {
    if (updateSuccess) {
      setIsEditing(false);
      setTimeout(() => {
        dispatch(clearUpdateSuccess());
      }, 3000);
    }
  }, [updateSuccess, dispatch]);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 100kb)
    if (file.size > 100 * 1024) {
      setImageError("Ukuran file maksimal 100kb");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setImageError("File harus berupa gambar");
      return;
    }

    setImageError("");
    await dispatch(updateProfileImage(file));
    await dispatch(getProfile());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updateProfile(formData));
    await dispatch(getProfile());
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <img
              src="/assets/Profile Photo.png"
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
            />
            {isEditing && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition border border-gray-200"
              >
                <FiCamera className="text-gray-600" />
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {imageError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg inline-flex items-center gap-2 text-sm mb-4">
              <FiAlertCircle />
              <span>{imageError}</span>
            </div>
          )}

          <h2 className="text-3xl font-bold text-gray-800">
            {profile.first_name} {profile.last_name}
          </h2>
        </div>

        {updateSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6 animate-slideDown">
            <FiCheckCircle />
            <span>Profile berhasil diperbarui!</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 mb-6">
            <FiAlertCircle />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={profile.email}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                disabled
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Depan
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={(e) =>
                  setFormData({ ...formData, first_name: e.target.value })
                }
                className={`w-full pl-12 pr-4 py-3 border rounded-lg ${
                  isEditing
                    ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    : "border-gray-300 bg-gray-50"
                }`}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Belakang
            </label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={(e) =>
                  setFormData({ ...formData, last_name: e.target.value })
                }
                className={`w-full pl-12 pr-4 py-3 border rounded-lg ${
                  isEditing
                    ? "border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    : "border-gray-300 bg-gray-50"
                }`}
                disabled={!isEditing}
              />
            </div>
          </div>

          {!isEditing ? (
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiEdit2 />
                <span>Edit Profile</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
              >
                <FiLogOut />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                  });
                }}
                className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium py-3 rounded-lg transition"
              >
                Batalkan
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
