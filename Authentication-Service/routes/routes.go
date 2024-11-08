package routes

import (
	"authentication-service/controllers"
	"net/http"
)

func InitRoutes() *http.ServeMux {
	mux := http.NewServeMux()
	mux.HandleFunc("/signup", controllers.SignupHandler)
	mux.HandleFunc("/login", controllers.LoginHandler)
	return mux
}
