package repository

import (
	"chat_upgrade/model"
	"fmt"
	"sync"
)

type IHubRepository interface {
	GetHub(roomName string) (*model.Hub, bool)
	CreateHub(roomName string, password string) (*model.Hub, error)
	DeleteHub(roomName string) error
}

type inMemoryHubRepo struct {
	hubs map[string]*model.Hub
	mu   sync.RWMutex
}

func NewInMemoryHubRepo() IHubRepository {
	return &inMemoryHubRepo{
		hubs: make(map[string]*model.Hub),
	}
}

func (r *inMemoryHubRepo) GetHub(roomName string) (*model.Hub, bool) {
	r.mu.RLock()
	defer r.mu.RUnlock()
	hub, ok := r.hubs[roomName]
	return hub, ok
}

func (r *inMemoryHubRepo) CreateHub(roomName string, password string) (*model.Hub, error) {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, exists := r.hubs[roomName]; exists {
		return nil, fmt.Errorf("room already exists")
	}
	hub := model.NewHub(roomName, password)
	r.hubs[roomName] = hub
	return hub, nil
}

func (r *inMemoryHubRepo) DeleteHub(roomName string) error {
	r.mu.Lock()
	defer r.mu.Unlock()
	if _, ok := r.hubs[roomName]; !ok {
		return fmt.Errorf("room does not exist")
	}
	delete(r.hubs, roomName)
	return nil
}
