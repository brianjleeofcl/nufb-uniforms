package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/jackc/pgx/v4"
	"github.com/julienschmidt/httprouter"
)

func getDBURL() string {
	if env, exist := os.LookupEnv("DATABASE_ADDRESS"); exist {
		return env
	}

	network := os.Getenv("DB_IMG")
	dbName := os.Getenv("POSTGRES_DB")
	user := os.Getenv("POSTGRES_USER")
	password := os.Getenv("POSTGRES_PASSWORD")

	return fmt.Sprintf("postgresql://%s:%s@%s:%s/%s", user, password, network, "5432", dbName)
}

func executeSQLFile(conx *pgx.Conn, sqlFilePath string) error {
	file, err := os.ReadFile(sqlFilePath)
	if err != nil {
		return err
	}

	_, err = conx.Exec(context.TODO(), string(file))
	return err
}

func csvFilePath(suffix string) (gameCSV string, gameUniformCSV string) {
	gameCSV = fmt.Sprintf("/db-init/output/game_%s.csv", suffix)
	gameUniformCSV = fmt.Sprintf("/db-init/output/game_uniform_%s.csv", suffix)
	return gameCSV, gameUniformCSV
}

func copyFromCSVFile(conx *pgx.Conn, sqlFile, csvFile string) error {
	sql, err := os.ReadFile(sqlFile)
	if err != nil {
		return err
	}
	csvData, err := os.Open(csvFile)
	if err != nil {
		return err
	}
	_, err = conx.PgConn().CopyFrom(context.Background(), csvData, string(sql))
	return err
}

func handlePOST(conx pgx.Conn, cancel context.CancelFunc) httprouter.Handle {
	return func(res http.ResponseWriter, req *http.Request, params httprouter.Params) {
		stamp := params.ByName("date")
		log.Printf("writing %s", stamp)
		gameCSV, gameUniformCSV := csvFilePath(stamp)

		err := conx.BeginFunc(context.Background(), func(t pgx.Tx) error {
			if err := executeSQLFile(t.Conn(), "./01_create_game.sql"); err != nil {
				return err
			}
			if err := executeSQLFile(t.Conn(), "./02_create_game_uniform.sql"); err != nil {
				return err
			}
			if err := copyFromCSVFile(t.Conn(), "./03_seed_game.sql", gameCSV); err != nil {
				return err
			}
			if err := copyFromCSVFile(t.Conn(), "./04_seed_game_uniform.sql", gameUniformCSV); err != nil {
				return err
			}
			if err := executeSQLFile(t.Conn(), "./05_merge_tables.sql"); err != nil {
				return err
			}
			if err := executeSQLFile(t.Conn(), "./06_create_game_link.sql"); err != nil {
				return err
			}
			if err := executeSQLFile(t.Conn(), "./07_create_uniform_view.sql"); err != nil {
				return err
			}
			if err := executeSQLFile(t.Conn(), "./08_create_game_view.sql"); err != nil {
				return err
			}
			return nil
		})

		if err != nil {
			log.Printf("Error: %s", err)
			res.WriteHeader(500)
			res.Write([]byte("Error in SQL Execution"))
			cancel()
			return
		}

		res.Write([]byte(fmt.Sprintf("success - %s written", stamp)))
		cancel()
	}
}

func main() {
	dbAddr := getDBURL()
	log.Println(dbAddr)

	conx, err := pgx.Connect(context.Background(), dbAddr)
	if err != nil {
		panic(err)
	} else {
		log.Println("db connection success")
	}
	defer conx.Close(context.Background())

	ctx, cancel := context.WithCancel(context.Background())
	router := httprouter.New()
	router.POST("/files/:date", handlePOST(*conx, cancel))
	srv := &http.Server{Addr: ":8081", Handler: router}

	go func() {
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			panic(err)
		}
	}()

	<-ctx.Done()
	srv.Shutdown(ctx)
}
