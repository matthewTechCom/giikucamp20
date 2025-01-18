package repository

import (
	"chat_upgrade/model"
	"errors"
	"time"

	"gorm.io/gorm"
)

// 部屋情報を管理するインターフェース
type IRoomRepository interface {
	CreateRoom(room *model.Room) error
	GetRoomByName(roomName string) (*model.Room, bool)
	DeleteOldRooms() error
}

type roomRepository struct {
	db *gorm.DB
}

// roomRepository のインスタンスを返すメソッド
func NewRoomRepository(db *gorm.DB) IRoomRepository {
	return &roomRepository{
		db: db,
	}
}

// 新規部屋を作成するメソッド
func (rr *roomRepository) CreateRoom(room *model.Room) error {
	if err := rr.db.Where("room_name = ?", room.RoomName).First(&model.Room{}).Error; err == nil {
		return errors.New("room already exists")
	}
	if err := rr.db.Create(room).Error; err != nil {
		return err
	}
	return nil
}

// 指定された部屋名の部屋情報を返すメソッド
func (rr *roomRepository) GetRoomByName(roomName string) (*model.Room, bool) {
	var room model.Room
	if err := rr.db.Where("room_name = ?", roomName).First(&room).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, false
		}
		return nil, false
	}
	return &room, true
}

// 24時間前の部屋を削除するメソッド
func (rr *roomRepository) DeleteOldRooms() error {
	thresholdTime := time.Now().Add(-24 * time.Hour)
	if err := rr.db.Where("created_at < ?", thresholdTime).Delete(&model.Room{}).Error; err != nil {
		return err
	}
	return nil
}
