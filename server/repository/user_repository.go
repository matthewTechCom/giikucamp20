package repository

import (
	"chat_upgrade/model"

	"gorm.io/gorm"
)

// インターフェース定義
type IUserRepository interface {
	GetUserByUsername(user *model.User, username string) error
	CreateUser(user *model.User) error
	UpdateUserIcon(userID uint, userIcon string) error
	GetUserByID(user *model.User, userID uint) error
}

// リポジトリ構造体
type userRepository struct {
	db *gorm.DB
}

// ファクトリ関数
func NewUserRepository(db *gorm.DB) IUserRepository {
	return &userRepository{db}
}

// メールアドレスでユーザーを取得するメソッド
func (ur *userRepository) GetUserByUsername(user *model.User, username string) error {
	if err := ur.db.Where("username = ?", username).First(user).Error; err != nil {
		return err
	}
	return nil
}

// 新規ユーザーを作成するメソッド
func (ur *userRepository) CreateUser(user *model.User) error {
	if err := ur.db.Create(user).Error; err != nil {
		return err
	}
	return nil
}

// ユーザーのアイコンを更新するメソッド
func (ur *userRepository) UpdateUserIcon(userID uint, userIcon string) error {
	if err := ur.db.Model(&model.User{}).Where("id = ?", userID).Update("usericon", userIcon).Error; err != nil {
		return err
	}
	return nil
}

// ユーザーIDでユーザー情報を取得するメソッド
func (ur *userRepository) GetUserByID(user *model.User, userID uint) error {
    return ur.db.First(user, userID).Error
}

