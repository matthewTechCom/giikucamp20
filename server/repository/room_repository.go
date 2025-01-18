package repository

import (
	"chat_upgrade/model"
	"errors"
	"sync"
)

// 部屋情報を管理するインターフェース
type IRoomRepository interface {
	CreateRoom(room *model.Room) error
	GetRoomByName(roomName string) (*model.Room, bool)
}

type roomRepository struct {
	rooms map[string]*model.Room
	mu    sync.RWMutex
}

// roomRepository のインスタンスを返すメソッド
func NewRoomRepository() IRoomRepository {
	return &roomRepository{
		rooms: make(map[string]*model.Room),
	}
}

// 新規部屋を作成するメソッド
func (rr *roomRepository) CreateRoom(room *model.Room) error {
	rr.mu.Lock()
	defer rr.mu.Unlock()
	if _, exists := rr.rooms[room.RoomName]; exists {
		return errors.New("room already exists")
	}
	// 簡易的な ID 付与（自動採番）
	room.ID = len(rr.rooms) + 1
	rr.rooms[room.RoomName] = room
	return nil
}

// 指定された部屋名の部屋情報を返すメソッド
func (rr *roomRepository) GetRoomByName(roomName string) (*model.Room, bool) {
	rr.mu.RLock()
	defer rr.mu.RUnlock()
	room, exists := rr.rooms[roomName]
	return room, exists
}
