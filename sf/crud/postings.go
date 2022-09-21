package crud

import (
	"database/sql"
	"fmt"
	"log"
	"strconv"
	"strings"
)

func min(a, b int) int {
	if a < b {
		return a
	}
	return b
}

type PostingData struct {
	Company   string `json:"company"`
	Location  string `json:"location"`
	Notes     string `json:"notes"`
	IsIntern  bool   `json:"isIntern"`
	Url       string `json:"url"`
	Id        string
	CreatedAt string `json:"createdAt"`
}

type ListPreference string

const (
	INTERN  ListPreference = "intern"
	NEWGRAD ListPreference = "newgrad"
	BOTH    ListPreference = "both"
)

func PostingsCrud(db *sql.DB) (func(ListPreference, int) ([]PostingData, bool), func([]PostingData) bool) {
	GetPostings := func(listPreference ListPreference, page int) ([]PostingData, bool) {
		var posting PostingData
		var query strings.Builder

		query.WriteString("SELECT * FROM postings")

		if listPreference == INTERN {
			query.WriteString(" WHERE isIntern = true")
		} else if listPreference == NEWGRAD {
			query.WriteString(" WHERE isIntern = false")
		}

		offset := (page - 1) * 10

		if page != -1 {
			query.WriteString(fmt.Sprintf(" ORDER BY \"createdAt\" desc LIMIT 11 OFFSET %d", offset))
		}

		rows, err := db.Query(query.String())
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var postings []PostingData
		for rows.Next() {
			err := rows.Scan(&posting.Id, &posting.Company, &posting.Location, &posting.Notes, &posting.CreatedAt, &posting.IsIntern, &posting.Url)
			if err != nil {
				log.Fatal(err)
			}

			postings = append(postings, posting)
		}

		fmt.Printf("Query: %s %d\n", query.String(), len(postings))
		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		// If no pagination, return all, else return 10 and hasNextPage
		if page == -1 {
			return postings, true
		} else {
			return postings[:min(10, len(postings))], len(postings) > 10
		}
	}

	InsertPosting := func(posts []PostingData) bool {
		SQL_STATEMENT := `
			INSERT INTO postings (company, location, notes, isintern, url)
			VALUES`

		numFields := 5
		values := []interface{}{}
		for i, post := range posts {
			values = append(values, post.Company, post.Location, post.Notes, post.IsIntern, post.Url)

			n := numFields * i

			queryFields := "("
			for j := 0; j < numFields; j++ {
				queryFields = fmt.Sprintf("%s$%s,", queryFields, strconv.Itoa(n+j+1))
			}
			queryFields = queryFields[:len(queryFields)-1] + `),`
			SQL_STATEMENT += queryFields
		}

		SQL_STATEMENT = SQL_STATEMENT[:len(SQL_STATEMENT)-1]

		_, err := db.Exec(SQL_STATEMENT, values...)
		if err != nil {
			fmt.Printf("%v", err)
			return false
		}

		return true
	}

	return GetPostings, InsertPosting
}
