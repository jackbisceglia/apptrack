package userUtils

type user struct {
	name     string
	listType string
}

var arr = []user{
	user{"JACK", "NEWGRAD"}, user{"NABIL", "INTERN"}, user{"LAWRENCE", "INTERN"},
}

func GetUsersByList(listType string) []string {
	validUsers := []string{}
	for _, val := range arr {
		if val.listType == listType {
			validUsers = append(validUsers, val.name)
		}
	}
	return validUsers
}
