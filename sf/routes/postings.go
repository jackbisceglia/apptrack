package routes

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/jackbisceglia/internship-tracker/crud"
	"github.com/jackbisceglia/internship-tracker/util"
)

type PostResponse struct {
	Postings    []crud.PostingData `json:"postings"`
	HasNextPage bool               `json:"hasNextPage"`
}

func PostingRoutes(router *mux.Router, db *sql.DB) {
	HandleMultiplePostingRoutes := util.RouterUtils(router)
	GetPostings, InsertPosting := crud.PostingsCrud(db)

	getPostingsHandler := func(w http.ResponseWriter, r *http.Request) {
		var page int
		pageParam, err := strconv.Atoi(r.URL.Query().Get("page"))
		if err != nil || pageParam <= 0 {
			page = -1
		} else {
			page = pageParam
		}

		listPreference := mux.Vars(r)["listPreference"]
		if listPreference != string(crud.INTERN) && listPreference != string(crud.NEWGRAD) && listPreference != string(crud.BOTH) {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		postings, hasMoreData := GetPostings(crud.ListPreference(listPreference), page)

		res, err := json.Marshal(PostResponse{postings, hasMoreData})
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(res)
	}

	postPostingsHandler := func(w http.ResponseWriter, r *http.Request) {
		var postingData []crud.PostingData

		err := json.NewDecoder(r.Body).Decode(&postingData)
		if err != nil {
			fmt.Printf("error here\n")
			fmt.Printf("%v\n", postingData)
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
	}

	HandleMultiplePostingRoutes([]string{"", "/{listPreference}"}, getPostingsHandler, "GET", false)
	HandleMultiplePostingRoutes([]string{"", "/"}, postPostingsHandler, "POST", false)
}
