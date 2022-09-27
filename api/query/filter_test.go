package query_test

import (
	"net/url"
	"testing"

	"github.com/brianjleeofcl/nufb-uniform-tracker/datamodel"
	"github.com/brianjleeofcl/nufb-uniform-tracker/query"
	"github.com/stretchr/testify/assert"
)

type MockDatamodel struct {
}

func (m MockDatamodel) CheckFilter(col string) bool {
	return map[string]bool{
		"season": true,
		"week":   true,
		"final":  true,
	}[col]
}
func (m MockDatamodel) GetSQLMapper(col string) func([]string) (func(int) (int, string), interface{}, error) {
	return map[string]func([]string) (func(int) (int, string), interface{}, error){
		"season": datamodel.SQLNumberEqual("season"),
		"week":   datamodel.SQLNumberEqual("week"),
		"final":  datamodel.SQLBoolean("final"),
	}[col]
}

func TestFilters(t *testing.T) {
	var tests = []struct {
		f        url.Values
		resQuery string
		args     []interface{}
	}{
		{
			url.Values{
				"season":  []string{"2011"},
				"final":   []string{"true"},
				"orderBy": []string{"season DESC"},
				"limit":   []string{"10"},
				"offset":  []string{"0"},
			},
			"WHERE season = $1 AND final ORDER BY season DESC LIMIT $2",
			[]interface{}{2011, 10},
		},
		{
			url.Values{
				"season": []string{"2010"},
				"week":   []string{"5"},
				"a":      []string{"b"},
			},
			"WHERE season = $1 AND week = $2 AND a = $3",
			[]interface{}{2010, 5, "b"},
		},
		{
			url.Values{
				"limit":  []string{"10"},
				"offset": []string{"40"},
			},
			"LIMIT $1 OFFSET $2",
			[]interface{}{10, 40},
		},
		{
			url.Values{"somethingElse": []string{"not part of the model"}},
			"", []interface{}{},
		},
	}

	for _, v := range tests {
		filter, parsingErr := query.NewResultFilterFromQueryParam(MockDatamodel{}, v.f)
		if assert.NoError(t, parsingErr) {
			query, arg := filter.GetSQLString()
			assert.Equal(t, query, v.resQuery)
			assert.Equal(t, arg, v.args)
		}
	}
}
