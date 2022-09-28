package query

import (
	"context"
	"encoding/json"
	"log"

	"github.com/brianjleeofcl/nufb-uniform-tracker/datamodel"
	"github.com/jackc/pgx/v4"
)

func QueryGameSummary(ctx context.Context, rowRange string, query map[string][]string) ([]byte, error) {
	var dest datamodel.Game
	page, err := GetPaginationFromRange("full_order DESC", rowRange)
	if err != nil {
		return nil, err
	}
	filter, err := NewFilterFromQueryParam(dest, query)
	if err != nil {
		return nil, err
	}
	merged := filter.Upsert(Filter{ResultFilter{}, page})
	selection := newSelection(dest, datamodel.GameSummarySelection, merged)

	return queryJSONRows(ctx, selection), err
}

func QueryGameDetail(ctx context.Context, year, week string) ([]byte, error) {
	var dest datamodel.Game
	filter, err := FilterGameResultsFromDate(year, week)
	if err != nil {
		return nil, err
	}
	selection := newSelection(dest, datamodel.GameDetailSelection, filter)

	return queryJSONRow(ctx, selection), nil
}

func QueryLatestGame(ctx context.Context) []byte {
	var dest datamodel.Game
	showTrue, _ := NewResultFilterFromKeyValues(dest, map[string]string{"show": "true"})

	filter := Filter{showTrue, GetFirstInOrder("full_order DESC")}
	selection := newSelection(dest, datamodel.GameDetailSelection, filter)

	return queryJSONRow(ctx, selection)
}

func QueryGameID(ctx context.Context, season, week string) ([]byte, error) {
	var dest datamodel.Game
	filter, err := FilterGameResultsFromDate(season, week)
	if err != nil {
		return nil, err
	}
	selection := newSelection(dest, []string{"gameID", "gameESPNID"}, filter)

	return queryJSONRow(ctx, selection), err
}

func QueryUniforms(ctx context.Context) []byte {
	var dest datamodel.Uniform
	selection := newSelection(dest, datamodel.UniformListSelection, ListAllInOrder("last_played DESC"))

	return queryJSONRows(ctx, selection)
}

func QueryUniformDetail(ctx context.Context, helmet, jersey, pants, level string) ([]byte, error) {
	var dest datamodel.Uniform
	filter, err := NewResultFilterFromKeyValues(dest, map[string]string{
		"helmet_color": helmet, "jersey_color": jersey, "pants_color": pants,
	})
	if err != nil {
		return nil, err
	}

	selection := newSelection(dest, datamodel.UniformSelectionLevel[level], filter)

	return queryJSONRow(ctx, selection), err
}

func QueryUniformTimeline(ctx context.Context) []byte {
	var dest datamodel.Uniform
	selection := newSelection(dest, datamodel.UniformTimelineSelection, ListAllInOrder("first_played DESC"))

	return queryJSONRows(ctx, selection)
}

func queryJSONRow(ctx context.Context, selection *Selection) []byte {
	conx, err := ConnectDB(ctx)
	if err != nil {
		log.Panic(err)
	}
	err = conx.QueryRow(
		ctx,
		selection.Query,
		selection.Args...,
	).Scan(*selection.Pointers...)
	if err == pgx.ErrNoRows {
		res, _ := json.Marshal(nil)
		return res
	}
	if err != nil {
		log.Panic(err)
	}

	result, err := json.Marshal(selection.BuildResult())
	if err != nil {
		log.Panic(err)
	}
	return result
}

func queryJSONRows(ctx context.Context, selection *Selection) []byte {
	conx, err := ConnectDB(ctx)
	if err != nil {
		log.Panic(err)
	}

	rows := []map[string]interface{}{}
	_, err = conx.QueryFunc(
		ctx,
		selection.Query,
		selection.Args,
		*selection.Pointers,
		func(qfr pgx.QueryFuncRow) error {
			rows = append(rows, selection.BuildResult())
			return nil
		},
	)
	if err != nil {
		log.Panic(err)
	}

	data, err := json.Marshal(rows)
	if err != nil {
		log.Panic(err)
	}
	return data
}
