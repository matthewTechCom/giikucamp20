package main

import (
	"chat_upgrade/db"
	"chat_upgrade/model"
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func main() {

	//envファイルの読み込み
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	// データベース接続
	dbConn := db.NewDB()

	// defer で順序指定
	defer fmt.Println("Successfully Migrated")
	defer db.CloseDB(dbConn)

	// マイグレーションの実行とエラーハンドリング
	if err := dbConn.AutoMigrate(&model.User{}, &model.Message{}, &model.Room{}); err != nil {
		log.Fatalf("Failed to run migrations: %v\n", err)
	}
}
