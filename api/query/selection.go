package query

import (
	"fmt"
	"strings"

	"github.com/brianjleeofcl/nufb-uniform-tracker/datamodel"
)

type Selection struct {
	Identities []string
	Pointers   *[]interface{}
	Query      string
	Args       []interface{}
}

func newSelection(dest datamodel.Selectable, selection []string, filter SQLFilter) *Selection {
	s := new(Selection)
	s.Identities = selection

	pointers := make([]interface{}, len(selection))
	pointerMap := dest.GetPointerMap()
	for i, v := range selection {
		field := pointerMap[v]
		pointers[i] = &field
	}
	s.Pointers = &pointers

	cols := dest.GetColumns(selection)
	table := dest.GetTableName()
	queryParts := []string{
		fmt.Sprintf("SELECT %s", strings.Join(cols, ", ")),
		fmt.Sprintf("FROM %s", table),
	}
	filterQuery, arg := filter.GetSQLString()
	if len(filterQuery) > 0 {
		queryParts = append(queryParts, filterQuery)
	}
	s.Query = strings.Join(queryParts, " ")
	s.Args = arg

	return s
}

func (s *Selection) BuildResult() map[string]interface{} {
	data := map[string]interface{}{}
	for i, v := range *s.Pointers {
		data[s.Identities[i]] = *v.(*interface{})
	}
	return data
}
