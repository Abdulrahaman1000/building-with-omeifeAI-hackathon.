// import React, { useState } from 'react';

// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../../context/AuthContext';

// const LoginModal = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await fetch('https://apis.omeife.ai/api/v1/user/login', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       const result = await response.json();

//       // More granular error handling
//       if (!response.ok) {
//         switch (response.status) {
//           case 400:
//             setError('Invalid input. Please check your credentials.');
//             break;
//           case 401:
//             setError('Unauthorized. Incorrect email or password.');
//             break;
//           case 403:
//             setError('Access forbidden. Please contact support.');
//             break;
//           case 500:
//             setError('Server error. Please try again later.');
//             break;
//           default:
//             setError(result.message || 'Login failed');
//         }
//         return;
//       }

//       // Validate result structure
//       if (!result.data || !result.data.token) {
//         setError('Invalid server response');
//         return;
//       }

//       // Use context login method
//       login(result);

//       // Close modal and navigate to dashboard
//       onClose();
//       navigate('/dashboard');

//     } catch (err) {
//       console.error('Login error:', err);
//       setError('Network error. Please check your connection.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white p-8 rounded-lg w-full max-w-md">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold">Login</h2>
//           <button 
//             onClick={onClose} 
//             className="text-gray-500 hover:text-gray-700"
//           >
//             ✕
//           </button>
//         </div>

//         {error && (
//           <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Email"
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Password"
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;