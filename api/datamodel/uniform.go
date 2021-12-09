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
		columns[i] = uniformColumns[v]
	}
	return columns
}

var uniformColumns = map[string]string{
	"helmetColor":       "helmet_color",
	"jerseyColor":       "jersey_color",
	"pantsColor":        "pants_color",
	"firstPlayed":       "first_played",
	"lastPlayed":        "last_played",
	"wins":              "wins",
	"losses":            "losses",
	"total":             "total",
	"gameData":          "game_data",
	"winPercent":        "win_percent",
	"uniformVariations": "uniform_variations",
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
