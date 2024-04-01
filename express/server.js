const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const app = express();
const port = 8000;

app.use(
	cors({
		origin: "http://localhost:3000",
	})
);

app.use(express.json());

const pool = mysql.createPool({
	host: "localhost",
	user: "root",
	password: "Aa32133246",
	database: "users",
});

app.post("/api/register", async (req, res) => {
	const { name, email, password } = req.body;
	const checkQuery = 'SELECT email, name FROM accounts WHERE email = ? OR name = ?';
	pool.query(
		checkQuery,
		[email, name],
		(err, results) => {
			if(err) {
				return res.status(500).json({success: false, message: '伺服器錯誤'});
			}
			if (results.length > 0) {
				const isNameDuplicated = results.some(element => element.name === name);

				let message = isNameDuplicated ? '此用戶名已被使用' : '此帳號已經註冊';

				return res.status(409).json({success: false, message: message});
			}else{
				pool.query("INSERT INTO accounts (name, email, password) VALUES (?, ?, ?)",
					[name, email, password],
					(err, results) => {
						if (err) {
							return res.status(500).json({ success: false, message: "註冊失敗" });
						}
						res.status(200).json({ success: true, message: "註冊成功" });
				})
			}
		}
	);
});

app.post("/api/login", async (req, res) => {
	const { email, password } = req.body;
	const query = 'SELECT * FROM accounts WHERE email = ?';
	pool.query(query, [email], (err, results) => {
		if(err) {
			return res.status(500).json({success: false, message: err.message});
		}

		if(results.length > 0) {
			const user = results[0];
			if(password === user.password){
				return res.status(200).json({success: true, message: '登入成功', user: results[0]});
			}else{
				return res.status(401).json({success: false, message: '密碼錯誤'});
			}
		}else{
			return res.status(404).json({success: false, message: '找不到用戶'});
		}
	});
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
