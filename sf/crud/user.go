package crud

func UserCrud(db string) (func(string) []string, func(string, []string) bool) {
	GetUsersByList := func(listType string) []string {
		return nil
	}

	InsertUser := func(emailAddress string, listPreferences []string) bool {
		var preference string
		_ = preference

		if len(listPreferences) > 1 {
			preference = "BOTH"
		} else {
			preference = listPreferences[0]
		}

		return true
	}

	return GetUsersByList, InsertUser
}
