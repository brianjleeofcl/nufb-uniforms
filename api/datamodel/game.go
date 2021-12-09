package datamodel

import "time"

type Game struct {
	fullOrder            int
	season               int
	seasonLength         int
	regularSeason        bool
	gameId               int
	gameESPNID           string
	week                 int
	title                NullString
	gameDate             time.Time
	opponent             string
	opponentAbbrev       string
	opponentMascot       string
	final                bool
	win                  NullBool
	score                NullInt32
	opponentScore        NullInt32
	seasonWins           int
	seasonLosses         int
	opponentSeasonWins   int
	opponentSeasonLosses int
	home                 bool
	helmetColor          string
	jerseyColor          string
	pantsColor           string
	ranking              NullInt32
	opponentRanking      NullInt32
	opponentEspnId       int
	broadcast            string
	overtime             NullInt32
	attendance           NullInt32
	bettingLine          NullString
	capacity             NullInt32
	city                 NullString
	grassField           NullBool
	opponentScore1Q      int
	opponentScore2Q      int
	opponentScore3Q      int
	opponentScore4Q      int
	opponentScoreOT      NullInt32
	opponentStats        []byte
	score1Q              int
	score2Q              int
	score3Q              int
	score4Q              int
	scoreOT              NullInt32
	show                 bool
	stadium              NullString
	stats                []byte
	zip                  NullString
	helmetDetail         NullString
	jerseyLetterColor    NullString
	jerseyStripeDetail   NullString
	pantsDetail          NullString
	special              NullString
	tweetUrl             NullString
	firstPlayed          time.Time
	lastPlayed           time.Time
	uniformWins          int
	uniformLosses        int
	uniformWinPct        string
	uniformCurrentTotal  int
	uniformAppearance    string
	links                []byte
}

func (g Game) GetTableName() string {
	return "game_view"
}

func (g Game) GetPointerMap() map[string]interface{} {
	return map[string]interface{}{
		"fullOrder":            g.fullOrder,
		"season":               g.season,
		"seasonLength":         g.seasonLength,
		"week":                 g.week,
		"show":                 g.show,
		"regularSeason":        g.regularSeason,
		"title":                g.title,
		"gameDate":             g.gameDate,
		"opponent":             g.opponent,
		"opponentAbbrev":       g.opponentAbbrev,
		"opponentMascot":       g.opponentMascot,
		"final":                g.final,
		"win":                  g.win,
		"score":                g.score,
		"opponentScore":        g.opponentScore,
		"seasonWins":           g.seasonWins,
		"seasonLosses":         g.seasonLosses,
		"opponentSeasonWins":   g.opponentSeasonWins,
		"opponentSeasonLosses": g.opponentSeasonLosses,
		"home":                 g.home,
		"helmetColor":          g.helmetColor,
		"jerseyColor":          g.jerseyColor,
		"pantsColor":           g.pantsColor,
		"ranking":              g.ranking,
		"opponentRanking":      g.opponentRanking,
		"opponentESPNID":       g.opponentEspnId,
		"broadcast":            g.broadcast,
		"overtime":             g.overtime,
		"attendance":           g.attendance,
		"bettingLine":          g.bettingLine,
		"capacity":             g.capacity,
		"city":                 g.city,
		"grassField":           g.grassField,
		"opponentScore1Q":      g.opponentScore1Q,
		"opponentScore2Q":      g.opponentScore2Q,
		"opponentScore3Q":      g.opponentScore3Q,
		"opponentScore4Q":      g.opponentScore4Q,
		"opponentScoreOT":      g.opponentScoreOT,
		"opponentStats":        g.opponentStats,
		"score1Q":              g.score1Q,
		"score2Q":              g.score2Q,
		"score3Q":              g.score3Q,
		"score4Q":              g.score4Q,
		"scoreOT":              g.scoreOT,
		"stadium":              g.stadium,
		"stats":                g.stats,
		"zip":                  g.zip,
		"helmetDetail":         g.helmetDetail,
		"jerseyLetterColor":    g.jerseyLetterColor,
		"jerseyStripeDetail":   g.jerseyStripeDetail,
		"pantsDetail":          g.pantsDetail,
		"special":              g.special,
		"tweetUrl":             g.tweetUrl,
		"firstPlayed":          g.firstPlayed,
		"lastPlayed":           g.lastPlayed,
		"uniformWins":          g.uniformWins,
		"uniformLosses":        g.uniformLosses,
		"uniformWinPercent":    g.uniformWinPct,
		"uniformCurrentTotal":  g.uniformCurrentTotal,
		"uniformAppearance":    g.uniformAppearance,
		"gameID":               g.gameId,
		"gameESPNID":           g.gameESPNID,
		"links":                g.links,
	}
}

