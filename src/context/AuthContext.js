import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// Helper function to validate token expiration
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('authToken');
    return storedToken && !isTokenExpired(storedToken) ? storedToken : null;
  });
  const [apiKey, setApiKey] = useState(localStorage.getItem('developerApiKey'));
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Clear invalid tokens on initial load
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken && isTokenExpired(storedToken)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('developerApiKey');
    }
  }, []);

  const refreshToken = useCallback(async () => {
    if (isRefreshing) return token; // Prevent multiple refresh attempts
    setIsRefreshing(true);

    try {
      const response = await fetch('https://apis.omeife.ai/api/v1/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Token refresh failed');
      }

      if (data.status === 'success' && data.data.token) {
        localStorage.setItem('authToken', data.data.token);
        setToken(data.data.token);
        return data.data.token;
      }

      throw new Error('Invalid token refresh response');
    } catch (error) {
      console.error('Token Refresh Error:', error);
      logout();
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [token, isRefreshing]);

  const login = useCallback(async (loginResponse) => {
    if (!loginResponse?.data?.token) {
      throw new Error('Invalid login response');
    }

    localStorage.setItem('authToken', loginResponse.data.token);
    setToken(loginResponse.data.token);

    if (loginResponse.data.user) {
      setUser({
        id: loginResponse.data.user.id,
        name: loginResponse.data.user.name,
        email: loginResponse.data.user.email
      });
    }

    // Generate API key immediately after login
    try {
      await generateApiKey();
    } catch (error) {
      console.error('Initial API key generation failed:', error);
      // Don't block login if API key generation fails
    }

    navigate('/dashboard');
  }, [navigate]);

  const generateApiKey = useCallback(async () => {
    if (!token) {
      throw new Error('Authentication token is missing');
    }

    try {
      const response = await fetch('https://apis.omeife.ai/api/v1/user/developer/generate-key', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      // Handle auth errors
      if (data.auth === 'auth-001') {
        // Attempt to refresh token and retry
        const newToken = await refreshToken();
        return generateApiKey(); // Recursive retry with new token
      }

      if (data.status !== 'success' || !data.data?.key) {
        throw new Error(data.message || 'Invalid API key response');
      }

      const newApiKey = data.data.key;
      localStorage.setItem('developerApiKey', newApiKey);
      setApiKey(newApiKey);
      return newApiKey;
    } catch (error) {
      console.error('API Key Generation Error:', error);
      throw error;
    }
  }, [token, refreshToken]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('developerApiKey');
    setToken(null);
    setUser(null);
    setApiKey(null);
    navigate('/');
  }, [navigate]);

  // Add automatic token refresh before expiration
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      if (isTokenExpired(token)) {
        refreshToken().catch(() => logout());
      }
    };

    // Check every 5 minutes
    const interval = setInterval(checkTokenExpiration, 300000);
    return () => clearInterval(interval);
  }, [token, refreshToken, logout]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      apiKey,
      login, 
      logout,
      generateApiKey,
      refreshToken,
      isAuthenticated: !!token && !isTokenExpired(token),
      isRefreshing
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}