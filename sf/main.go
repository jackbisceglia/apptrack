package main

import (
	"database/sql"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	routes "github.com/jackbisceglia/internship-tracker/routes"
	_ "github.com/lib/pq"

	"github.com/joho/godotenv"
)

var PORT string = ":8080"

type DBAuth struct {
	db_host string 
	db_port string 
	db_username string 
	db_password string 
	db_name string
}

// Return instance of SubRouter using passed in subroute
func makeSubRouter(subPath string, parent *mux.Router) *mux.Router {
	return parent.PathPrefix(fmt.Sprintf("/%s", subPath)).Subrouter()
}

func loadEnvVars() DBAuth {
	err := godotenv.Load(".env")

	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	return DBAuth{
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USERNAME"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
	}

}

// Entry of API
func apiEntry() {
	v := loadEnvVars()

	psqlInfo := fmt.Sprintf("host=%s port=%s user=%s "+"password=%s dbname=%s sslmode=disable", v.db_host, v.db_port, v.db_username, v.db_password, v.db_name)

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}

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
	routes.UserRoutes(userRouter, db)
	routes.PostingRoutes(postingsRouter, db)

	// Listen at 8080
	http.ListenAndServe(PORT, router)
}

func main() {
	apiEntry()
}