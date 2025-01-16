package main

import (
	"chat_upgrade/controller"
	"chat_upgrade/db"
	"chat_upgrade/model"
	"chat_upgrade/repository"
	"chat_upgrade/router"
	"chat_upgrade/usecase"
	"chat_upgrade/validator"
	"log"
	"os"

	"github.com/joho/godotenv"
)

func main() {
	// ✅ .env ファイルの読み込み
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	// ✅ AWS 設定の読み込み
	config := model.Config{
		AWSAccessKeyID:     os.Getenv("AWS_ACCESS_KEY_ID"),
		AWSSecretAccessKey: os.Getenv("AWS_SECRET_ACCESS_KEY"),
		AWSRegion:          os.Getenv("AWS_REGION"),
		S3Bucket:           os.Getenv("S3_BUCKET"),
	}

	// ✅ 設定の確認用ログ
	log.Println("AWS の設定:")
	log.Printf("AWSAccessKeyID: %s", config.AWSAccessKeyID)
	log.Printf("AWSRegion: %s", config.AWSRegion)
	log.Printf("S3Bucket: %s", config.S3Bucket)

	// データベースの初期化
	db := db.NewDB()

	// バリデーターの初期化
	userValidator := validator.NewUserValidator()

	// リポジトリの初期化
	userRepository := repository.NewUserRepository(db)

	// ユースケースの初期化
	userUsecase := usecase.NewUserUsecase(userRepository, userValidator)

	// コントローラーの初期化
	userController := controller.NewUserController(userUsecase)

	// ルーターの設定
	e := router.NewRouter(userController)

	// サーバーの起動
	e.Logger.Fatal(e.Start(":8080"))
}
