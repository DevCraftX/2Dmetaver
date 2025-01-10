package main

import (
	"log"
	"net/http"

	"github.com/DevCraftX/2Dmetaver/server/config"
	"github.com/DevCraftX/2Dmetaver/server/db"
	"github.com/DevCraftX/2Dmetaver/server/handlers"
	"github.com/gorilla/mux"
)

func main() {
	cfg := config.LoadConfig()

	// connect to db
	client, err := db.Connect(cfg.MongoURI)
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		if err := db.Disconnect(client); err != nil {
			log.Printf("Error disconnecting: %v", err)
		}
	}()
	db := client.Database(cfg.DatabaseName)
	log.Println("Connnected to DB")

	authHandler := handlers.NewAuthHandler(db, cfg.JWTSecret)

	// expose the auth handlers
	r := mux.NewRouter()
	r.HandleFunc("/api/auth/signup", authHandler.SignupHandler).Methods("POST")
	r.HandleFunc("/api/auth/login", authHandler.LoginHandler).Methods("POST")

	// TODO: Add GET handlers
	// r.HandleFunc("/api/user/active", authHandler.LoginHandler).Methods("GET")

	// Protected route
	// protected := r.PathPrefix("/api").Subrouter()
	// protected.Use(middleware.AuthMiddleware(cfg.JWTSecret))

	log.Println("Server started on :8000")
	log.Fatal(http.ListenAndServe(":8000", r))
}
