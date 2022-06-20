package crud

import (
	"database/sql"
	"fmt"
	"strconv"
)

type PostingData struct {
	Company string `json:"company"`
	Location string `json:"location"`
	Notes string `json:"notes"`
	IsIntern bool `json:"isIntern"`
	Url string `json:"url"`
}

func PostingsCrud(db *sql.DB) (func([]PostingData) bool){
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
				queryFields = fmt.Sprintf("%s$%s,", queryFields, strconv.Itoa(n + j + 1))
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

	return InsertPosting
}