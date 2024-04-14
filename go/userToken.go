package main

import (
	"net/http"
	"strings"
	"time"

	"github.com/dgrijalva/jwt-go"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
)

var jwtKey = []byte("1234")

type Claims struct {
	ID int `json:"ID"`
	jwt.StandardClaims
}

func GenerateToken(user User) (string, error) {
	expiration := time.Now().Add(24 * time.Hour)
	claims := &Claims {
		ID: user.ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expiration.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	return tokenString, err
}

func AutoLogin(c echo.Context) error {
	userToken := c.Request().Header.Get("Authorization")
	if userToken == "" {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"success": false, "message": "授權失敗，Token無效",
		})
	}

	tokenString := strings.TrimPrefix(userToken, "Bearer ")

	claims := &Claims{}

	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return jwtKey, nil
	})
	if err != nil || !token.Valid {
		return c.JSON(http.StatusUnauthorized, map[string]interface{}{
			"success": false, "message": "無效的Token",
		})
	}

	user, err := QueryUserByID(claims.ID)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]interface{} {
			"success": false, "message": "查詢用戶失敗",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{} {
		"success": true, "message": "自動登入成功", "user": *user,
	})
} 