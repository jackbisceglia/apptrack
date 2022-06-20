package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jackbisceglia/internship-tracker/crud"
)

func PostingRoutes(router *mux.Router, db *sql.DB) {
	InsertPosting := crud.PostingsCrud(db)

	router.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		var postingData []crud.PostingData

		err := json.NewDecoder(r.Body).Decode(&postingData)
		if err != nil {
			fmt.Printf("error here")
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		success := InsertPosting(postingData)

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
	})
}