package repository

import (
	"chat_upgrade/model"

	"gorm.io/gorm"
)

type IUserRepository interface {
	SaveUser(user model.User) error
	FindByUsername(username string) (*model.User, error)
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) IUserRepository {
	return &userRepository{db: db}
}

// ユーザーを保存
func (r *userRepository) SaveUser(user model.User) error {
	return r.db.Create(&user).Error
}

// ユーザー名で検索
func (r *userRepository) FindByUsername(username string) (*model.User, error) {
	var user model.User
	if err := r.db.Where("username = ?", username).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
