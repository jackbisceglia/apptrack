package main

import (
	"fmt"
	"io"
	"net/http"

	routes "github.com/jackbisceglia/internship-tracker/routes"

	"github.com/gorilla/mux"
)

func makeSubRouter(subPath string, parent *mux.Router) *mux.Router {
	return parent.PathPrefix(fmt.Sprintf("/%s", subPath)).Subrouter()
}


func apiEntry() {
	rtr := mux.NewRouter()
	userRtr := makeSubRouter("users", rtr)
	postingsRtr := makeSubRouter("postings", rtr)
	
	rtr.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "Hello World")
	})

	routes.UserRoutes(userRtr)
	routes.PostingRoutes(postingsRtr)

	http.ListenAndServe(":8080", rtr)
}

func main() {
	apiEntry()
}