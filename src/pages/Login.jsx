import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TerminalSquare } from 'lucide-react';
import { useAuthContext } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { useLogger } from '../hooks/useLogger';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card, { CardContent } from '../components/common/Card';

export const Login = () => {
  const { login, isAuthenticated } = useAuthContext();
  const { success, error: toastError } = useToast();
  const { logInfo, logSubmit, logClick } = useLogger('LoginPage');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    logInfo('Login page rendered');
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate, logInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear validation error when editing field
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    logSubmit('Login Auth Form', { email: formData.email });

    if (!validate()) {
      toastError('Please correct the validation errors');
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      success('Logged in successfully! Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      toastError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200 select-none">
      <Link 
        to="/" 
        onClick={() => logClick('Brand logo link (from Login)')}
        className="flex items-center gap-2 mb-8 focus:outline-none"
      >
        <div className="h-10 w-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-650/20">
          <TerminalSquare size={22} />
        </div>
        <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">PulseDev</span>
      </Link>

      <Card className="w-full max-w-md border border-slate-200 dark:border-slate-800 shadow-xl overflow-visible">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sign in to your account</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5">
              Enter your mock credentials to access server logs
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="alex@pulsedev.io"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
              required
              autoComplete="email"
            />

            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={formErrors.password}
              required
              autoComplete="current-password"
            />

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-400 select-none">Mock sandbox environment</span>
              <span className="text-indigo-500 font-semibold select-all">Default pass: min 6 chars</span>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              fullWidth
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link
              to="/register"
              onClick={() => logClick('Switch to Signup link')}
              className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Create free account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
