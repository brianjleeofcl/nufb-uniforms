package query

import (
	"context"
	"log"

	"github.com/brianjleeofcl/nufb-uniform-tracker/datamodel"
	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
)

func refreshViews(conx *pgxpool.Pool, ctx context.Context) {
	_, err := conx.Exec(ctx, `REFRESH MATERIALIZED VIEW game_view;
		REFRESH MATERIALIZED VIEW uniform_view;`)
	if err != nil {
		log.Panic(err)
	}
}

func InsertUniform(ctx context.Context, uniform datamodel.UniformTemplate) int {
	conx, err := ConnectDB(ctx)
	if err != nil {
		log.Panic(err)
	}
	insertTemplate, values := uniform.GetExecStatement()
	action, err := conx.Exec(ctx, insertTemplate, values...)
	if err != nil {
		log.Panic(err)
	}

	refreshViews(conx, ctx)

	return int(action.RowsAffected())
}

func UpdateGame(ctx context.Context, id int, game datamodel.GameDetailTemplate) int {
	conx, err := ConnectDB(ctx)
	if err != nil {
		log.Panic(err)
	}
	updateTemplate, values := game.GetExecStatement()
	values = append(values, id)
	res, err := conx.Exec(ctx, updateTemplate, values...)
	if err != nil {
		log.Panic(err)
	}
	refreshViews(conx, ctx)
	return int(res.RowsAffected())
}

func InsertSeason(ctx context.Context, games datamodel.GameBulkTemplate) int {
	conx, err := ConnectDB(ctx)
	if err != nil {
		log.Panic(err)
	}
	insertTemplate, values := games.GetExecStatement()

	rowCount := 0
	err = conx.BeginFunc(ctx, func(t pgx.Tx) error {
		for _, vals := range values {
			ins, err := t.Exec(ctx, insertTemplate, vals...)
			if err != nil {
				return err
			}
			rowCount = rowCount + int(ins.RowsAffected())
		}
		return nil
	})
	if err != nil {
		log.Panic(err)
	}
	refreshViews(conx, ctx)
	return rowCount
}
