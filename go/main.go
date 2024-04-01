package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))

	e.POST("/api/login", func(c echo.Context) error {
		type LoginRequest struct {
			Email string `json:"email"`
			Password string `json:"password"`
		}

		var req LoginRequest
		if err := c.Bind(&req); err != nil {
			return err
		}

		user, err := queryUser(req.Email)
		if err != nil {
			log.Printf("資料庫查詢錯誤：%v", err)
			return c.JSON(http.StatusNotFound, map[string]interface{}{"success": false, "message": "找不到用戶"})
		}
		if req.Password == user.Password {
			return c.JSON(http.StatusOK, map[string]interface{}{"success": true, "message": "登入成功", "user": user})
		}

		return c.JSON(http.StatusUnauthorized, map[string]interface{}{"success": false, "message": "密碼錯誤"})
	})

	e.Logger.Fatal(e.Start(":8000"))
}

func queryUser(email string) (*User, error) {
	db, err := sql.Open("mysql", "root:Aa32133246@/users")
	if err != nil {
		return nil, err
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Fatal("連接資料庫失敗：", err)
	} else {
		fmt.Println("成功連接到資料庫")
	}
	
	var user User

	query := "SELECT email, password FROM accounts WHERE email = ?"
	err = db.QueryRow(query, email).Scan(&user.Email, &user.Password)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no user found with email %s", email)
		}

		return nil, fmt.Errorf("查詢用戶失敗：%v", err)
	}

	return &user, nil
}

type User struct {
	Email 		string
	Password 	string
}