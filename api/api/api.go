package api

import (
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

func GetRouter() *chi.Mux {
	router := chi.NewRouter()
	attachRoutes(router)
	serveFiles(router)
	resetCache()
	return router
}

func attachRoutes(router *chi.Mux) {
	basicAuth := middleware.BasicAuth("restricted", getBasicAuth())
	router.Route("/api", func(r chi.Router) {
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

		r.With(basicAuth).Put("/api/uniforms/new", uniformUploadHanlder)
	})
}

func serveFiles(router *chi.Mux) {
	router.Get("/*", func(rw http.ResponseWriter, r *http.Request) {
		interceptor := responseInterceptor{rw, 0}
		http.FileServer(http.Dir("/api/frontend")).ServeHTTP(&interceptor, r)
		if interceptor.status == 404 {
			rw.Header().Set("Content-Type", "text/html")
			http.ServeFile(rw, r, "/api/frontend/index.html")
		}
	})
}

func getBasicAuth() map[string]string {
	return map[string]string{
		os.Getenv("UPLOAD_USERNAME"): os.Getenv("UPLOAD_PASSWORD"),
	}
}
