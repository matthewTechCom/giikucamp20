package repository

import (
	"chat_upgrade/model"
	"time"

	"gorm.io/gorm"
)

// 部屋情報を管理するインターフェース
type IRoomRepository interface {
	CreateRoom(room *model.Room) error
	// GetRoomByName(roomName string) (*model.Room, bool)
	DeleteOldRooms() error
	GetAllRooms() ([]model.Room, error)
	UpdateRoomImage(roomID uint, imageURL string) error
}

type roomRepository struct {
	db *gorm.DB
}

func (rr *roomRepository) UpdateRoomImage(roomID uint, imageURL string) error {
	if err := rr.db.Model(&model.Room{}).Where("id = ?", roomID).Update("room_image", imageURL).Error; err != nil {
		return err
	}
	return nil
}

// roomRepository のインスタンスを返すメソッド
func NewRoomRepository(db *gorm.DB) IRoomRepository {
	return &roomRepository{
		db: db,
	}
}

// 新規部屋を作成するメソッド
func (rr *roomRepository) CreateRoom(room *model.Room) error {
	// if err := rr.db.Where("room_name = ?", room.RoomName).First(&model.Room{}).Error; err == nil {
	// 	return errors.New("room already exists")
	// }
	if err := rr.db.Create(room).Error; err != nil {
		return err
	}
	return nil
}

// 指定された部屋名の部屋情報を返すメソッド
// func (rr *roomRepository) GetRoomByName(roomName string) (*model.Room, bool) {
// 	var room model.Room
// 	if err := rr.db.Where("room_name = ?", roomName).First(&room).Error; err != nil {
// 		if errors.Is(err, gorm.ErrRecordNotFound) {
// 			return nil, false
// 		}
// 		return nil, false
// 	}
// 	return &room, true
// }

// 24時間前の部屋を削除するメソッド
func (rr *roomRepository) DeleteOldRooms() error {
	thresholdTime := time.Now().Add(-24 * time.Hour)
	if err := rr.db.Where("created_at < ?", thresholdTime).Delete(&model.Room{}).Error; err != nil {
		return err
	}
	return nil
}

// すべての部屋情報を取得するメソッド
func (rr *roomRepository) GetAllRooms() ([]model.Room, error) {
	var rooms []model.Room
	if err := rr.db.Find(&rooms).Error; err != nil {
		return nil, err
	}
	return rooms, nil
}
