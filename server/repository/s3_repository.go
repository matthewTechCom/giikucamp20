package repository

import (
	"fmt"
	"mime/multipart"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

type IS3Repository interface {
	UploadFile(file *multipart.FileHeader) (string, error)
}

type s3Repository struct {
	bucket string
}

func NewS3Repository(bucket string) IS3Repository {
	return &s3Repository{bucket: bucket}
}


func (s3r *s3Repository) UploadFile(file *multipart.FileHeader) (string, error) {
	src, err := file.Open()
	if err != nil {
		fmt.Println("ファイルのオープンに失敗:", err)
		return "", err
	}
	defer src.Close()

	fileKey := "uploads/" + file.Filename

	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("AWS_REGION")),
	})
	if err != nil {
		fmt.Println("AWSセッションの作成に失敗:", err)
		return "", err
	}

	uploader := s3.New(sess)
	_, err = uploader.PutObject(&s3.PutObjectInput{
		Bucket:      aws.String(s3r.bucket),
		Key:         aws.String(fileKey),
		Body:        src,
		ContentType: aws.String(file.Header.Get("Content-Type")),
		// ACL フィールドを削除
	})
	if err != nil {
		fmt.Println("S3アップロードに失敗:", err)
		return "", err
	}

	fileURL := "https://" + s3r.bucket + ".s3." + os.Getenv("AWS_REGION") + ".amazonaws.com/" + fileKey
	fmt.Println("アップロード成功。ファイルURL:", fileURL) // アップロード成功のログ
	return fileURL, nil
}

