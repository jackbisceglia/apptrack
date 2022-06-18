package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	userUtils "github.com/jackbisceglia/internship-tracker/crud"

	"github.com/gorilla/mux"
)

func makeSubRouter(subPath string, parent *mux.Router) *mux.Router {
	return parent.PathPrefix(fmt.Sprintf("/%s", subPath)).Subrouter()
}

func userRoutes(router *mux.Router) {
	getUserByList := func (w http.ResponseWriter, r *http.Request) {
		listType := mux.Vars(r)["listType"]

		userEmails := userUtils.GetUsersByList(listType)

		data, err := json.Marshal(userEmails)
		if err != nil {
			log.Println("could not marshal", err)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Write(data)
	}
	router.HandleFunc("/{listType}", getUserByList).Methods("GET")
}

func postingsRoutes(router *mux.Router) {

}

func apiEntry() {
	rtr := mux.NewRouter()
	userRtr := makeSubRouter("users", rtr)
	postingsRtr := makeSubRouter("postings", rtr)

	userRoutes(userRtr)
	postingsRoutes(postingsRtr)

	http.ListenAndServe(":8080", rtr)
}

func main() {
	apiEntry()
}