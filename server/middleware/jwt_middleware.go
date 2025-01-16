package middleware

import (
	"fmt"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

func JWTMiddleware(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		// Authorization ヘッダーからトークンを取得
		tokenStr := c.Request().Header.Get("Authorization")
		if tokenStr == "" {
			fmt.Println("Authorization ヘッダーが存在しません")
			return c.JSON(http.StatusUnauthorized, "トークンが提供されていません")
		}

		// "Bearer " プレフィックスを削除
		tokenStr = strings.TrimPrefix(tokenStr, "Bearer ")

		// トークンの解析と検証
		token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("無効な署名方法")
			}
			return []byte(os.Getenv("SECRET")), nil
		})

		// トークンが無効または期限切れの場合
		if err != nil || !token.Valid {
			fmt.Printf("トークンの検証エラー: %v\n", err)
			return c.JSON(http.StatusUnauthorized, "トークンが無効か期限切れです")
		}

		// クレームの取得
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			fmt.Println("JWT クレームが取得できません")
			return c.JSON(http.StatusUnauthorized, "トークンからユーザー情報を取得できません")
		}

		// ユーザーIDをクレームから取得
		userID, ok := claims["user_id"].(float64)
		if !ok {
			fmt.Println("user_id がトークンに含まれていません")
			return c.JSON(http.StatusUnauthorized, "ユーザーIDが無効です")
		}

		// JWTの有効期限のチェック
		exp, ok := claims["exp"].(float64)
		if !ok || time.Now().Unix() > int64(exp) {
			fmt.Println("トークンが期限切れです")
			return c.JSON(http.StatusUnauthorized, "トークンの有効期限が切れています")
		}

		// user_idをContextにセット
		c.Set("user_id", uint(userID))

		// 次のハンドラーに進む
		return next(c)
	}
}
