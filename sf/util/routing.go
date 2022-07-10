package util

import (
	"net/http"

	"github.com/gorilla/mux"
)

func RouterUtils(router *mux.Router) func([]string, func(http.ResponseWriter, *http.Request), string) {
	HandleMultipleRoutes := func(routes []string, handler func(http.ResponseWriter, *http.Request), method string) {
		for _, route := range routes {
			router.HandleFunc(route, handler).Methods(method)
		}
	}

	return HandleMultipleRoutes
}
