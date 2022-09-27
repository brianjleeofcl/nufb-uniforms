package datamodel

import "time"

type Uniform struct {
	helmetColor       string
	jerseyColor       string
	pantsColor        string
	firstPlayed       time.Time
	lastPlayed        time.Time
	wins              int
	losses            int
	total             int
	gameData          []byte
	winPercent        string
	uniformVariations []byte
}

func (u Uniform) GetTableName() string {
	return "uniform_view"
}

func (u Uniform) GetPointerMap() map[string]interface{} {
	return map[string]interface{}{
		"helmetColor":       u.helmetColor,
		"jerseyColor":       u.jerseyColor,
		"pantsColor":        u.pantsColor,
		"firstPlayed":       u.firstPlayed,
		"lastPlayed":        u.lastPlayed,
		"wins":              u.wins,
		"losses":            u.losses,
		"total":             u.total,
		"gameData":          u.gameData,
		"winPercent":        u.winPercent,
		"uniformVariations": u.uniformVariations,
	}
}

func (u Uniform) GetColumns(selection []string) []string {
	columns := make([]string, len(selection))
	for i, v := range selection {
		columns[i] = uniformColumns[v].column
	}
	return columns
}

func (u Uniform) CheckFilter(name string) bool {
	return uniformColumns[name].sqlMapper != nil
}

func (u Uniform) GetSQLMapper(field string) func([]string) (func(int) (int, string), interface{}, error) {
	return uniformColumns[field].sqlMapper
}

var uniformColumns = map[string]SQLFilterDefinition{
	"helmetColor":       {column: "helmet_color", sqlMapper: SQLStringEqual("helmet_color")},
	"jerseyColor":       {column: "jersey_color", sqlMapper: SQLStringEqual("jersey_color")},
	"pantsColor":        {column: "pants_color", sqlMapper: SQLStringEqual("pants_color")},
	"firstPlayed":       {column: "first_played", sqlMapper: nil},
	"lastPlayed":        {column: "last_played", sqlMapper: nil},
	"wins":              {column: "wins", sqlMapper: nil},
	"losses":            {column: "losses", sqlMapper: nil},
	"total":             {column: "total", sqlMapper: SQLNumberInequal("total")},
	"gameData":          {column: "game_data", sqlMapper: nil},
	"winPercent":        {column: "win_percent", sqlMapper: SQLNumberInequal("win_percent")},
	"uniformVariations": {column: "uniform_variations", sqlMapper: nil},
}

var UniformSelectionLevel = map[string][]string{
	"summary": UniformListSelection,
	"detail":  UniformDetailSelection,
}

var UniformListSelection = []string{
	"helmetColor", "jerseyColor", "pantsColor", "firstPlayed", "lastPlayed",
	"wins", "losses", "total", "winPercent",
}

var UniformDetailSelection = []string{
	"helmetColor", "jerseyColor", "pantsColor", "firstPlayed", "lastPlayed",
	"wins", "losses", "total", "gameData", "winPercent", "uniformVariations",
}

var UniformTimelineSelection = []string{
	"helmetColor", "jerseyColor", "pantsColor", "gameData",
}
