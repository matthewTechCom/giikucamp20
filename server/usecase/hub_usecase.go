package usecase

import (
	"bytes"
	"chat_upgrade/model"
	"chat_upgrade/repository"
	"encoding/json"
	"fmt"
	"log"
	"mime/multipart"
	"path/filepath"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
	"github.com/gorilla/websocket"
)

type IHubUsecase interface {
	RunHub(hub *model.Hub)
	RegisterClient(hub *model.Hub, client *model.Client)
	UnregisterClient(hub *model.Hub, client *model.Client)
	BroadcastMessage(hub *model.Hub, msg *model.Message)
	ReadPump(client *model.Client)
	WritePump(client *model.Client)
	CreateRoom(roomName string, password string) (*model.Hub, error)
	JoinRoom(roomName string, password string) (*model.Hub, error)
	GetHub(roomName string) (*model.Hub, bool)
	UploadToS3(fileHeader *multipart.FileHeader, src multipart.File) (string, error)
}

type hubUsecase struct {
	hr        repository.IHubRepository
	s3Session *s3.S3
	config    model.Config
}

func NewHubUsecase(hr repository.IHubRepository, config model.Config) IHubUsecase {
	creds := credentials.NewStaticCredentials(config.AWSAccessKeyID, config.AWSSecretAccessKey, "")
	awsConfig := &aws.Config{
		Region:      aws.String(config.AWSRegion),
		Credentials: creds,
	}
	sess := session.Must(session.NewSession(awsConfig))
	s3Client := s3.New(sess)

	return &hubUsecase{
		hr:        hr,
		s3Session: s3Client,
		config:    config,
	}
}

func (hu *hubUsecase) UploadToS3(fileHeader *multipart.FileHeader, src multipart.File) (string, error) {
	defer func() {
		if r := recover(); r != nil {
			log.Printf("Recovered from panic in UploadToS3: %v", r)
		}
	}()

	log.Println("Starting UploadToS3")

	buf := new(bytes.Buffer)
	if _, err := buf.ReadFrom(src); err != nil {
		log.Printf("Buffer read error: %v", err)
		return "", err
	}

	timestamp := time.Now().Unix()
	filename := fmt.Sprintf("%d_%s", timestamp, filepath.Base(fileHeader.Filename))
	log.Printf("Uploading file with name: %s", filename)

	uploader := s3manager.NewUploaderWithClient(hu.s3Session)
	result, err := uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(hu.config.S3Bucket),
		Key:    aws.String(filename),
		Body:   bytes.NewReader(buf.Bytes()),
		// ACL:    aws.String("public-read"),
	})
	if err != nil {
		log.Printf("S3 Upload error: %v", err)
		return "", err
	}

	log.Printf("File uploaded successfully to: %s", result.Location)
	return result.Location, nil
}

func (hu *hubUsecase) RunHub(hub *model.Hub) {
	for {
		select {
		case client := <-hub.Register:
			hu.RegisterClient(hub, client)
			for existingClient := range hub.Clients {
				if existingClient != client && existingClient.Username != "" {
					joinMsg := &model.Message{
						Type:     "JOIN",
						Username: existingClient.Username,
						UserIcon: existingClient.UserIcon,
						Text:     fmt.Sprintf("%s が参加しています。", existingClient.Username),
					}
					client.Send <- joinMsg
				}
			}
		case client := <-hub.Unregister:
			hu.UnregisterClient(hub, client)
			leaveMsg := &model.Message{
				Type:     "LEAVE",
				Username: client.Username,
				UserIcon: client.UserIcon,
				Text:     fmt.Sprintf("%s が退室しました。", client.Username),
			}
			hu.BroadcastMessage(hub, leaveMsg)
		case msg := <-hub.Broadcast:
			hu.BroadcastMessage(hub, msg)
		}
	}
}

func (hu *hubUsecase) RegisterClient(hub *model.Hub, client *model.Client) {
	hub.Clients[client] = true
}

func (hu *hubUsecase) UnregisterClient(hub *model.Hub, client *model.Client) {
	if _, ok := hub.Clients[client]; ok {
		delete(hub.Clients, client)
		close(client.Send)
	}
}

