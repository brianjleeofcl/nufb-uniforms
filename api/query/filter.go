package query

import (
	"fmt"
	"strings"
)

const IsNotNull = "IS NOT NULL"
const IsTrue = "IS TRUE" // used for identification only

type QueryFilter interface {
	GetSQLString() (string, []interface{})
}

type SingleRowFilter struct {
	Values map[string]interface{}
}

func (f SingleRowFilter) mapValues() (string, []interface{}) {
	if len(f.Values) == 0 {
		return "", []interface{}{}
	}
	equals := []string{}
	vals := []interface{}{}
	notNull := []string{}
	isTrue := []string{}
	for k, v := range f.Values {
		if v == IsNotNull {
			notNull = append(notNull, fmt.Sprintf("%s %s", k, IsNotNull))
			continue
		}
		if v == IsTrue {
			isTrue = append(isTrue, k)
			continue
		}
		equals = append(equals, k)
		vals = append(vals, v)
	}
	for i, v := range equals {
		equals[i] = fmt.Sprintf("%s = $%d", v, i+1)
	}
	equals = append(equals, notNull...)
	equals = append(equals, isTrue...)
	return fmt.Sprintf("WHERE %s", strings.Join(equals, " AND ")), vals
}

func (f SingleRowFilter) GetSQLString() (string, []interface{}) {
	return f.mapValues()
}

type Filter struct {
	SingleRowFilter
	OrderBy string
	Limit   int
	Offset  int
}

func (f Filter) GetSQLString() (string, []interface{}) {
	parts := []string{}
	args := []interface{}{}
	if len(f.Values) > 0 {
		where, vals := f.mapValues()
		parts = append(parts, where)
		args = append(args, vals...)
	}
	if len(f.OrderBy) > 0 {
		parts = append(parts, fmt.Sprintf("ORDER BY %s", f.OrderBy))
	}
	if f.Limit > 0 {
		parts = append(parts, fmt.Sprintf("LIMIT $%d", len(args)+1))
		args = append(args, f.Limit)
	}
	if f.Offset > 0 {
		parts = append(parts, fmt.Sprintf("OFFSET $%d", len(args)+1))
		args = append(args, f.Offset)
	}

	return strings.Join(parts, " "), args
}
