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
	Duration	string `json:"duration"`
	RecordDate	string `json:"record_date"`
	UserID		int	`json:"user_id"`
	TagID		int `json:"tag_id"`
	TagName		string `json:"tag_name"`
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
	query := "INSERT INTO Records (record_name, start_time, end_time, record_date, user_id, duration, tag_id) VALUES (?, ?, ?, ?, ?, ?, ?)"
	_, err = db.Exec(query, req.RecordName, req.StartTime, req.EndTime, recordDate, req.UserID, req.Duration, req.TagID)
	if err != nil {
		log.Printf("紀錄失敗：%v", req.TagID)
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
	user_id := c.Param("userId")

	db, err := sql.Open("mysql", "root:Aa32133246@/users?parseTime=true")
	if err != nil {
		log.Printf("資料庫連接失敗：%v", err)
		return err
	}
	defer db.Close()

	var records []Record

	rows, err := db.Query("SELECT record_name, start_time, end_time, record_date, duration, tag_id FROM Records WHERE user_id = ?", user_id)
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
		if err := rows.Scan(&record.RecordName, &record.StartTime, &record.EndTime, &record.RecordDate, &record.Duration, &record.TagID); err != nil {
			log.Printf("紀錄掃描失敗：%v", err)
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"success": false,
				"message": "紀錄掃描失敗",
			})		
		}
		record.TagName, err = GetRecordTag(record.TagID)
		if err != nil {
			log.Printf("透過標籤ID查詢時發生錯誤：%v", err)
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"success": false,
				"message": "標籤ID不存在",
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

func GetRecordTag(tag_id int) (string, error) {
	db, err := sql.Open("mysql", "root:Aa32133246@/users")
	if err != nil {
		log.Printf("資料庫連接失敗：%v", err)
		return "", err
	}
	defer db.Close()

	var tag_name string

	query := "SELECT tag_name FROM tags WHERE tag_id = ?"
	rows := db.QueryRow(query, tag_id);
	if err := rows.Scan(&tag_name) ; err != nil {
		return "", err
	} 
	defer db.Close()

	return tag_name, nil
}
 

