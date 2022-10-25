package server

import (
	"context"
	"crypto/tls"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/brianjleeofcl/nufb-uniform-tracker/api"
	"golang.org/x/crypto/acme/autocert"
)

type Server struct {
	server *http.Server
	tls    bool
}

func makeServer(handler http.Handler) *http.Server {
	return &http.Server{
		ReadTimeout:  5 * time.Second,
		WriteTimeout: 5 * time.Second,
		IdleTimeout:  120 * time.Second,
		Handler:      handler,
	}
}

func makeHTTPSRedirectServer() *http.Server {
	mux := &http.ServeMux{}
	mux.HandleFunc("/", func(rw http.ResponseWriter, r *http.Request) {
		http.Redirect(rw, r, "https://"+r.Host+r.URL.String(), http.StatusFound)
	})
	return makeServer(mux)
}

func GetDevServers() []Server {
	server := makeServer(api.GetRouter())
	port, found := os.LookupEnv("PORT")
	if !found {
		port = ":8080"
	}
	server.Addr = port
	return []Server{{server: server, tls: false}}
}

func GetServers() []Server {
	hostPolicy := func(ctx context.Context, host string) error {
		allowedHost, found := os.LookupEnv("HOST")
		if !found {
			log.Println("WARNING: HOST env not set explicitly, using fallback")
			allowedHost = "nufbuniforms.com"
		}
		if host == allowedHost {
			return nil
		}
		return fmt.Errorf("acme/autocert: host not allowed (only %s allowed)", allowedHost)
	}
	certManager := &autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		HostPolicy: hostPolicy,
		Cache:      autocert.DirCache("./cert"),
	}
	httpsServer := makeServer(api.GetRouter())
	httpsServer.Addr = ":443"
	httpsServer.TLSConfig = &tls.Config{GetCertificate: certManager.GetCertificate}

	httpServer := makeHTTPSRedirectServer()
	httpServer.Addr = ":80"
	httpServer.Handler = certManager.HTTPHandler(httpServer.Handler)

	return []Server{
		{server: httpServer, tls: false},
		{server: httpsServer, tls: true},
	}
}

func RunServers(servers []Server) chan error {
	errs := make(chan error)

	for _, v := range servers {
		go func(s Server) {
			log.Printf("server running, open port %s", s.server.Addr)

			var err error
			if s.tls {
				err = s.server.ListenAndServeTLS("", "")
			} else {
				err = s.server.ListenAndServe()
			}
			if err != nil {
				errs <- err
			}
		}(v)
	}

	return errs
}
