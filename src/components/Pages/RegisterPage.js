// import { useState } from 'react';

// const RegisterPage = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     first_name: '',
//     last_name: '',
//     phone_number: '',
//     password: '',
//     password_confirmation: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');
//     setSuccess('');

//     if (formData.password !== formData.password_confirmation) {
//       setError('Passwords do not match');
//       setLoading(false);
//       return;
//     }

//     try {
//       const response = await fetch('https://apis.omeife.ai/api/v1/user/register', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
//       const data = await response.json();

//       if (!response.ok) throw new Error(data.message || 'Registration failed');

//       setSuccess('Account created successfully!');
//       setTimeout(() => window.location.href = '/login', 2000);
//     } catch (err) {
//       setError(err.message || 'An error occurred during registration');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="bg-white rounded-lg p-8 w-full max-w-md">
//         <h2 className="text-2xl font-bold mb-6">Create a New Account</h2>
//         {error && <div className="text-red-500 mb-4">{error}</div>}
//         {success && <div className="text-green-500 mb-4">{success}</div>}

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
//             type="text"
//             name="first_name"
//             value={formData.first_name}
//             onChange={handleChange}
//             placeholder="First Name"
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//           <input
//             type="text"
//             name="last_name"
//             value={formData.last_name}
//             onChange={handleChange}
//             placeholder="Last Name"
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//           <input
//             type="tel"
//             name="phone_number"
//             value={formData.phone_number}
//             onChange={handleChange}
//             placeholder="Phone Number"
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
//           <input
//             type="password"
//             name="password_confirmation"
//             value={formData.password_confirmation}
//             onChange={handleChange}
//             placeholder="Confirm Password"
//             className="w-full p-2 border border-gray-300 rounded"
//             required
//           />
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//           >
//             {loading ? 'Registering...' : 'Register'}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
