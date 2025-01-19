package controller

import (
	"chat_upgrade/usecase"
	"fmt"
	"net/http"

	"github.com/labstack/echo/v4"
)

type IRoomController interface {
	RegisterRoom(c echo.Context) error
	GetAllRooms(c echo.Context) error
	DeleteOldRooms(c echo.Context) error
}

type roomController struct {
	ru usecase.IRoomUsecase
}

// 新しい roomController を生成
func NewRoomController(ru usecase.IRoomUsecase) IRoomController {
	return &roomController{ru: ru}
}

// 部屋登録エンドポイント
func (rc *roomController) RegisterRoom(c echo.Context) error {
	// フォームデータを取得
	roomName := c.FormValue("roomName")
	password := c.FormValue("password")
	description := c.FormValue("description")
	latitudeStr := c.FormValue("latitude")
	longitudeStr := c.FormValue("longitude")
	file, err := c.FormFile("file")

	// 必須項目の確認
	if roomName == "" || password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "roomName と password は必須です"})
	}

	// ファイルが存在しない場合の処理
	if err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "ファイルが提供されていません"})
	}

	// S3にファイルをアップロード
	roomIconURL, err := rc.ru.UploadRoomIcon(file)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("写真のアップロードに失敗しました: %v", err)})
	}

	// 部屋情報を登録
	room, err := rc.ru.RegisterRoom(roomName, roomIconURL, password, description, latitudeStr, longitudeStr)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("ルーム登録エラー: %v", err)})
	}

	// 登録成功レスポンス
	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "ルーム登録成功",
		"room":    room,
	})
}

// すべての部屋を取得するエンドポイント
func (rc *roomController) GetAllRooms(c echo.Context) error {
	rooms, err := rc.ru.GetAllRooms()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, rooms)
}

// 古い部屋を削除するエンドポイント
func (rc *roomController) DeleteOldRooms(c echo.Context) error {
	if err := rc.ru.DeleteOldRooms(); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": fmt.Sprintf("古い部屋の削除に失敗しました: %v", err)})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "古い部屋を削除しました"})
}
