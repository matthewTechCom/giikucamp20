package router

import (
	"chat_upgrade/controller"
	//customMiddleware "chat_upgrade/middleware" // 独自のミドルウェアにエイリアスを設定
	"net/http"
	"os"

	"github.com/labstack/echo/v4"
	echoMiddleware "github.com/labstack/echo/v4/middleware" // Echoのミドルウェアにエイリアスを設定
)

func NewRouter(uc controller.IUserController,hc controller.IHubController, fc controller.IFileController) *echo.Echo {
	e := echo.New()

	// CORS 設定
	e.Use(echoMiddleware.CORSWithConfig(echoMiddleware.CORSConfig{
		AllowOrigins: []string{"http://localhost:3000", os.Getenv("FE_URL")},
		AllowHeaders: []string{
			echo.HeaderOrigin, echo.HeaderContentType, echo.HeaderAccept,
			echo.HeaderAccessControlAllowHeaders, echo.HeaderXCSRFToken,echo.HeaderAuthorization, 
		},
		AllowMethods:     []string{"GET", "PUT", "POST", "DELETE"},
		AllowCredentials: true,
	}))

	// CSRF 保護
	e.Use(echoMiddleware.CSRFWithConfig(echoMiddleware.CSRFConfig{
		CookiePath:     "/",
		CookieDomain:   os.Getenv("API_DOMAIN"),
		CookieHTTPOnly: true,
		CookieSameSite:  //http.SameSiteNoneMode,
		http.SameSiteDefaultMode,
		CookieMaxAge:   3600,
		CookieSecure:   false, 
	}))

	// ユーザー関連のエンドポイント
	e.POST("/signup", uc.SignUp)
	e.POST("/login", uc.LogIn)
	e.POST("/logout", uc.LogOut)
	e.GET("/csrf", uc.CsrfToken)
	e.GET("/me", uc.Me)
	e.GET("/rooms/:id/ws", hc.ServerWs)
	e.POST("/upload", fc.UploadFile)
	// // `/me` に独自ミドルウェアを適用
	// protected := e.Group("")
	// protected.Use(customMiddleware.JWTMiddleware) // 独自ミドルウェアを適用
	// protected.GET("/me", uc.Me)

	return e
}
