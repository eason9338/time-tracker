package main

import (
	"database/sql"
	"log"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
)

type Record struct {
	RecordName	string `json:"record_name"`
	StartTime 	string `json:"start_time"`
	EndTime		string `json:"end_time"`
	RecordDate	string `json:"record_date"`
	UserID		int	`json:"userID"`
}


func AddRecord(c echo.Context) error {

	var req Record
	if err := c.Bind(&req); err != nil {
		log.Fatal("資料傳輸有誤：", err)
		return err
	}

	db, err := sql.Open("mysql", "root:Aa32133246@/users")
	if err != nil {
		return err
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		log.Print("連接資料庫失敗：", err)
		return err
	}

	recordDate := time.Now().Format("2006-01-02")
	req.RecordDate = recordDate
	query := "INSERT INTO time_records (record_name, start_time, end_time, record_date,  userID) VALUES (?, ?, ?, ?, ?)"
	_, err = db.Exec(query, req.RecordName, req.StartTime, req.EndTime, recordDate, req.UserID)
	if err != nil {
		log.Printf("紀錄失敗：%v", err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "紀錄添加失敗",
		})
	}

	return c.JSON(http.StatusCreated, map[string]interface{}{
		"success": true,
		"message": "記錄已添加",
		"record": req,
	})
}

func GetRecords(c echo.Context) error {
	userId := c.Param("userId")

	db, err := sql.Open("mysql", "root:Aa32133246@/users?parseTime=true")
	if err != nil {
		log.Printf("資料庫連接失敗：%v", err)
		return err
	}
	defer db.Close()

	var records []Record

	rows, err := db.Query("SELECT record_name, start_time, end_time, record_date FROM Time_records WHERE userID = ?", userId)
	if err != nil {
		log.Printf("紀錄搜尋失敗：%v", err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "紀錄搜尋失敗",
		})	
	}
	defer db.Close()

	for rows.Next(){
		var record Record
		if err := rows.Scan(&record.RecordName, &record.StartTime, &record.EndTime, &record.RecordDate); err != nil {
			log.Printf("紀錄掃描失敗：%v", err)
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"success": false,
				"message": "紀錄掃描失敗",
			})		
		}
		records = append(records, record)
	}

	if err := rows.Err(); err != nil {
		log.Printf("紀錄走訪時發生錯誤：%v", err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "走訪記錄時發生錯誤",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"records": records,
	})
}
 

