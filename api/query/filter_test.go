package query_test

import (
	"testing"

	"github.com/brianjleeofcl/nufb-uniform-tracker/query"
	"github.com/stretchr/testify/assert"
)

func TestFilters(t *testing.T) {
	var tests = []struct {
		f        query.QueryFilter
		resQuery string
		args     []interface{}
	}{
		{
			query.Filter{
				query.SingleRowFilter{map[string]interface{}{"season": 2011, "final": query.IsTrue}},
				"season DESC", 10, 0,
			},
			"WHERE season = $1 AND final ORDER BY season DESC LIMIT $2",
			[]interface{}{2011, 10},
		},
		{
			query.SingleRowFilter{
				map[string]interface{}{
					"season": 2010,
					"week":   5,
					"a":      "b",
				}},
			"WHERE season = $1 AND week = $2 AND a = $3",
			[]interface{}{2010, 5, "b"},
		},
		{
			query.Filter{query.SingleRowFilter{}, "", 10, 40},
			"LIMIT $1 OFFSET $2",
			[]interface{}{10, 40},
		},
		{
			*new(query.Filter),
			"", []interface{}{},
		},
	}

	for _, v := range tests {
		query, arg := v.f.GetSQLString()
		assert.Equal(t, query, v.resQuery)
		assert.Equal(t, arg, v.args)
	}
}
