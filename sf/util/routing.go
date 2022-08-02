package util

import (
	"net/http"
	"os"

	"github.com/didip/tollbooth/v7"
	"github.com/gorilla/mux"
)

func ValidateUserRequest(keyFromRequest string) bool {
	return keyFromRequest != "" && keyFromRequest == os.Getenv("USERS_API_KEY")
}

func RouterUtils(router *mux.Router) func([]string, func(http.ResponseWriter, *http.Request), string, bool) {
	HandleMultipleRoutes := func(routes []string, handler func(http.ResponseWriter, *http.Request), method string, limit bool) {
		for _, route := range routes {
			if limit {
				router.Handle(route, tollbooth.LimitFuncHandler(tollbooth.NewLimiter(0.05, nil), handler)).Methods(method)
			} else {
				router.HandleFunc(route, handler).Methods(method)
			}
		}
	}

	return HandleMultipleRoutes
}