import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register, clearError } from "../redux/slices/authSlice";
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = "Email harus diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.first_name) errors.first_name = "Nama depan harus diisi";
    if (!formData.last_name) errors.last_name = "Nama belakang harus diisi";

    if (!formData.password) {
      errors.password = "Password harus diisi";
    } else if (formData.password.length < 8) {
      errors.password = "Password minimal 8 karakter";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Konfirmasi password harus diisi";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Password tidak cocok";
    }

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (formErrors[name]) setFormErrors({ ...formErrors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const { confirmPassword, ...registerData } = formData;
    const result = await dispatch(register(registerData));

    if (register.fulfilled.match(result)) {
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-4">
      <div className="grid md:grid-cols-2 gap-16 max-w-screen-xl items-center">
        <div className="bg-white ">
          <div className="mb-6 text-center">
            <div className="flex gap-2 items-center justify-center mb-14">
              <img src="/assets/Logo.png" alt="" />
              <h1 className="text-xl font-bold">SIMS PPOB</h1>
            </div>
            <h2 className=" md:text-xl font-semibold leading-tight">
              Lengkapi data untuk membuat akun
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <FiCheckCircle />
                <span className="text-sm">
                  Registrasi berhasil! Mengalihkan...
                </span>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <FiAlertCircle />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  placeholder="masukkan email anda"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              {formErrors.email && (
                <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="first_name"
                  placeholder="nama depan"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.first_name ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.first_name}
                  onChange={handleChange}
                />
              </div>
              {formErrors.first_name && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.first_name}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="last_name"
                  placeholder="nama belakang"
                  className={`w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.last_name ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.last_name}
                  onChange={handleChange}
                />
              </div>
              {formErrors.last_name && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.last_name}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="buat password"
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formErrors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.password}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="konfirmasi password"
                  className={`w-full pl-12 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${
                    formErrors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {formErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-500">
                  {formErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-medium py-3 rounded-lg transition disabled:opacity-50"
              disabled={loading || success}
            >
              {loading ? "Memproses..." : success ? "Berhasil!" : "Registrasi"}
            </button>

            <p className="text-center text-gray-600 text-sm">
              Sudah punya akun?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-primary-dark font-semibold"
              >
                Masuk di sini
              </Link>
            </p>
          </form>
        </div>
        <div className="">
          <img src="/assets/Illustrasi Login.png" alt="" className="w-full" />
        </div>
      </div>
    </div>
  );
};

export default Register;
