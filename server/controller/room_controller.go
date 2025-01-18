package controller

import (
	"chat_upgrade/usecase"
	"net/http"

	"github.com/labstack/echo/v4"
)

// 部屋登録のエンドポイントを管理するためのインターフェース
type IRoomController interface {
	RegisterRoom(c echo.Context) error
	GetRoomByName(c echo.Context) error
	GetAllRooms(c echo.Context) error
}

type roomController struct {
	ru usecase.IRoomUsecase
}

// 新しい roomController のインスタンスを生成
func NewRoomController(ru usecase.IRoomUsecase) IRoomController {
	return &roomController{
		ru: ru,
	}
}

// すべての部屋データを取得するハンドラ
func (rc *roomController) GetAllRooms(c echo.Context) error {
	rooms, err := rc.ru.GetAllRooms()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{
			"error": err.Error(),
		})
	}
	return c.JSON(http.StatusOK, rooms)
}

// フォームから送信された部屋登録情報を元に部屋を登録するエンドポイント
func (rc *roomController) RegisterRoom(c echo.Context) error {
	// フォーム値の取得
	roomName := c.FormValue("roomName")
	password := c.FormValue("password")
	description := c.FormValue("description")
	latitudeStr := c.FormValue("latitude")
	longitudeStr := c.FormValue("longitude")

	// 必須項目チェック
	if roomName == "" || password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "roomName と password は必須です"})
	}

	room, err := rc.ru.RegisterRoom(roomName, password, description, latitudeStr, longitudeStr)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "ルーム登録エラー: " + err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"message": "ルーム登録成功",
		"room":    room,
	})
}

// 部屋名で部屋情報を取得するエンドポイント
func (rc *roomController) GetRoomByName(c echo.Context) error {
	roomName := c.Param("roomName")

	if roomName == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "roomName は必須です"})
	}

	room, err := rc.ru.GetRoomByName(roomName)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "ルームが見つかりません: " + err.Error()})
	}

	return c.JSON(http.StatusOK, map[string]interface{}{
		"room": room,
	})
}

// 古い部屋を削除するエンドポイント
func (rc *roomController) DeleteOldRooms(c echo.Context) error {
	if err := rc.ru.DeleteOldRooms(); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "古い部屋の削除に失敗しました: " + err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]string{"message": "古い部屋を削除しました"})
}
