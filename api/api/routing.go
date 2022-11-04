package api

import (
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func attachRoutes(router *chi.Mux) {
	basicAuth := middleware.BasicAuth("restricted", getBasicAuth())
	router.Route("/api", func(r chi.Router) {
		r.Get("/data-summary", dataSummaryHandler)

		r.Route("/game", func(r chi.Router) {
			r.Get("/", latestGameHandler)
			r.Get("/{season}/{week}", gameDetailHandler)
			r.Get("/{season}/{week}/id", gameIDHandler)
		})

		r.Get("/games/{range}", gameSummaryHandler)

		r.Route("/uniforms", func(r chi.Router) {
			r.Get("/", uniformListHandler)
			r.Get("/timeline", uniformTimelineHandler)
		})

		r.Get("/uniform/{helmet}-{jersey}-{pants}/{selection}", uniformDetailHanlder)

		r.Route("/game-table", func(r chi.Router) {
			r.Use(basicAuth)
			r.Patch("/season", seasonUploadHandler)
			r.Patch("/id/{id}", gameUploadHandler)
		})

		r.With(basicAuth).Put("/uniforms/new", uniformUploadHanlder)
	})
}

func getBasicAuth() map[string]string {
	return map[string]string{
		os.Getenv("UPLOAD_USERNAME"): os.Getenv("UPLOAD_PASSWORD"),
	}
}
