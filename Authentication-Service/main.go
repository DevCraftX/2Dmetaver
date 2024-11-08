package main

import (
	"authentication-service/config" // Replace with your module name
	"authentication-service/routes" // Replace with your module name
	"log"
	"net/http"
)

func main() {
	config.ConnectDB()

	// Verify that the client is connected
	if config.Client == nil {
		log.Fatal("Failed to initialize MongoDB client")
	}

	// Start the server
	router := routes.InitRoutes()
	log.Println("Server started on :8000")
	log.Fatal(http.ListenAndServe(":8000", router))
}
