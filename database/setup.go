package database

import (
	"database/sql"
	"os"
)

func SetupDatabase() error {
    // 更新資料庫連接字串
    db, err := sql.Open("mysql", "root:Aa32133246@/users")
    if err != nil {
        return err
    }
    defer db.Close()

    // Plan資料表
    data, err := os.ReadFile("../database_sql/users_Plans.sql")
    if err != nil {
        return err
    }

    _, err = db.Exec(string(data))
    if err != nil {
        return err
    }

	// Pomodoros資料表
	data, err = os.ReadFile("../database_sql/users_Plans.sql")
    if err != nil {
        return err
    }

    _, err = db.Exec(string(data))
    if err != nil {
        return err
    }

	// Records資料表
	data, err = os.ReadFile("../database_sql/users_Plans.sql")
    if err != nil {
        return err
    }

    _, err = db.Exec(string(data))
    if err != nil {
        return err
    }

	// Tags資料表
	data, err = os.ReadFile("../database_sql/users_Plans.sql")
    if err != nil {
        return err
    }

    _, err = db.Exec(string(data))
    if err != nil {
        return err
    }

	// Users資料表
	data, err = os.ReadFile("../database_sql/users_Plans.sql")
    if err != nil {
        return err
    }

    _, err = db.Exec(string(data))
    if err != nil {
        return err
    }
    return nil
}