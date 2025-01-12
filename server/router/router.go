package router

import (
	"chat_upgrade/controller"

	"github.com/labstack/echo/v4"
)

func NewRouter(hc controller.IHubController, fc controller.IFileController, uc controller.IUserController) *echo.Echo {
	e := echo.New()

	// WebSocketルーム
	e.GET("/rooms/:id/ws", hc.ServerWs)

	// ファイルアップロード
	e.POST("/upload", fc.UploadFile)

	// ユーザー認証
	e.POST("/signup", uc.SignUp)   // ユーザー登録
	e.POST("/login", uc.LogIn)     // ログイン

	return e
}
