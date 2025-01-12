package router

import (
	"chat_upgrade/controller"

	"github.com/labstack/echo/v4"
)

func NewRouter(hc controller.IHubController, fc controller.IFileController) *echo.Echo {
	e := echo.New()
	e.GET("/rooms/:id/ws", hc.ServerWs)
	e.POST("/upload", fc.UploadFile)
	return e
}
