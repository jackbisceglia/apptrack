package util

import (
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func ValidateUserRequest(keyFromRequest string) bool {
	return keyFromRequest != "" && keyFromRequest == os.Getenv("USERS_API_KEY")
}

func RouterUtils(router *mux.Router) func([]string, func(http.ResponseWriter, *http.Request), string) {
	HandleMultipleRoutes := func(routes []string, handler func(http.ResponseWriter, *http.Request), method string) {
		for _, route := range routes {
			router.HandleFunc(route, handler).Methods(method)
		}
	}

	return HandleMultipleRoutes
}
