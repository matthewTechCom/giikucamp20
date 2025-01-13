// controller.go
package controller

import (
	"chat_upgrade/model"
	"chat_upgrade/usecase"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type IUserController interface {
	SignUp(c echo.Context) error
	LogIn(c echo.Context) error
	Me(c echo.Context) error
}

type userController struct {
	uc usecase.IUserUsecase
}

func NewUserController(uc usecase.IUserUsecase) IUserController {
	return &userController{uc: uc}
}

// サインアップ処理
func (uc *userController) SignUp(c echo.Context) error {
	var user model.User
	if err := c.Bind(&user); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	if err := uc.uc.RegisterUser(user); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "Failed to register user"})
	}

	return c.JSON(http.StatusCreated, map[string]string{"message": "User registered successfully"})
}

// ログイン処理
func (uc *userController) LogIn(c echo.Context) error {
	var loginRequest model.User
	if err := c.Bind(&loginRequest); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	log.Println("ログイン処理が呼び出されました")

	return c.JSON(http.StatusOK, map[string]string{"message": "Login successful"})
}

// ユーザー情報取得処理（ダミーデータ）
func (uc *userController) Me(c echo.Context) error {
	log.Println("ユーザー情報を取得します")

	// ダミーデータを返却
	return c.JSON(http.StatusOK, map[string]interface{}{
		"username": "testuser",
		"userIcon": "https://example.com/icon.png",
	})
}
