package repository

import (
	"chat_upgrade/model"

	"gorm.io/gorm"
)

// インターフェース定義
type IUserRepository interface {
	SaveUser(user model.User) error              // ユーザーを保存
	FindByUsername(username string) (*model.User, error) // ユーザー名で検索
	GetUserByID(userID uint) (*model.User, error) // ユーザーIDで検索 (追加)
}

type userRepository struct {
	db *gorm.DB
}

// コンストラクタ関数
func NewUserRepository(db *gorm.DB) IUserRepository {
	return &userRepository{db: db}
}

// ✅ ユーザーを保存
func (r *userRepository) SaveUser(user model.User) error {
	return r.db.Create(&user).Error
}

// ✅ ユーザー名で検索
func (r *userRepository) FindByUsername(username string) (*model.User, error) {
	var user model.User
	// 必要なカラムのみを選択
	if err := r.db.Select("id", "username", "password", "user_icon").Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

// ✅ ユーザーIDで検索 (追加)
func (r *userRepository) GetUserByID(userID uint) (*model.User, error) {
	var user model.User
	if err := r.db.Select("id", "username", "user_icon").Where("id = ?", userID).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
