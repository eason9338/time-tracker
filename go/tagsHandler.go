package main 

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
	"github.com/labstack/echo/v4"
)

type Tag struct {
	TagName string `json:"tag_name"`
	TagID int `json:"tag_id"`
}

func AddTag(c echo.Context) error {
	var tag Tag
	if err := c.Bind(&tag); err != nil {
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

	query := "INSERT INTO Tags (tag_name) VALUES ?"
	_, err = db.Exec(query, tag.TagName)
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
	})
}

func GetTags(c echo.Context) error {
	user_id := c.Param("userId")

	db, err := sql.Open("mysql", "root:Aa32133246@/users?parseTime=true")
	if err != nil {
		log.Printf("資料庫連接失敗：%v", err)
		return err
	}
	defer db.Close();

	var tags []Tag
	query := "SELECT tag_name, tag_id FROM Tags WHERE user_id = ?"
	rows, err := db.Query(query, user_id)
	if err != nil {
		log.Printf("標籤搜尋失敗：%v", err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "標籤搜尋失敗",
		})	
	}
	defer db.Close()

	for rows.Next(){
		var tag Tag
		if err := rows.Scan(&tag.TagName, &tag.TagID); err != nil {
			log.Printf("標籤掃描失敗：%v", err)
			return c.JSON(http.StatusInternalServerError, map[string]interface{}{
				"success": false,
				"message": "標籤掃描失敗",
			})	
		}
		tags = append(tags, tag)
	}

	if err := rows.Err(); err != nil {
		log.Printf("標籤走訪時發生錯誤：%v", err)
		return c.JSON(http.StatusInternalServerError, map[string]interface{}{
			"success": false,
			"message": "走訪標籤時發生錯誤",
		})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"success": true,
		"tags": tags,
	})
} 