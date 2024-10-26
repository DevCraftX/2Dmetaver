package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Create an upgrader to upgrade HTTP connections to WebSocket connections
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true // Allow all CORS
	},
}

// Store connected clients
var clients = make(map[*websocket.Conn]bool)
var mutex = sync.Mutex{} // Protects the clients map

// Struct for the JSON message
type Message struct {
	PlayerId string  `json:"playerId"`
	X        float64 `json:"x"`
	Y        float64 `json:"y"`
}

// Broadcast a message to all connected clients
func broadcastMessage(message Message) {
	mutex.Lock()
	defer mutex.Unlock()

	// Encode the message to JSON
	jsonMessage, err := json.Marshal(message)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		return
	}

	for client := range clients {
		err := client.WriteMessage(websocket.TextMessage, jsonMessage)
		if err != nil {
			fmt.Println("Error sending message:", err)
			client.Close()
			delete(clients, client)
		}
	}
}

// Handle WebSocket connections
func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Failed to upgrade connection:", err)
		return
	}
	defer conn.Close()

	// Register the new client
	mutex.Lock()
	clients[conn] = true
	mutex.Unlock()

	for {
		// Read message from WebSocket
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Error reading message:", err)
			break
		}
		// Decode the JSON message
		var receivedMessage Message
		err = json.Unmarshal(msg, &receivedMessage)
		if err != nil {
			fmt.Println("Error decoding JSON:", err)
			continue
		}
		fmt.Printf("Received message: %s\n", msg)

		// Broadcast the message to all clients
		broadcastMessage(receivedMessage)
	}

	// Unregister the client on disconnect
	mutex.Lock()
	delete(clients, conn)
	mutex.Unlock()
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)
	fmt.Println("WebSocket server started on :8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("Server error:", err)
	}
}