func (hu *hubUsecase) BroadcastMessage(hub *model.Hub, msg *model.Message) {
	for client := range hub.Clients {
		select {
		case client.Send <- msg:
		default:
			close(client.Send)
			delete(hub.Clients, client)
		}
	}
}

func (hu *hubUsecase) ReadPump(client *model.Client) {
	defer func() {
		if client.Hub != nil {
			client.Hub.Unregister <- client
		}
		client.Conn.Close()
		log.Printf("Connection closed for client: %s", client.Username)
	}()

	client.Conn.SetReadLimit(model.MaxMessageSize)
	client.Conn.SetReadDeadline(time.Now().Add(model.PongWait))
	client.Conn.SetPongHandler(func(string) error {
		client.Conn.SetReadDeadline(time.Now().Add(model.PongWait))
		return nil
	})

	for {
		messageType, data, err := client.Conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("unexpected close error: %v", err)
			}
			break
		}

		if messageType == websocket.TextMessage {
			var msg model.Message
			if err := json.Unmarshal(data, &msg); err != nil {
				log.Printf("JSON parse error: %v", err)
				continue
			}

			log.Printf("Received message: %v", msg)

			switch msg.Type {
			case "SET_USER":
				client.Username = msg.Username
				client.UserIcon = msg.UserIcon
				log.Printf("Set user for client: %s", client.Username)

				joinMsg := &model.Message{
					Type:     "JOIN",
					Username: client.Username,
					UserIcon: client.UserIcon,
					Text:     fmt.Sprintf("%s が参加しました。", client.Username),
				}
				hu.BroadcastMessage(client.Hub, joinMsg)
				log.Printf("Broadcasted JOIN message for user: %s", client.Username)

			case "MSG":
				if client.Username == "" || client.UserIcon == "" {
					errorMsg := &model.Message{
						Type:    "ERROR",
						Message: "ユーザー情報が設定されていません。",
					}
					client.Send <- errorMsg
					log.Printf("Error: User info not set for message: %v", msg)
					continue
				}

				hu.BroadcastMessage(client.Hub, &msg)
				log.Printf("Broadcasted MSG from user: %s", client.Username)

			case "FILE":
				if client.Username == "" || client.UserIcon == "" {
					errorMsg := &model.Message{
						Type:    "ERROR",
						Message: "ユーザー情報が設定されていません。",
					}
					client.Send <- errorMsg
					log.Printf("Error: User info not set for file message: %v", msg)
					continue
				}

				hu.BroadcastMessage(client.Hub, &msg)
				log.Printf("Broadcasted FILE from user: %s", client.Username)

			default:
				log.Printf("Unknown message type: %s", msg.Type)
			}
		}
	}
}

func (hu *hubUsecase) WritePump(client *model.Client) {
	ticker := time.NewTicker(model.PingPeriod)
	defer func() {
		ticker.Stop()
		client.Conn.Close()
	}()

	for {
		select {
		case msg, ok := <-client.Send:
			client.Conn.SetWriteDeadline(time.Now().Add(model.WriteWait))
			if !ok {
				client.Conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			jsonData, err := json.Marshal(msg)
			if err != nil {
				log.Printf("JSON marshal error: %v", err)
				continue
			}
			if err := client.Conn.WriteMessage(websocket.TextMessage, jsonData); err != nil {
				return
			}

		case <-ticker.C:
			client.Conn.SetWriteDeadline(time.Now().Add(model.WriteWait))
			if err := client.Conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func (hu *hubUsecase) CreateRoom(roomName string, password string) (*model.Hub, error) {
	hub, err := hu.hr.CreateHub(roomName, password)
	if err != nil {
		return nil, err
	}
	go hu.RunHub(hub)
	return hub, nil
}

func (hu *hubUsecase) JoinRoom(roomName string, password string) (*model.Hub, error) {
	hub, ok := hu.hr.GetHub(roomName)
	if !ok {
		return nil, fmt.Errorf("room does not exist")
	}
	if hub.Password != password {
		return nil, fmt.Errorf("incorrect password")
	}
	return hub, nil
}

func (hu *hubUsecase) GetHub(roomName string) (*model.Hub, bool) {
	return hu.hr.GetHub(roomName)
}
