package usecase

import (
	"chat_upgrade/model"
	"chat_upgrade/repository"
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type IUserUsecase interface {
	RegisterUser(user model.User) error
	Authenticate(username, password string) (string, error)
}

type userUsecase struct {
	repo repository.IUserRepository
}

func NewUserUsecase(repo repository.IUserRepository) IUserUsecase {
	return &userUsecase{repo: repo}
}

// ユーザー登録
func (u *userUsecase) RegisterUser(user model.User) error {
	// パスワードをハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}
	user.Password = string(hashedPassword)

	return u.repo.SaveUser(user)
}

// ユーザー認証
func (u *userUsecase) Authenticate(username, password string) (string, error) {
	user, err := u.repo.FindByUsername(username)
	if err != nil {
		return "", errors.New("user not found")
	}

	// パスワード照合
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid password")
	}

	// JWTトークン生成
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id":   user.ID,
		"username":  user.Username,
		"exp":       time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenString, err := token.SignedString([]byte("your-secret-key"))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}
