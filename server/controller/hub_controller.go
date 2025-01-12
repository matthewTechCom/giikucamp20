package controller

import (
	"chat_upgrade/model"
	"chat_upgrade/usecase"
	"log"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

type IHubController interface {
	ServerWs(c echo.Context) error
}

type hubController struct {
	hu usecase.IHubUsecase
}

func NewHubController(hu usecase.IHubUsecase) IHubController {
	return &hubController{
		hu: hu,
	}
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  5 * 1024 * 1024,
	WriteBufferSize: 5 * 1024 * 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (hc *hubController) ServerWs(c echo.Context) error {
	roomName := c.Param("id")
	password := c.QueryParam("password")

	if roomName == "" || password == "" {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "roomName and password are required"})
	}

	hub, ok := hc.hu.GetHub(roomName)
	if !ok {
		var err error
		hub, err = hc.hu.CreateRoom(roomName, password)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, map[string]string{"error": "failed to create room: " + err.Error()})
		}
		log.Printf("Room created: %s", roomName)
	} else {
		if hub.Password != password {
			return c.JSON(http.StatusForbidden, map[string]string{"error": "incorrect password"})
		}
	}

	conn, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		log.Println("upgrade error:", err)
		return err
	}

	client := &model.Client{
		Conn: conn,
		Send: make(chan *model.Message, 256),
		Hub:  hub,
	}

	hub.Register <- client

	go hc.hu.WritePump(client)
	go hc.hu.ReadPump(client)

	return nil
}
