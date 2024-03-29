package crud

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"net/mail"
	"strings"

	"github.com/lib/pq"
)

type User struct {
	Id             string `json:"id"`
	CreatedAt      string `json:"createdAt"`
	EmailAddress   string `json:"emailAddress"`
	PreferenceList string `json:"preferenceList"`
}

func UserCrud(db *sql.DB) (func(string) []User, func(string, []string) error, func(string, string) error) {
	GetUsersByList := func(preferenceList string) []User {
		var user User
		db_values := []interface{}{}
		SQL_STATEMENT := `
			SELECT * FROM users
		`

		if preferenceList != "" {
			SQL_STATEMENT = fmt.Sprintf("%s WHERE preferenceList = $1 or preferenceList = $2", SQL_STATEMENT)
			db_values = append(db_values, "BOTH", preferenceList)
		}

		rows, err := db.Query(SQL_STATEMENT, db_values...)
		if err != nil {
			log.Fatal(err)
		}
		defer rows.Close()

		var users []User
		for rows.Next() {
			err := rows.Scan(&user.Id, &user.CreatedAt, &user.EmailAddress, &user.PreferenceList)
			if err != nil {
				log.Fatal(err)
			}

			users = append(users, user)
		}

		if err := rows.Err(); err != nil {
			log.Fatal(err)
		}

		return users
	}

	EmailIsValid := func(email string) bool {
		_, err := mail.ParseAddress(email)
		return err == nil
	}

	InsertUser := func(emailAddress string, listPreferences []string) error {
		var preferenceString string

		if !EmailIsValid(emailAddress) {
			return errors.New("Invalid email address")
		}

		if len(listPreferences) > 1 {
			preferenceString = "BOTH"
		} else if listPreferences[0] == "newgrad" || listPreferences[0] == "intern" {
			preferenceString = strings.ToUpper(listPreferences[0])
		} else {
			return errors.New("Invalid preference choice")
		}

		SQL_STATEMENT := `
			INSERT INTO users (emailaddress, preferencelist)
			VALUES ($1, $2)
		`

		_, err := db.Exec(SQL_STATEMENT, emailAddress, preferenceString)
		if pqErr, ok := err.(*pq.Error); ok {
			fmt.Println("pq error:", pqErr.Code.Name())
			errMessage := "Something went wrong"
			if pqErr.Code.Name() == "unique_violation" {
				errMessage = "That email address is already subscribed"
			}

			return errors.New(errMessage)
		}

		return nil
	}

	ValidateDeletion := func(emailAddress string, userId string) error {
		var userIdByEmail string
		row := db.QueryRow("SELECT id FROM users WHERE emailAddress = $1", emailAddress)
		err := row.Scan(&userIdByEmail)

		if err == sql.ErrNoRows {
			return errors.New("That email address is not subscribed")
		} else if userId != userIdByEmail {
			return errors.New("You do not have permission to unsubscribe that email address")
		} else {
			return nil
		}
	}

	DeleteUser := func(emailAddress string, userId string) error {
		validationError := ValidateDeletion(emailAddress, userId)
		if validationError != nil {
			return validationError
		}

		SQL_STATEMENT := `
			DELETE FROM users WHERE emailAddress = $1
		`

		_, err := db.Exec(SQL_STATEMENT, emailAddress)
		if err != nil {
			fmt.Printf("%v", err)
			return errors.New("There was an error unsubscribing")
		}

		return nil
	}

	return GetUsersByList, InsertUser, DeleteUser
}
