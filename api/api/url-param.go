package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

type urlParam struct {
	string
}

func (p urlParam) getVal(req *http.Request) string {
	return chi.URLParam(req, p.string)
}
