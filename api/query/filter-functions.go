package query

import (
	"net/url"
	"strconv"
	"strings"

	"github.com/brianjleeofcl/nufb-uniform-tracker/datamodel"
)

func NewPaginationFilter(kv map[string][]string) (p PaginationFilter, err error) {
	p.OrderBy = kv["orderBy"][0]
	if offset := kv["offset"][0]; len(offset) > 0 {
		p.Offset, err = strconv.Atoi(offset)
		if err != nil {
			return PaginationFilter{}, err
		}
	}
	if limit := kv["limit"][0]; len(limit) > 0 {
		p.Limit, err = strconv.Atoi(limit)
		if err != nil {
			return PaginationFilter{}, err
		}
	}
	return p, err
}

func GetPaginationFromRange(orderBy, rowRange string) (p PaginationFilter, err error) {
	p.OrderBy = orderBy
	topSkip := strings.Split(rowRange, "-")

	p.Offset, err = strconv.Atoi(topSkip[0])
	if err != nil {
		return PaginationFilter{}, err
	}
	rangeEnd, err := strconv.Atoi(topSkip[1])
	if err != nil {
		return PaginationFilter{}, err
	}
	p.Limit = rangeEnd - p.Offset
	return p, err
}

func ListAllInOrder(orderBy string) (p PaginationFilter) {
	p.OrderBy = orderBy
	return p
}

func GetFirstInOrder(orderBy string) (p PaginationFilter) {
	p.OrderBy = orderBy
	p.Limit = 1
	return p
}

// func NewResultFilter(s datamodel.Filterable, u url.Values, defaults map[string]string) (ResultFilter, error) {
// 	input, err := NewResultFilterFromQueryParam(s, u)
// 	if err != nil {
// 		return ResultFilter{}, err
// 	}
// 	coded, err2 := NewResultFilterFromKeyValues(s, defaults)
// 	if err2 != nil {
// 		return ResultFilter{}, err
// 	}
// 	return merge(coded, input), nil
// }

func NewResultFilterFromKeyValues(s datamodel.Filterable, kv map[string]string) (r ResultFilter, err error) {
	for param, value := range kv {
		if s.CheckFilter(param) {
			var mapper func(int) (int, string)
			var parsedValue interface{}
			mapper, parsedValue, err = s.GetSQLMapper(param)([]string{value})
			r.Filters = append(r.Filters, FilterColumn{param, mapper, parsedValue})
			if err != nil {
				return ResultFilter{}, err
			}
		}
	}
	return r, err
}

func NewResultFilterFromQueryParam(s datamodel.Filterable, u url.Values) (r ResultFilter, err error) {
	for param, value := range u {
		if s.CheckFilter(param) {
			var mapper func(int) (int, string)
			var parsedValue interface{}
			mapper, parsedValue, err = s.GetSQLMapper(param)(value)
			r.Filters = append(r.Filters, FilterColumn{param, mapper, parsedValue})
			if err != nil {
				return ResultFilter{}, err
			}
		}
	}
	return r, err
}

func FilterGameResultsFromDate(season, week string) (ResultFilter, error) {
	var dest datamodel.Game
	return NewResultFilterFromKeyValues(dest, map[string]string{"season": season, "week": week})
}

// func merge(base Filter, override Filter) Filter {
// 	filter := map[string]FilterColumn{}
// 	for _, v := range base.f {
// 		filter[v.Param] = v
// 	}
// 	for _, v := range override.ValueFilter {
// 		filter[v.Param] = v
// 	}
// 	values := []Filter{}
// 	for _, v := range filter {
// 		values = append(values, v)
// 	}
// 	orderBy := base.OrderBy
// 	if len(override.OrderBy) > 0 {
// 		orderBy = override.OrderBy
// 	}
// 	offset := base.Offset
// 	if override.Offset > 0 {
// 		offset = override.Offset
// 	}
// 	limit := base.Limit
// 	if override.Limit > 0 {
// 		limit = override.Limit
// 	}

// 	return ResultFilter{values, orderBy, offset, limit}
// }