func (g Game) GetColumns(selection []string) []string {
	columns := make([]string, len(selection))
	for i, v := range selection {
		columns[i] = gameColumns[v]
	}
	return columns
}

var gameColumns = map[string]string{
	"fullOrder":            "full_order",
	"season":               "season",
	"seasonLength":         "season_length",
	"regularSeason":        "regular_season",
	"week":                 "week",
	"show":                 "show",
	"title":                "title",
	"gameDate":             "game_date",
	"opponent":             "opponent",
	"opponentAbbrev":       "opponent_abbrev",
	"opponentMascot":       "opponent_mascot",
	"final":                "final",
	"win":                  "win",
	"score":                "score",
	"opponentScore":        "opponent_score",
	"seasonWins":           "season_wins",
	"seasonLosses":         "season_losses",
	"opponentSeasonWins":   "opponent_season_wins",
	"opponentSeasonLosses": "opponent_season_losses",
	"home":                 "home",
	"helmetColor":          "helmet_color",
	"jerseyColor":          "jersey_color",
	"pantsColor":           "pants_color",
	"ranking":              "ranking",
	"opponentRanking":      "opponent_ranking",
	"opponentESPNID":       "opponent_ESPNID",
	"broadcast":            "broadcast",
	"overtime":             "overtime",
	"attendance":           "attendance",
	"bettingLine":          "betting_line",
	"capacity":             "capacity",
	"city":                 "city",
	"grassField":           "grass_field",
	"opponentScore1Q":      "opponent_score1_q",
	"opponentScore2Q":      "opponent_score2_q",
	"opponentScore3Q":      "opponent_score3_q",
	"opponentScore4Q":      "opponent_score4_q",
	"opponentScoreOT":      "opponent_score_ot",
	"opponentStats":        "opponent_stats",
	"score1Q":              "score1_q",
	"score2Q":              "score2_q",
	"score3Q":              "score3_q",
	"score4Q":              "score4_q",
	"scoreOT":              "score_ot",
	"stadium":              "stadium",
	"stats":                "stats",
	"zip":                  "zip",
	"helmetDetail":         "helmet_detail",
	"jerseyLetterColor":    "jersey_letter_color",
	"jerseyStripeDetail":   "jersey_stripe_detail",
	"pantsDetail":          "pants_detail",
	"special":              "special",
	"tweetUrl":             "tweet_url",
	"firstPlayed":          "first_played",
	"lastPlayed":           "last_played",
	"uniformWins":          "uniform_wins",
	"uniformLosses":        "uniform_losses",
	"uniformWinPercent":    "uniform_win_percent",
	"uniformCurrentTotal":  "uniform_current_total",
	"uniformAppearance":    "uniform_appearance",
	"gameID":               "game_id",
	"gameESPNID":           "game_espnid",
	"links":                "links",
}

var GameSummarySelection = []string{
	"fullOrder", "season", "seasonLength", "week", "title", "gameDate", "opponent", "opponentAbbrev", "opponentMascot", "final", "win", "score",
	"opponentScore", "seasonWins", "seasonLosses", "opponentSeasonWins", "opponentSeasonLosses",
	"home", "helmetColor", "jerseyColor", "pantsColor", "ranking", "opponentRanking", "opponentESPNID",
	"broadcast", "overtime"}

var GameDetailSelection = []string{
	"fullOrder", "season", "week", "title", "gameDate", "opponent", "opponentMascot", "final", "win", "score",
	"opponentScore", "seasonWins", "seasonLosses", "opponentSeasonWins", "opponentSeasonLosses",
	"home", "helmetColor", "jerseyColor", "pantsColor", "ranking", "opponentRanking", "opponentESPNID", "opponentAbbrev",
	"broadcast", "overtime", "attendance", "bettingLine", "capacity", "city", "grassField", "opponentScore1Q",
	"opponentScore2Q", "opponentScore3Q", "opponentScore4Q", "opponentScoreOT", "opponentStats", "score1Q", "score2Q",
	"score3Q", "score4Q", "scoreOT", "stadium", "stats", "links", "zip", "helmetDetail", "jerseyLetterColor",
	"jerseyStripeDetail", "pantsDetail", "special", "tweetUrl", "firstPlayed", "lastPlayed", "uniformWins",
	"uniformLosses", "uniformWinPercent", "uniformCurrentTotal", "uniformAppearance"}
