package controller

import (
	"chat_upgrade/model"
	"chat_upgrade/usecase"
	"net/http"

	"github.com/labstack/echo/v4"
)

type IUserController interface {
	SignUp(c echo.Context) error
	LogIn(c echo.Context) error
}

type userController struct {
	uc usecase.IUserUsecase
}

func NewUserController(uc usecase.IUserUsecase) IUserController {
	return &userController{uc: uc}
}

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

func (uc *userController) LogIn(c echo.Context) error {
	var loginRequest model.User
	if err := c.Bind(&loginRequest); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	token, err := uc.uc.Authenticate(loginRequest.Username, loginRequest.Password)
	if err != nil {
		return c.JSON(http.StatusUnauthorized, map[string]string{"error": "Invalid credentials"})
	}

	return c.JSON(http.StatusOK, map[string]string{"token": token})
}
