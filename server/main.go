// main.go
package main

import (
	"chat_upgrade/controller"
	"chat_upgrade/model"
	"chat_upgrade/repository"
	"chat_upgrade/router"
	"chat_upgrade/usecase"
	"os"

	"log"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalln(err)
	}

	config := model.Config{
		AWSAccessKeyID:     os.Getenv("AWS_ACCESS_KEY_ID"),
		AWSSecretAccessKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
		AWSRegion:          os.Getenv("AWS_REGION"),
		S3Bucket:           os.Getenv("S3_BUCKET"),
	}

	// 設定の確認用ログ
	log.Printf("AWSAccessKeyID: %s", config.AWSAccessKeyID)
	log.Printf("AWSSecretAccessKey: %s", config.AWSSecretAccessKey)
	log.Printf("AWSRegion: %s", config.AWSRegion)
	log.Printf("S3Bucket: %s", config.S3Bucket)

	hubRepository := repository.NewInMemoryHubRepo()
	hubUsecase := usecase.NewHubUsecase(hubRepository, config)
	hubController := controller.NewHubController(hubUsecase)
	fileController := controller.NewFileController(hubUsecase)
	e := router.NewRouter(hubController, fileController)
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:5173"}, // フロントエンドのURLに置き換える
		AllowMethods: []string{echo.GET, echo.POST, echo.PUT, echo.DELETE, echo.OPTIONS},
	}))
	e.Use(middleware.BodyLimit("10M")) // 必要に応じてサイズを調整
	e.Logger.Fatal(e.Start(":8080"))
}
