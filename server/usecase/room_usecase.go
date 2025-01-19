package usecase

import (
	"chat_upgrade/model"
	"chat_upgrade/repository"
	"log"
	"mime/multipart"
	"strconv"
	"time"
)

// 部屋登録に関するビジネスロジックのインターフェース
type IRoomUsecase interface {
	RegisterRoom(roomName, roomIconURL, password, description, latitudeStr, longitudeStr string) (*model.Room, error)
	DeleteOldRooms() error
	GetAllRooms() ([]model.Room, error)
	UploadRoomIcon(file *multipart.FileHeader) (string, error)
}

// IRoomUsecase の実装構造体
type roomUsecase struct {
	rr repository.IRoomRepository
	s3 repository.IS3Repository
}

// roomUsecase のインスタンスを生成
func NewRoomUsecase(rr repository.IRoomRepository, s3 repository.IS3Repository) IRoomUsecase {
	return &roomUsecase{
		rr: rr,
		s3: s3,
	}
}

// 部屋情報を登録するメソッド
func (ru *roomUsecase) RegisterRoom(roomName, roomIconURL, password, description, latitudeStr, longitudeStr string) (*model.Room, error) {
	// 緯度と経度を文字列から変換
	lat, err := strconv.ParseFloat(latitudeStr, 64)
	if err != nil {
		log.Printf("Invalid latitude: %v", err)
		return nil, err
	}
	lon, err := strconv.ParseFloat(longitudeStr, 64)
	if err != nil {
		log.Printf("Invalid longitude: %v", err)
		return nil, err
	}

	// 部屋情報を作成
	room := &model.Room{
		RoomName:    roomName,
		RoomImage:   roomIconURL,
		Password:    password,
		Description: description,
		Latitude:    lat,
		Longitude:   lon,
		CreatedAt:   time.Now(),
	}

	// データベースに保存
	if err := ru.rr.CreateRoom(room); err != nil {
		return nil, err
	}

	return room, nil
}

// 部屋画像をS3にアップロードするメソッド
func (ru *roomUsecase) UploadRoomIcon(file *multipart.FileHeader) (string, error) {
	// 一意のファイル名を生成


	// S3にアップロード
	fileURL, err := ru.s3.UploadFile(file)
	if err != nil {
		log.Printf("Failed to upload to S3: %v", err)
		return "", err
	}

	return fileURL, nil
}

// すべての部屋情報を取得するメソッド
func (ru *roomUsecase) GetAllRooms() ([]model.Room, error) {
	return ru.rr.GetAllRooms()
}

// 古い部屋を削除するメソッド
func (ru *roomUsecase) DeleteOldRooms() error {
	return ru.rr.DeleteOldRooms()
}
