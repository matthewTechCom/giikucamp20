package validator

import (
	"chat_upgrade/model"

	validation "github.com/go-ozzo/ozzo-validation/v4"
	"github.com/go-ozzo/ozzo-validation/v4/is"
)

type IUserValidator interface {
	UserValidate(user model.User) error
}

type userValidator struct{}

// ファクトリ関数
func NewUserValidator() IUserValidator {
	return &userValidator{}
}

// ユーザーバリデーション
func (uv *userValidator) UserValidate(user model.User) error {
	return validation.ValidateStruct(&user,
		// Usernameのバリデーション
		validation.Field(
			&user.Username,
			validation.Required.Error("username is required"),
			validation.RuneLength(3, 30).Error("username must be between 3 to 30 characters"),
		),

		// Passwordのバリデーション
		validation.Field(
			&user.Password,
			validation.Required.Error("password is required"),
			validation.RuneLength(6, 30).Error("password must be between 6 to 30 characters"),
		),

		// UserIconのバリデーション
		validation.Field(
			&user.UserIcon,
			is.URL.Error("usericon must be a valid URL"),
		),
	)
}
