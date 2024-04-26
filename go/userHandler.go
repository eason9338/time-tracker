package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
)

type User struct {
	ID			int `json:"user_id"`
	Name		string `json:"user_name"`
	Email 		string `json:"user_email"`
	Password 	string `json:"user_password"`
}

func UserRegister(c echo.Context) error {
	var req User
	if err := c.Bind(&req); err != nil {
		return err
	}

	err := registerUser(req)
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]interface{}{
			"success": false, "message": "註冊失敗",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true, "message": "註冊成功",
	})
}

func UserLogin(c echo.Context) error {
	type LoginRequest struct {
		Email string `json:"email"`
		Password string `json:"password"`
	}

	var req LoginRequest
	if err := c.Bind(&req); err != nil {
		return err
	}

	user, err := QueryUser(req.Email)
	if err != nil {
		log.Printf("資料庫查詢錯誤：%v", err)
		return c.JSON(http.StatusNotFound, map[string]interface{}{"success": false, "message": "找不到用戶"})
	}
	if req.Password == user.Password {
		token, err := GenerateToken(*user)
		if err != nil {
			log.Printf("憑證生成錯誤：%v", err)
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{"success": false, "message": "憑證生成錯誤"})
		}
		return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "登入成功", "user": *user, "token": token})
	}

	return c.JSON(http.StatusUnauthorized, map[string]interface{}{"success": false, "message": "密碼錯誤"})
}

func registerUser(user User) error {
	db, err := sql.Open("mysql", "root:Aa32133246@/users")
	if err != nil {
		return fmt.Errorf("資料庫連線失敗 %v", err)
	}
	defer db.Close()

	var userCount int
	err = db.QueryRow("SELECT COUNT(*) FROM User WHERE user_email = ? ", user.Email).Scan(&userCount)
	if err != nil {
		return fmt.Errorf("資料庫搜尋失敗 %v", err)
	}
	if userCount > 0 {
		return fmt.Errorf("此用戶已被註冊")
	}

	_, err = db.Exec("INSERT INTO User (user_name, user_email, user_password) VALUES (?, ?, ?)", user.Name, user.Email, user.Password)
	if err != nil {
		return fmt.Errorf("寫入用戶資料失敗 %v", err)
	}

	return nil
}


