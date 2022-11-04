package api

import (
	"net/http"

	"github.com/go-chi/chi/v5"
)

func GetRouter() *chi.Mux {
	router := chi.NewRouter()
	attachRoutes(router)
	serveFiles(router)
	resetCache()
	return router
}

func serveFiles(router *chi.Mux) {
	router.Get("/*", func(rw http.ResponseWriter, r *http.Request) {
		interceptor := responseInterceptor{rw, 0}
		http.FileServer(http.Dir("/api/frontend")).ServeHTTP(&interceptor, r)

		// If requested file does not exist, serve frontend file
		// This is also where Server rendered meta tag subsitution occurs when implemented
		// for web crawler/link preview embeds
		if interceptor.status == 404 {
			rw.Header().Set("Content-Type", "text/html")
			http.ServeFile(rw, r, "/api/frontend/index.html")
		}
	})
}
