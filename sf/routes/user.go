package routes

import (
	"net/http"

	"github.com/gorilla/mux"
)

func UserRoutes(router *mux.Router) {
	router.HandleFunc("/{listType}", func(w http.ResponseWriter, r *http.Request) {
		// listType := mux.Vars(r)["listType"]
		// _ =

		// // userEmails := userUtils.GetUsersByList(listType)

		// data, err := json.Marshal(userEmails)
		// if err != nil {
		// 	log.Println("could not marshal", err)
		// 	return
		// }

		w.WriteHeader(http.StatusOK)
		// w.Write(data)
	}).Methods("GET")
}