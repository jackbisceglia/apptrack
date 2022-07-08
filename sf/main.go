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
	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
)


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
	envErr := godotenv.Load()
	if envErr != nil {
		log.Fatalf("Error loading .env file")
	}
	v := loadEnvVars()
	var PORT string = ":" + os.Getenv("PORT")


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
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		io.WriteString(w, "Hello World")
	})

	// Invoke Route Listeners, passing in DB Instance and SubRotuers
	routes.UserRoutes(userRouter, db)
	routes.PostingRoutes(postingsRouter, db)

	corsOpts := cors.New(cors.Options{
		AllowedOrigins: []string{os.Getenv("ALLOWED_ORIGIN")}, //you service is available and allowed for this base url 
		AllowedMethods: []string{
			http.MethodGet,//http methods for your app
			http.MethodPost,
			http.MethodPut,
			http.MethodPatch,
			http.MethodDelete,
			http.MethodOptions,
			http.MethodHead,
		},
	
		AllowedHeaders: []string{
			"*",//or you can your header key values which you are using in your application
	
		},
	})

	// Listen at 8080
	http.ListenAndServe(PORT, corsOpts.Handler(router))
	// http.ListenAndServe(PORT, router)
}

func main() {
	apiEntry()
}