package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MongoURI     string
	DatabaseName string
	JWTSecret    string
}

func LoadConfig() *Config {
	if err := godotenv.Load(); err != nil {
		log.Printf("Error loading .env file: %v", err)
	}
	return &Config{
		MongoURI:     os.Getenv("MONGODB_URI"),
		DatabaseName: os.Getenv("DB_NAME"),
		JWTSecret:    os.Getenv("JWT_SECRET"),
	}
}
