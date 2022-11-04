package query

import (
	"fmt"
	"strings"
)

type SQLFilter interface {
	GetSQLString() (string, []interface{})
}

type FilterColumn struct {
	Param  string
	Mapper func(int) (int, string)
	Value  interface{}
}

type PaginationFilter struct {
	OrderBy       string
	Limit         int
	Offset        int
	ArgumentIndex int
}

func (f PaginationFilter) GetSQLString() (string, []interface{}) {
	if f.ArgumentIndex == 0 {
		f.ArgumentIndex = 1
	}
	parts := []string{}
	args := []interface{}{}
	if len(f.OrderBy) > 0 {
		parts = append(parts, fmt.Sprintf("ORDER BY %s", f.OrderBy))
	}
	if f.Limit > 0 {
		parts = append(parts, fmt.Sprintf("LIMIT $%d", f.ArgumentIndex))
		args = append(args, f.Limit)
		f.ArgumentIndex += 1
	}
	if f.Offset > 0 {
		parts = append(parts, fmt.Sprintf("OFFSET $%d", f.ArgumentIndex))
		args = append(args, f.Offset)
		f.ArgumentIndex += 1
	}

	return strings.Join(parts, " "), args
}

func (p PaginationFilter) Upsert(next PaginationFilter) (merged PaginationFilter) {
	if merged.OrderBy = p.OrderBy; len(next.OrderBy) > 0 {
		merged.OrderBy = next.OrderBy
	}
	if merged.Limit = p.Limit; next.Limit > 0 {
		merged.Limit = next.Limit
	}
	if merged.Offset = p.Offset; next.Offset > 0 {
		merged.Offset = next.Offset
	}

	return merged
}

type ResultFilter struct {
	Filters []FilterColumn
}

func (f ResultFilter) GetSQLString() (string, []interface{}) {
	args := []interface{}{}
	if len(f.Filters) == 0 {
		return "", args
	}
	start := 1
	clauses := make([]string, len(f.Filters))
	for i, filter := range f.Filters {
		next, clause := filter.Mapper(start)
		clauses[i] = clause
		if next != start {
			start = next
			args = append(args, filter.Value)
		}
	}
	return fmt.Sprintf("WHERE %s", strings.Join(clauses, " AND ")), args
}

func (f ResultFilter) Upsert(next ResultFilter) (merged ResultFilter) {
	filter := map[string]FilterColumn{}
	for _, v := range f.Filters {
		filter[v.Param] = v
	}
	for _, v := range next.Filters {
		filter[v.Param] = v
	}
	values := []FilterColumn{}
	for _, v := range filter {
		values = append(values, v)
	}
	merged.Filters = values

	return merged
}

type Filter struct {
	ResultFilter
	PaginationFilter
}

func (f Filter) GetSQLString() (string, []interface{}) {
	whereClause, args := f.ResultFilter.GetSQLString()
	f.ArgumentIndex = len(args) + 1
	if len(whereClause) == 0 {
		return f.PaginationFilter.GetSQLString()
	}

	pagingClause, pagingInput := f.PaginationFilter.GetSQLString()
	parts := []string{whereClause, pagingClause}
	return strings.Join(parts, " "), append(args, pagingInput...)
}

func (f Filter) Upsert(next Filter) (merged Filter) {
	merged.PaginationFilter = f.PaginationFilter.Upsert(next.PaginationFilter)
	merged.ResultFilter = f.ResultFilter.Upsert(next.ResultFilter)
	return merged
}
