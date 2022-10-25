package main

import (
	"log"
	"os"

	"github.com/brianjleeofcl/nufb-uniform-tracker/server"
)

func main() {
	var servers []server.Server
	if _, dev := os.LookupEnv("DEV"); dev {
		servers = server.GetDevServers()
	} else {
		servers = server.GetServers()
	}
	errs := server.RunServers(servers)

	log.Printf("Could not start serving service due to (error: %s)", <-errs)
}
