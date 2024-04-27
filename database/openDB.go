package database

import (
	"database/sql"
	"log"
)

func OpenDB() (*sql.DB, error) {
	db, err := sql.Open("mysql", "root:Aa32133246@/users")
	if err != nil {
		log.Printf("資料庫連接失敗：%v", err)
		return nil, err
	}
	return db, nil;
}