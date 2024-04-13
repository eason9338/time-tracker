import { useState } from "react";
import { useUser } from './UserContext';
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [notice, setNotice] = useState(false);
	const { user, setUser } = useUser();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const input = {
				email,
				password,
			};
			const response = await fetch("http://localhost:8000/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});

			const data = await response.json();
			if (data.success) {
				console.log("登入成功");
				setUser(data.user);
				localStorage.setItem("token", data.token);
				navigate("/");
			} else {
				console.error("登入失敗", data.message);
				setNotice(true);
			}
		} catch (error) {
			console.error("登入過程中發生錯誤：", error);
			setNotice(true);
		}
	};

	

	return (
			<div className="form">
				<h2>Login</h2>
				<p className={notice ? 'notice': 'hide'}>Login failed, please try again</p>
				<form onSubmit={handleSubmit}>
					<label>Email</label>
					<input
						type="text"
						required
						value={email}
						onChange={(e) => setEmail(e.target.value)}
					></input>
					<label>Password</label>
					<input
						type="password"
						required
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					></input>
					<button className="link-login" disabled={!(email && password)}>Log in</button>
				</form>
				<br />
				<span className="link-signup">
					Not having an account yet?
					<Link to="../sign-up">Sign Up</Link>
				</span>
			</div>
	);
};

export default Login;
