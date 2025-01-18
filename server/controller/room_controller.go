package controller

import (
	"chat_upgrade/usecase"
	"net/http"

	"github.com/labstack/echo/v4"
)

// 部屋登録のエンドポイントを管理するためのインターフェース
type IRoomController interface {
	RegisterRoom(c echo.Context) error
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
