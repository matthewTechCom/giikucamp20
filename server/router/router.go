package router

import (
	"chat_upgrade/controller"

	"github.com/labstack/echo/v4"
)

func NewRouter(hc controller.IHubController, fc controller.IFileController, uc controller.IUserController) *echo.Echo {
	e := echo.New()

	// ユーザー認証のルート
	e.POST("/signup", uc.SignUp)
	e.POST("/login", uc.LogIn)
	e.GET("/me", uc.Me)

	// 必要なら WebSocket ルートも追加
	e.GET("/rooms/:id/ws", hc.ServerWs)
	e.POST("/upload", fc.UploadFile)

	return e
}
