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
	"time"

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
	s3Repository := repository.NewS3Repository(config.S3Bucket)

	// ユースケースの初期化
	userUsecase := usecase.NewUserUsecase(userRepository, userValidator, s3Repository)

	// コントローラーの初期化
	userController := controller.NewUserController(userUsecase)

	// ハブ関連の初期化
	hubRepository := repository.NewInMemoryHubRepo()
	hubUsecase := usecase.NewHubUsecase(hubRepository, config)
	hubController := controller.NewHubController(hubUsecase)

	// ファイル関連のコントローラー初期化
	fileController := controller.NewFileController(hubUsecase)

	// ルーム関連の初期化
	roomRepository := repository.NewRoomRepository(db) // db を渡す
	roomUsecase := usecase.NewRoomUsecase(roomRepository)
	roomController := controller.NewRoomController(roomUsecase)

	// ルーターの設定
	e := router.NewRouter(userController, hubController, fileController, roomController)

	// サーバーの起動
	e.Logger.Fatal(e.Start(":8080"))

	// 定期実行タスクの開始
	scheduleRoomCleanup(roomUsecase)
}

func scheduleRoomCleanup(rc usecase.IRoomUsecase) {
	ticker := time.NewTicker(1 * time.Hour) // 1時間ごとに実行
	go func() {
		for range ticker.C {
			err := rc.DeleteOldRooms()
			if err != nil {
				log.Printf("古い部屋の削除に失敗しました: %v\n", err)
			} else {
				log.Println("古い部屋を削除しました")
			}
		}
	}()
}
