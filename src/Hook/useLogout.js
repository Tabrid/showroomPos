import axios from "axios";
import { useContext, useState } from 'react';
import { AuthContext } from '../Components/context/AuthProvider';
import baseUrl from '../Components/services/baseUrl';
import { useNavigate } from "react-router-dom";
const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useContext(AuthContext);
	const router = useNavigate();

	const logout = async () => {
		setLoading(true);
		try {
			const response = await axios.post(`${baseUrl}/api/auth/logout`, {}, { withCredentials: true });

			if (response.data.error) {
				throw new Error(response.data.error);
			}
			localStorage.removeItem("userId");
			setAuthUser(null);

		} catch (error) {
			console.error("Logout error:", error);
		} finally {
			setLoading(false);
			router.push('/login');
		}
	};

	return { loading, logout };
};

export default useLogout;
