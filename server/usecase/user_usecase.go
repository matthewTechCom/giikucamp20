package usecase

import (
	"chat_upgrade/model"
	"chat_upgrade/repository"
	"chat_upgrade/validator"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"golang.org/x/crypto/bcrypt"
)

type IUserUsecase interface {
    SignUp(user model.User) (model.UserResponse, error)
    Login(user model.User) (string, error)
    UpdateUserIcon(userID uint, userIcon string) error
    GetUserByID(userID uint) (model.User, error)
}

type userUsecase struct {
    ur repository.IUserRepository
    uv validator.IUserValidator
}

func NewUserUsecase(ur repository.IUserRepository, uv validator.IUserValidator) IUserUsecase {
    return &userUsecase{ur, uv}
}

func (uu *userUsecase) SignUp(user model.User) (model.UserResponse, error) {
    if err := uu.uv.UserValidate(user); err != nil {
        return model.UserResponse{}, err
    }

    hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
    if err != nil {
        return model.UserResponse{}, err
    }

    newUser := model.User{
        Username: user.Username,
        Password: string(hash),
        UserIcon: user.UserIcon,
    }
    if err := uu.ur.CreateUser(&newUser); err != nil {
        return model.UserResponse{}, err
    }

    resUser := model.UserResponse{
        ID:       newUser.ID,
        Username: newUser.Username,
        UserIcon: newUser.UserIcon,
    }

    return resUser, nil
}

func (uu *userUsecase) Login(user model.User) (string, error) {
    if err := uu.uv.UserValidate(user); err != nil {
        return "", err
    }

    storedUser := model.User{}
    if err := uu.ur.GetUserByUsername(&storedUser, user.Username); err != nil {
        return "", err
    }

    err := bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
    if err != nil {
        return "", err
    }

    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "user_id": storedUser.ID,
        "exp":     time.Now().Add(time.Hour * 12).Unix(),
    })
    tokenString, err := token.SignedString([]byte(os.Getenv("SECRET")))
    if err != nil {
        return "", err
    }

    return tokenString, nil
}

func (uu *userUsecase) UpdateUserIcon(userID uint, userIcon string) error {
    return uu.ur.UpdateUserIcon(userID, userIcon)
}

func (uu *userUsecase) GetUserByID(userID uint) (model.User, error) {
    user := model.User{}
    if err := uu.ur.GetUserByID(&user, userID); err != nil {
        return model.User{}, err
    }
    return user, nil
}
