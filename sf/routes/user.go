package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/jackbisceglia/internship-tracker/crud"

	"github.com/gorilla/mux"
)

type Response struct {
	Success bool
}

type SignUpData struct {
	EmailAddress string `json:"emailAddress"`
	ListPreferences []string `json:"listPreferences"`
}

func UserRoutes(router *mux.Router, db *sql.DB) {
	// Pass db instance to UserCrud to get back User Crud Functions
	GetUsersByList, InsertUser := crud.UserCrud(db)

	// GET BY LIST TYPE
	router.HandleFunc("/{listType}", func(w http.ResponseWriter, r *http.Request) {
		listType := mux.Vars(r)["listType"]
		
		users := GetUsersByList(listType)

		fmt.Printf("%v", users)

		w.Header().Set("Content-Type", "application/json")
		res, err := json.Marshal(users)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(res)

	}).Methods("GET")

	// POST USER INTO DB
	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Gather info from incoming request
		var signUpData SignUpData

		// Check for errors, and decode JSON into variable typed as struct
		err := json.NewDecoder(r.Body).Decode(&signUpData)
		if err != nil {
			fmt.Printf("error here")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Insert user into database
		success := InsertUser(signUpData.EmailAddress, signUpData.ListPreferences)

		// Set Response Type on Header
		w.Header().Set("Content-Type", "application/json")

		res, err := json.Marshal(Response{Success: success})

		if !success {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	
		w.Header().Set("Content-Type", "application/json")
		w.Write(res)

	}).Methods("POST")
}