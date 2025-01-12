package controller

import (
	"chat_upgrade/usecase"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type IFileController interface {
	UploadFile(c echo.Context) error
}

type fileController struct {
	hu usecase.IHubUsecase
}

func NewFileController(hu usecase.IHubUsecase) IFileController {
	return &fileController{
		hu: hu,
	}
}

func (fc *fileController) UploadFile(c echo.Context) error {
	file, err := c.FormFile("file")
	if err != nil {
		log.Printf("FormFile error: %v", err)
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "ファイルが必要です"})
	}

	src, err := file.Open()
	if err != nil {
		log.Printf("File open error: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "ファイルを開く際にエラーが発生しました"})
	}
	defer src.Close()

	url, err := fc.hu.UploadToS3(file, src)
	if err != nil {
		log.Printf("UploadToS3 error: %v", err)
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": "ファイルのアップロードに失敗しました"})
	}

	log.Printf("File uploaded successfully: %s", url)
	return c.JSON(http.StatusOK, map[string]string{"url": url})
}
