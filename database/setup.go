package database

import (
	"database/sql"
	"log"
	"os"
	"runtime"
)

func SetupDatabase() error {
	db, err := sql.Open("mysql", "root@/time_tracker")
	if err != nil {
		logError(err)
		return err
	}
	defer db.Close()

	// 初始化數據表，以及相應的 SQL 腳本
	tables := []string{"Plans", "Pomodoros", "Records", "Tags", "User"}
	for _, table := range tables {
		if err := initTable(db, table); err != nil {
			logError(err)
			return err
		}
	}
	return nil
}

func initTable(db *sql.DB, tableName string) error {
	filePath := "../database_sql/users_" + tableName + ".sql"
	data, err := os.ReadFile(filePath)
	if err != nil {
		logError(err)
		return err
	}

	if _, err := db.Exec(string(data)); err != nil {
		logError(err)
		return err
	}
	return nil
}

func logError(err error) {
	_, file, line, ok := runtime.Caller(1)
	if ok {
		log.Printf("Error: %v occurred in %s at line %d", err, file, line)
	} else {
		log.Printf("Error: %v", err)
	}
}
