package usecase

import (
	"chat_upgrade/model"
	"chat_upgrade/repository"
	"fmt"
	"log"
	"mime/multipart"
	"strconv"
	"time"
)

// 部屋登録に関するビジネスロジックのインターフェース
type IRoomUsecase interface {
	RegisterRoom(roomName, password, description, latitudeStr, longitudeStr string) (*model.Room, error)
	GetRoomByName(roomName string) (*model.Room, error)
	DeleteOldRooms() error
	GetAllRooms() ([]model.Room, error)
	UpdateRoomImage(roomID uint, file *multipart.FileHeader) error
}

// すべての部屋情報を返すメソッド
func (ru *roomUsecase) GetAllRooms() ([]model.Room, error) {
	return ru.rr.GetAllRooms()
}

// IRoomUsecase の実装構造体
type roomUsecase struct {
	rr  repository.IRoomRepository
	s3r repository.IS3Repository
}

// roomUsecase のインスタンスを生成する
func NewRoomUsecase(rr repository.IRoomRepository, s3r repository.IS3Repository) IRoomUsecase {
	return &roomUsecase{
		rr:  rr,
		s3r: s3r,
	}
}

// 部屋画像をアップロードして更新するメソッド
func (ru *roomUsecase) UpdateRoomImage(roomID uint, file *multipart.FileHeader) error {
	// S3にアップロード
	imageURL, err := ru.s3r.UploadFile(file)
	if err != nil {
		return err
	}

	// データベースにURLを格納
	if err := ru.rr.UpdateRoomImage(roomID, imageURL); err != nil {
		return err
	}

	return nil
}

// フォームなどから受け取った情報で部屋を登録するメソッド
func (ru *roomUsecase) RegisterRoom(roomName, password, description, latitudeStr, longitudeStr string) (*model.Room, error) {
	// 既存の部屋が存在しないかチェック
	if _, found := ru.rr.GetRoomByName(roomName); found {
		return nil, fmt.Errorf("room already exists: %s", roomName)
	}

	lat, err := strconv.ParseFloat(latitudeStr, 64)
	if err != nil {
		log.Printf("invalid latitude: %v", err)
		return nil, err
	}
	lon, err := strconv.ParseFloat(longitudeStr, 64)
	if err != nil {
		log.Printf("invalid longitude: %v", err)
		return nil, err
	}

	room := &model.Room{
		RoomName:    roomName,
		Password:    password,
		Description: description,
		Latitude:    lat,
		Longitude:   lon,
		CreatedAt:   time.Now(),
	}

	if err := ru.rr.CreateRoom(room); err != nil {
		return nil, err
	}

	return room, nil
}

// 部屋名で部屋情報を取得するメソッド
func (ru *roomUsecase) GetRoomByName(roomName string) (*model.Room, error) {
	room, found := ru.rr.GetRoomByName(roomName)
	if !found {
		return nil, fmt.Errorf("room not found: %s", roomName)
	}
	return room, nil
}

// 実装に削除メソッドを追加
func (ru *roomUsecase) DeleteOldRooms() error {
	return ru.rr.DeleteOldRooms()
}
