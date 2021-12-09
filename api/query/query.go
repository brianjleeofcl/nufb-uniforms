package query

import (
	"context"
	"encoding/json"
	"log"

	"github.com/brianjleeofcl/nufb-uniform-tracker/datamodel"
	"github.com/jackc/pgx/v4"
)

func QueryGameSummary(ctx context.Context, top, skip int) []byte {
	var dest datamodel.Game
	filter := Filter{
		SingleRowFilter{map[string]interface{}{"show": IsTrue}},
		"full_order DESC", top, skip,
	}
	selection := newSelection(dest, datamodel.GameSummarySelection, filter)

	return queryJSONRows(ctx, selection)
}

func QueryGameDetail(ctx context.Context, year, week int) []byte {
	var dest datamodel.Game
	filter := SingleRowFilter{map[string]interface{}{"season": year, "week": week}}
	selection := newSelection(dest, datamodel.GameDetailSelection, filter)

	return queryJSONRow(ctx, selection)
}

func QueryLatestGame(ctx context.Context) []byte {
	var dest datamodel.Game
	filter := Filter{
		SingleRowFilter{map[string]interface{}{"helmet_color": IsNotNull}},
		"full_order DESC", 1, 0,
	}
	selection := newSelection(dest, datamodel.GameDetailSelection, filter)

	return queryJSONRow(ctx, selection)
}

func QueryGameID(ctx context.Context, season, week int) []byte {
	var dest datamodel.Game
	filter := SingleRowFilter{map[string]interface{}{"season": season, "week": week}}
	selection := newSelection(dest, []string{"gameID", "gameESPNID"}, filter)

	return queryJSONRow(ctx, selection)
}

func QueryUniforms(ctx context.Context) []byte {
	var dest datamodel.Uniform
	filter := Filter{SingleRowFilter{}, "last_played DESC", 0, 0}
	selection := newSelection(dest, datamodel.UniformListSelection, filter)

	return queryJSONRows(ctx, selection)
}

func QueryUniformDetail(ctx context.Context, helmet, jersey, pants, level string) []byte {
	var dest datamodel.Uniform
	filter := SingleRowFilter{map[string]interface{}{
		"helmet_color": helmet, "jersey_color": jersey, "pants_color": pants,
	}}
	selection := newSelection(dest, datamodel.UniformSelectionLevel[level], filter)

	return queryJSONRow(ctx, selection)
}

func QueryUniformTimeline(ctx context.Context) []byte {
	var dest datamodel.Uniform
	filter := Filter{SingleRowFilter{}, "first_played DESC", 0, 0}
	selection := newSelection(dest, datamodel.UniformTimelineSelection, filter)

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
