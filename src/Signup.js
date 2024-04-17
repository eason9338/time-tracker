import { useState, useEffect } from "react";
import "./style/content.css";
import { useNavigate, Link } from "react-router-dom";

const USER_REGEX = /^[a-zA-Z0-9]{3,10}$/;
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{4,10}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Signup = () => {
	const [name, setName] = useState("");
	const [isValidName, setIsValidName] = useState(false);

	const [email, setEmail] = useState("");
	const [isValidEmail, setIsValidEmail] = useState(false);

	const [pw, setPw] = useState("");
	const [isValidPw, setIsValidPw] = useState(false);
	const [success, setSuccess] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();

		const t1 = USER_REGEX.test(name);
		const t2 = PW_REGEX.test(pw);
		const t3 = EMAIL_REGEX.test(email);

		if (!t1 || !t2 || !t3) {
			console.log("entry error");
			return;
		} else {
			try {
				const userData = {
					name,
					email,
					password: pw,
				};

				const result = await fetch("http://localhost:8000/api/register", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(userData),
				})
					.then((response) => response.json())
					.then((data) => {
						if (data.success) {
							console.log("註冊成功", data);
							setSuccess(true);
						}
					});
			} catch (err) {
				console.error(err);
			}
		}
	};

	useEffect(() => {
		const result = USER_REGEX.test(name);
		setIsValidName(result);
	}, [name]);

	useEffect(() => {
		const result = PW_REGEX.test(pw);
		setIsValidPw(result);
	}, [pw]);

	useEffect(() => {
		const result = EMAIL_REGEX.test(email);
		setIsValidEmail(result);
	}, [email]);

	return (
		<>
			{success ? (
				<div>
					<h1>Sign up successfully</h1>
					<p>
						<Link to="../log-in">Log in</Link>
					</p>
				</div>
			) : (
				<div className="form">
					<h2>Sign Up</h2>
					<form onSubmit={handleSubmit}>
						<label>Name</label>
						<input
							type="text"
							required
							value={name}
							aria-describedby="nameSyntax"
							onChange={(e) => setName(e.target.value)}
						></input>
						<p
							id="nameSyntax"
							className={!isValidName && name ? "instructions" : "hide"}
						>
							User name can only contain 3 ~ 10 English character and number.
						</p>
						<label>Email</label>
						<input
							className="timer"
							type="text"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							autoComplete='false'
						></input>
						<p className={isValidEmail || !email ? "hide" : "instructions"}>
							Please enter a valid email
						</p>
						<label>Password</label>
						<input
							className="timer"
							type="password"
							required
							value={pw}
							aria-describedby="pwSyntax"
							onChange={(e) => setPw(e.target.value)}
							autoComplete='false'
						></input>
						<p
							id="pwSyntax"
							className={isValidPw || !pw ? "hide" : "instructions"}
						>
							Password has to contain at least one uppercase letter, one
							lowercase letter, and at one number. Length of the password has to
							be 4 ~ 10
						</p>
						<button disabled={!(isValidName && isValidEmail && isValidPw)}>
							Sign Up
						</button>
					</form>
				</div>
			)}
		</>
	);
};

export default Signup;
