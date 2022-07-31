package routes

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"github.com/jackbisceglia/internship-tracker/crud"
	"github.com/jackbisceglia/internship-tracker/util"

	"github.com/gorilla/mux"
)

type Response struct {
	Success bool
	ServerError string
}

type SignUpData struct {
	EmailAddress string `json:"emailAddress"`
	ListPreferences []string `json:"listPreferences"`
}

type UnsubscribePayload struct {
	UserId string `json:"userId"`
	EmailAddress string `json:"emailAddress"`
}

func ResponseMarshal() {

}

func UserRoutes(router *mux.Router, db *sql.DB) {
	// Pass db instance to UserCrud to get back User Crud Functions
	HandleMultipleUserRoutes := util.RouterUtils(router)
	GetUsersByList, InsertUser, DeleteUser := crud.UserCrud(db)

	getUsersHandler := func(w http.ResponseWriter, r *http.Request) {
		if !util.ValidateUserRequest(mux.Vars(r)["apiKey"]) {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		listType := strings.ToUpper(mux.Vars(r)["listType"])
		
		users := GetUsersByList(listType)
		w.Header().Set("Content-Type", "application/json")
		res, err := json.Marshal(users)

		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.WriteHeader(http.StatusOK)
		w.Write(res)

	}

	postUserHandler := func (w http.ResponseWriter, r *http.Request) {
		// Gather info from incoming request
		var signUpData SignUpData

		// decode incoming JSON into signUpData
		decodeError := json.NewDecoder(r.Body).Decode(&signUpData)
		if decodeError != nil {
			http.Error(w, decodeError.Error(), http.StatusBadRequest)
			return
		}

		// Insert user into database
		insertionError := InsertUser(signUpData.EmailAddress, signUpData.ListPreferences)
		if insertionError != nil {
			http.Error(w, insertionError.Error(), http.StatusConflict)
			return
		}

		res, responseMarshalError := json.Marshal(Response{Success: true})
		if responseMarshalError != nil {
			http.Error(w, responseMarshalError.Error(), http.StatusInternalServerError)
			return
		}
	
		w.Header().Set("Content-Type", "application/json")
		w.Write(res)
	}

	deleteUserHandler := func(w http.ResponseWriter, r *http.Request) {
		var unsubscribePayload UnsubscribePayload

		// Check for errors, and decode JSON into variable typed as struct
		err := json.NewDecoder(r.Body).Decode(&unsubscribePayload)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		// Delete user from database
		deletionError := DeleteUser(unsubscribePayload.EmailAddress, unsubscribePayload.UserId)

		if deletionError != nil {
			http.Error(w, deletionError.Error(), http.StatusConflict)
			return
		}
	
		w.Header().Set("Content-Type", "application/json")
		res, err := json.Marshal(Response{Success: deletionError == nil})
			
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
		}

		w.Write(res)
	}


	// ROUTE
	HandleMultipleUserRoutes([]string{"", "/"}, postUserHandler, "POST", true)
	HandleMultipleUserRoutes([]string{"/{apiKey}", "/{apiKey}/{listType}"}, getUsersHandler, "GET", false)
	HandleMultipleUserRoutes([]string{"", "/"}, deleteUserHandler, "DELETE", false)
}