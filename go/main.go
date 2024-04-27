package main

import (
	"log"

	"time-tracker/database"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	e := echo.New()

	if err := database.SetupDatabase(); err != nil {
		log.Fatal(err)
	}

	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{echo.GET, echo.PUT, echo.POST, echo.DELETE},
	}))

	e.POST("/api/register", UserRegister)

	e.POST("/api/login", UserLogin)

	e.POST("/api/records/add", AddRecord)

	e.POST("/api/tags/add", AddTag)

	e.GET("/api/records/:userId", GetRecords)

	e.GET("/api/tags/:userId", GetTags)

	e.GET("/api/auto-login", AutoLogin)

	e.DELETE("/api/tags/:tag_id", DeleteTag)

	e.DELETE("/api/records/:record_id", DeleteRecord)

	e.Logger.Fatal(e.Start(":8000"))
}


