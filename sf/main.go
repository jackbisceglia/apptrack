package main

import (
	_ "database/sql"
	"fmt"
	"io"
	"net/http"

	"github.com/gorilla/mux"
	routes "github.com/jackbisceglia/internship-tracker/routes"
	_ "github.com/lib/pq"
)

var PORT string = "8080"

const (
	host     = "localhost"
	port     = 5432
	user     = "postgres"
	password = "your-password"
	dbname   = "calhounio_demo"
)

// Return instance of SubRouter using passed in subroute
func makeSubRouter(subPath string, parent *mux.Router) *mux.Router {
	return parent.PathPrefix(fmt.Sprintf("/%s", subPath)).Subrouter()
}

// Entry of API
func apiEntry() {
	// Declare Router and SubRouters
	router := mux.NewRouter()
	userRouter := makeSubRouter("users", router)
	postingsRouter := makeSubRouter("postings", router)
	
	// Root URL Handler
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "Hello World")
	})

	// Invoke Route Listeners, passing in DB Instance and SubRotuers
	routes.UserRoutes(userRouter, "db")
	routes.PostingRoutes(postingsRouter)

	// Listen at 8080
	http.ListenAndServe(PORT, router)
}

func main() {
	apiEntry()
}