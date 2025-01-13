// main.go
package main

import (
	"chat_upgrade/controller"
	"chat_upgrade/db"
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
	// 環境変数の読み込み
	if err := godotenv.Load(); err != nil {
		log.Fatalln(err)
	}

	// AWSの設定
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

	// データベース接続
	dbConnection := db.NewDB()
	defer db.CloseDB(dbConnection)

	// リポジトリとユースケースの初期化
	hubRepository := repository.NewInMemoryHubRepo()
	hubUsecase := usecase.NewHubUsecase(hubRepository, config)
	hubController := controller.NewHubController(hubUsecase)
	fileController := controller.NewFileController(hubUsecase)

	userRepository := repository.NewUserRepository(dbConnection)
	userUsecase := usecase.NewUserUsecase(userRepository)
	userController := controller.NewUserController(userUsecase)

	// ルーターの設定
	e := router.NewRouter(hubController, fileController, userController)

	// ミドルウェアの設定
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{echo.GET, echo.POST, echo.OPTIONS},
		AllowHeaders:     []string{echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept},
		ExposeHeaders:    []string{"Set-Cookie"},
		AllowCredentials: true,
	}))
	e.Use(middleware.BodyLimit("10M")) // 必要に応じてサイズを調整

	// サーバーの起動
	e.Logger.Fatal(e.Start(":8080"))
}
