package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func QueryUser(email string) (*User, error) {
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

	query := "SELECT user_email, user_password, user_name, ID FROM User WHERE user_email = ?"
	err = db.QueryRow(query, email).Scan(&user.Email, &user.Password, &user.Name, &user.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("no user found with email %s", email)
		}

		return nil, fmt.Errorf("查詢用戶失敗：%v", err)
	}

	return &user, nil
}

func QueryUserByID(userID int) (*User, error){
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
	query := "SELECT user_name, user_password, user_email, ID " +
	"FROM User " +
	"WHERE ID = ?"

	err = db.QueryRow(query, userID).Scan(&user.Name, &user.Password, &user.Email, &user.ID)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, fmt.Errorf("找不到此用戶，請重新登入")
		}

		return nil, fmt.Errorf("查詢用戶失敗：%v", err)
	}

	return &user, nil
}