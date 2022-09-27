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
	queryParam := req.URL.Query()
	return query.QueryGameSummary(req.Context(), urlParam{"range"}.getVal(req), queryParam)
})

var gameDetailHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	return query.QueryGameDetail(req.Context(), urlParam{"season"}.getVal(req), urlParam{"week"}.getVal(req))
})

var latestGameHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	return query.QueryLatestGame(req.Context()), nil
})

var gameIDHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	return query.QueryGameID(req.Context(), urlParam{"season"}.getVal(req), urlParam{"week"}.getVal(req))
})

var uniformListHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	return query.QueryUniforms(req.Context()), nil
})

var uniformDetailHanlder = queryHandler(func(req *http.Request) ([]byte, error) {
	selectLevel := urlParam{"selection"}.getVal(req)
	if selectLevel != "summary" && selectLevel != "detail" {
		return nil, errors.New("invalid selection")
	}

	return query.QueryUniformDetail(req.Context(), urlParam{"helmet"}.getVal(req), urlParam{"jersey"}.getVal(req), urlParam{"pants"}.getVal(req), selectLevel)
})

var uniformTimelineHandler = queryHandler(func(req *http.Request) ([]byte, error) {
	return query.QueryUniformTimeline(req.Context()), nil
})
