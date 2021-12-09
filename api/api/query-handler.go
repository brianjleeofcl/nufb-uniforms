package api

import (
	"errors"
	"log"
	"net/http"

	"github.com/brianjleeofcl/nufb-uniform-tracker/query"
)

func queryHandler(dataQuery func(req *http.Request) ([]byte, error)) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				log.Print(r)
				res.WriteHeader(http.StatusInternalServerError)
			}
		}()

		if !lastModified.IsAfter(req.Header.Get("If-Modified-Since")) {
			res.WriteHeader(http.StatusNotModified)
			return
		}

		rows, err := dataQuery(req)
		if err != nil {
			res.WriteHeader(http.StatusBadRequest)
			return
		}

		res.Header().Add("Content-Type", "application/json")
		res.Header().Add("Cache-Control", "no-cache, public")
		res.Header().Add("Last-Modified", lastModified.Cache())
		res.Write(rows)
	}
}

var gameSummaryHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	limit, offset, err := parseRangeParam(urlParam{"range"}.getVal(req))
	if err != nil {
		return nil, err
	}

	return query.QueryGameSummary(req.Context(), limit, offset), nil
})

var gameDetailHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	season, week, err := parseGameSeasonWeek(
		urlParam{"season"}.getVal(req),
		urlParam{"week"}.getVal(req),
	)
	if err != nil {
		return nil, err
	}
	return query.QueryGameDetail(req.Context(), season, week), nil
})

var latestGameHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	return query.QueryLatestGame(req.Context()), nil
})

var gameIDHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	season, week, err := parseGameSeasonWeek(
		urlParam{"season"}.getVal(req),
		urlParam{"week"}.getVal(req),
	)
	if err != nil {
		return nil, err
	}
	return query.QueryGameID(req.Context(), season, week), nil
})

var uniformListHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	return query.QueryUniforms(req.Context()), nil
})

var uniformDetailHanlder = queryHandler(func(req *http.Request) ([]byte, error) {
	helmet := urlParam{"helmet"}.getVal(req)
	jersey := urlParam{"jersey"}.getVal(req)
	pants := urlParam{"pants"}.getVal(req)

	selectLevel := urlParam{"selection"}.getVal(req)
	if selectLevel != "summary" && selectLevel != "detail" {
		return nil, errors.New("invalid selection")
	}

	return query.QueryUniformDetail(req.Context(), helmet, jersey, pants, selectLevel), nil
})

var uniformTimelineHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	return query.QueryUniformTimeline(req.Context()), nil
})
