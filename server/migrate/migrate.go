package main

import (
	"chat_upgrade/db"
	"chat_upgrade/model"
	"flag"
	"fmt"
	"log"

	"github.com/joho/godotenv"
)

func main() {
    // コマンドラインフラグからenvファイルのパスを取得（デフォルトは ".env"）
    envFilePath := flag.String("env", ".env", "Path to the .env file")
    flag.Parse()

    // envファイルの読み込み
    err := godotenv.Load(*envFilePath)
    if err != nil {
        log.Fatalf("Error loading .env file from path %s: %v",*envFilePath, err)
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