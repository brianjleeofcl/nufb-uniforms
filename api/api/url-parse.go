package api

import (
	"strconv"
	"strings"
)

var parseGameSeasonWeek = func(season string, week string) (int, int, error) {
	parsedSeason, err := strconv.Atoi(season)
	if err != nil {
		return 0, 0, err
	}
	parsedWeek, err := strconv.Atoi(week)
	if err != nil {
		return 0, 0, err
	}
	return parsedSeason, parsedWeek, nil
}

func parseRangeParam(rangeString string) (top, skip int, err error) {
	topSkip := strings.Split(rangeString, "-")

	skip, err = strconv.Atoi(topSkip[0])
	if err != nil {
		return 0, 0, err
	}
	rangeEnd, err := strconv.Atoi(topSkip[1])
	if err != nil {
		return 0, 0, err
	}
	top = rangeEnd - skip
	return top, skip, nil
}
