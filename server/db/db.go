package db

import (
	"context"
	"errors"
	"fmt"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func Connect(uri string) (*mongo.Client, error) {
	if uri == "" {
		return nil, errors.New("mongodb URI is required")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	clientOptions := options.Client().
		ApplyURI(uri).
		SetServerAPIOptions(options.ServerAPI(options.ServerAPIVersion1))

	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, fmt.Errorf("failed to create client: %w", err)
	}

	// Verify the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		return nil, fmt.Errorf("failed to ping mongodb: %w", err)
	}
	return client, nil
}

func Disconnect(client *mongo.Client) error {
	if client == nil {
		return errors.New("client is nil")
	}
	if err := client.Disconnect(context.TODO()); err != nil {
		return fmt.Errorf("failed to disconnect from mongodb: %w", err)
	}
	return nil
}
