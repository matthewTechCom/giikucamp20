package controller

import (
	"chat_upgrade/model"
	"chat_upgrade/usecase"
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/labstack/echo/v4"
)

type IUserController interface {
	SignUp(c echo.Context) error
	LogIn(c echo.Context) error
	LogOut(c echo.Context) error
	Me(c echo.Context) error
	CsrfToken(c echo.Context) error
}

type userController struct {
	uu usecase.IUserUsecase
}

func NewUserController(uu usecase.IUserUsecase) IUserController {
	return &userController{uu}
}

func (uc *userController) SignUp(c echo.Context) error {
    // email := c.FormValue("email")
	username := c.FormValue("username")
	password := c.FormValue("password")
	file, err := c.FormFile("file") // 写真データを受け取る
	if err != nil {
		return c.JSON(http.StatusBadRequest, "写真データが提供されていません")
	}

	if username == "" || password == "" {
		return c.JSON(http.StatusBadRequest, "username と password は必須です")
	}

	// 写真をアップロードしてURLを取得
	userIconURL, err := uc.uu.UploadUserIcon(file)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, "写真のアップロードに失敗しました")
	}

	// ユーザー情報を作成
	user := model.User{
        // Email:email,
		Username: username,
		Password: password,
		UserIcon: userIconURL,
	}

	userRes, err := uc.uu.SignUp(user)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	return c.JSON(http.StatusCreated, userRes)
}


func (uc *userController) LogIn(c echo.Context) error {
    user := model.User{}
    if err := c.Bind(&user); err != nil {
        return c.JSON(http.StatusBadRequest, echo.Map{
            "error": "リクエストデータの形式が正しくありません",
        })
    }

    if user.Username == "" || user.Password == "" {
        return c.JSON(http.StatusBadRequest, echo.Map{
            "error": "username と password は必須です",
        })
    }

    // ユーザー認証とトークン生成
    tokenString, err := uc.uu.Login(user)
    if err != nil {
        return c.JSON(http.StatusUnauthorized, echo.Map{
            "error": "認証に失敗しました",
        })
    }

    // トークンをCookieに設定
    cookie := new(http.Cookie)
    cookie.Name = "token"
    cookie.Value = tokenString
    cookie.Expires = time.Now().Add(24 * time.Hour)
    cookie.Path = "/"
    cookie.Domain = os.Getenv("API_DOMAIN")
    cookie.Secure = true
    cookie.HttpOnly = true
    cookie.SameSite = http.SameSiteNoneMode
    c.SetCookie(cookie)

    // トークンをJSONレスポンスとして返す
    return c.JSON(http.StatusOK, echo.Map{
        "token": tokenString,
    })
}

func (uc *userController) LogOut(c echo.Context) error {
	cookie := new(http.Cookie)
	cookie.Name = "token"
	cookie.Value = ""
	cookie.Expires = time.Now()
	cookie.Path = "/"
	cookie.Domain = os.Getenv("API_DOMAIN")
	cookie.Secure = true
	cookie.HttpOnly = true
	cookie.SameSite = http.SameSiteDefaultMode   //http.SameSiteNoneMode
    //http.SameSiteDefaultMode
	c.SetCookie(cookie)
	return c.NoContent(http.StatusOK)
}
// コントローラでの修正例（Me エンドポイント）
// ヘッダーからトークンを取得


func (uc *userController) Me(c echo.Context) error {
    // Cookieからトークンを取得
    cookie, err := c.Cookie("token")
    if err != nil {
        return c.JSON(http.StatusUnauthorized, echo.Map{
            "error": "トークンが提供されていません",
        })
    }

    tokenStr := cookie.Value

    // トークンの解析と検証
    token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
        if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
            return nil, fmt.Errorf("無効な署名方法")
        }
        return []byte(os.Getenv("SECRET")), nil
    })

    if err != nil || !token.Valid {
        return c.JSON(http.StatusUnauthorized, echo.Map{
            "error": "トークンが無効です",
        })
    }

    claims, ok := token.Claims.(jwt.MapClaims)
    if !ok {
        return c.JSON(http.StatusUnauthorized, echo.Map{
            "error": "トークンからユーザー情報を取得できません",
        })
    }

    userID, ok := claims["user_id"].(float64)
    if !ok {
        return c.JSON(http.StatusUnauthorized, echo.Map{
            "error": "ユーザーIDがトークンに含まれていません",
        })
    }

    user, err := uc.uu.GetUserByID(uint(userID))
    if err != nil {
        return c.JSON(http.StatusNotFound, echo.Map{
            "error": "ユーザーが見つかりません",
        })
    }

    return c.JSON(http.StatusOK, model.UserResponse{

        ID:       user.ID,
        // Email :user.Email,
        Username: user.Username,
        UserIcon: user.UserIcon,
    })
}


func (uc *userController) CsrfToken(c echo.Context) error {
	token := c.Get("csrf").(string)
	return c.JSON(http.StatusOK, echo.Map{
		"csrf_token": token,
	})
}
