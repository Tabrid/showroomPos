import { useRouter } from 'next/navigation';
import axios from "axios";
import { useContext, useState } from 'react';
import { AuthContext } from '../Components/context/AuthProvider';
import baseUrl from '../Components/services/baseUrl';

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useContext(AuthContext);
	const router = useRouter();

	const logout = async () => {
		setLoading(true);
		try {
			const response = await axios.post(`${baseUrl}/api/auth/logout`, {}, { withCredentials: true });

			if (response.data.error) {
				throw new Error(response.data.error);
			}

			// Clear local storage and reset auth context
			localStorage.removeItem("userId");
			setAuthUser(null);

		} catch (error) {
			console.error("Logout error:", error);
			// Optionally, handle error with a user-friendly message or toast
			// toast.error(error.message);
		} finally {
			setLoading(false);
			router.push('/login');
		}
	};

	return { loading, logout };
};

export default useLogout;
