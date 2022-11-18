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
	kickoff              int
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
	conferenceGame       bool
	divisionGame         bool
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
		"kickoff":              g.kickoff,
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
		"conferenceGame":       g.conferenceGame,
		"divisionGame":         g.divisionGame,
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
		columns[i] = gameColumns[v].column
	}
	return columns
}

func (g Game) CheckFilter(field string) bool {
	return gameColumns[field].sqlMapper != nil
}

func (g Game) GetSQLMapper(field string) func([]string) (func(int) (int, string), interface{}, error) {
	return gameColumns[field].sqlMapper
}

var gameColumns = map[string]SQLFilterDefinition{
	"fullOrder":            {column: "full_order", sqlMapper: nil},
	"season":               {column: "season", sqlMapper: SQLNumberEqual("season")},
	"seasonLength":         {column: "season_length", sqlMapper: nil},
	"regularSeason":        {column: "regular_season", sqlMapper: SQLBoolean("regular_season")},
	"week":                 {column: "week", sqlMapper: nil},
	"show":                 {column: "show", sqlMapper: SQLBoolean("show")},
	"title":                {column: "title", sqlMapper: nil},
	"gameDate":             {column: "game_date", sqlMapper: nil},
	"kickoff":              {column: "kickoff", sqlMapper: SQLNumberEqual("kickoff")},
	"opponent":             {column: "opponent", sqlMapper: SQLStringEqual("opponent")},
	"opponentAbbrev":       {column: "opponent_abbrev", sqlMapper: nil},
	"opponentMascot":       {column: "opponent_mascot", sqlMapper: nil},
	"final":                {column: "final", sqlMapper: nil},
	"win":                  {column: "win", sqlMapper: SQLBoolean("win")},
	"score":                {column: "score", sqlMapper: SQLNumberInequal("score")},
	"opponentScore":        {column: "opponent_score", sqlMapper: SQLNumberInequal("opponent_score")},
	"seasonWins":           {column: "season_wins", sqlMapper: nil},
	"seasonLosses":         {column: "season_losses", sqlMapper: nil},
	"opponentSeasonWins":   {column: "opponent_season_wins", sqlMapper: nil},
	"opponentSeasonLosses": {column: "opponent_season_losses", sqlMapper: nil},
	"home":                 {column: "home", sqlMapper: SQLBoolean("home")},
	"conferenceGame":       {column: "conference_game", sqlMapper: SQLBoolean("conference_game")},
	"divisionGame":         {column: "division_game", sqlMapper: SQLBoolean("division_game")},
	"helmetColor":          {column: "helmet_color", sqlMapper: SQLStringEqual("helmet_color")},
	"jerseyColor":          {column: "jersey_color", sqlMapper: SQLStringEqual("jersey_color")},
	"pantsColor":           {column: "pants_color", sqlMapper: SQLStringEqual("jersey_color")},
	"ranking":              {column: "ranking", sqlMapper: nil},
	"opponentRanking":      {column: "opponent_ranking", sqlMapper: nil},
	"opponentESPNID":       {column: "opponent_ESPNID", sqlMapper: nil},
	"broadcast":            {column: "broadcast", sqlMapper: SQLStringEqual("broadcast")},
	"overtime":             {column: "overtime", sqlMapper: SQLBoolean("overtime")},
	"attendance":           {column: "attendance", sqlMapper: nil},
	"bettingLine":          {column: "betting_line", sqlMapper: nil},
	"capacity":             {column: "capacity", sqlMapper: nil},
	"city":                 {column: "city", sqlMapper: SQLStringEqual("city")},
	"grassField":           {column: "grass_field", sqlMapper: SQLBoolean("grass_field")},
	"opponentScore1Q":      {column: "opponent_score1_q", sqlMapper: nil},
	"opponentScore2Q":      {column: "opponent_score2_q", sqlMapper: nil},
	"opponentScore3Q":      {column: "opponent_score3_q", sqlMapper: nil},
	"opponentScore4Q":      {column: "opponent_score4_q", sqlMapper: nil},
	"opponentScoreOT":      {column: "opponent_score_ot", sqlMapper: nil},
	"opponentStats":        {column: "opponent_stats", sqlMapper: nil},
	"score1Q":              {column: "score1_q", sqlMapper: nil},
	"score2Q":              {column: "score2_q", sqlMapper: nil},
	"score3Q":              {column: "score3_q", sqlMapper: nil},
	"score4Q":              {column: "score4_q", sqlMapper: nil},
	"scoreOT":              {column: "score_ot", sqlMapper: nil},
	"stadium":              {column: "stadium", sqlMapper: nil},
	"stats":                {column: "stats", sqlMapper: nil},
	"zip":                  {column: "zip", sqlMapper: nil},
	"helmetDetail":         {column: "helmet_detail", sqlMapper: SQLStringEqual("helmet_detail")},
	"jerseyLetterColor":    {column: "jersey_letter_color", sqlMapper: nil},
	"jerseyStripeDetail":   {column: "jersey_stripe_detail", sqlMapper: nil},
	"pantsDetail":          {column: "pants_detail", sqlMapper: nil},
	"special":              {column: "special", sqlMapper: SQLStringEqual("special")},
	"tweetUrl":             {column: "tweet_url", sqlMapper: nil},
	"firstPlayed":          {column: "first_played", sqlMapper: nil},
	"lastPlayed":           {column: "last_played", sqlMapper: nil},
	"uniformWins":          {column: "uniform_wins", sqlMapper: nil},
	"uniformLosses":        {column: "uniform_losses", sqlMapper: nil},
	"uniformWinPercent":    {column: "uniform_win_percent", sqlMapper: nil},
	"uniformCurrentTotal":  {column: "uniform_current_total", sqlMapper: nil},
	"uniformAppearance":    {column: "uniform_appearance", sqlMapper: nil},
	"gameID":               {column: "game_id", sqlMapper: nil},
	"gameESPNID":           {column: "game_espnid", sqlMapper: nil},
	"links":                {column: "links", sqlMapper: nil},
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
