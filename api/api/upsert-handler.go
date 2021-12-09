package api

import (
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"strconv"

	"github.com/brianjleeofcl/nufb-uniform-tracker/datamodel"
	"github.com/brianjleeofcl/nufb-uniform-tracker/query"
)

func readReqBody(req *http.Request) []byte {
	length := req.ContentLength
	body := make([]byte, length)
	_, err := req.Body.Read(body)
	if err != nil && !errors.Is(err, io.EOF) {
		log.Panic(err)
	}
	return body
}

func upsertionHandler(upsert func([]byte, *http.Request) (int, error)) http.HandlerFunc {
	return func(res http.ResponseWriter, req *http.Request) {
		defer func() {
			if r := recover(); r != nil {
				res.WriteHeader(http.StatusInternalServerError)
			}
		}()

		count, err := upsert(readReqBody(req), req)
		if err != nil {
			res.WriteHeader(http.StatusBadRequest)
			return
		}
		resetCache()
		res.Header()["X-Rows-Affected"] = []string{strconv.Itoa(count)}
		res.WriteHeader(http.StatusOK)
	}
}

var uniformUploadHanlder = upsertionHandler(func(data []byte, req *http.Request) (int, error) {
	var uniform datamodel.UniformTemplate
	err := json.Unmarshal(data, &uniform)
	if err != nil {
		return 0, err
	}

	return query.InsertUniform(req.Context(), uniform), nil
})

var gameUploadHandler = upsertionHandler(func(b []byte, req *http.Request) (int, error) {
	id, err := strconv.Atoi(urlParam{"id"}.getVal(req))
	if err != nil {
		return 0, err
	}
	var game datamodel.GameDetailTemplate
	err = json.Unmarshal(b, &game)
	if err != nil {
		return 0, err
	}
	return query.UpdateGame(req.Context(), id, game), nil
})

var seasonUploadHandler = upsertionHandler(func(b []byte, req *http.Request) (int, error) {
	var games datamodel.GameBulkTemplate
	err := json.Unmarshal(b, &games)
	if err != nil {
		return 0, err
	}

	return query.InsertSeason(req.Context(), games), nil
})
