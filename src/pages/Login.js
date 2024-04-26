import { useState } from "react";
import { useUser } from '../context/UserContext';
import { useNavigate, Link } from "react-router-dom";
import { Button } from '../components/Button';
import { login } from '../api/login'

const Login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [notice, setNotice] = useState(false);
	const { user, setUser } = useUser();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const input = {
			email,
			password,
		}
		try {
			const data = await login(input);
			if(data.success) {
				console.log("登入成功");
				setUser(data.user);
				localStorage.setItem("token", data.token);
				navigate('/');
			} else {
				console.error("登入失敗", data.message);
			}
			
		} catch(error) {
			console.error("登入過程發生錯誤", error);
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
					<Button className="link-login" disabled={!(email && password)}>Log in</Button>
					{/* <button className="link-login" disabled={!(email && password)}>Log in</button> */}
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
