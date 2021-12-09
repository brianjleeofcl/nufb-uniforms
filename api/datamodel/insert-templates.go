package datamodel

import (
	"fmt"
	"strings"
)

type UniformTemplate struct {
	Season             int        `json:"season"`
	Week               int        `json:"week"`
	HelmetColor        string     `json:"helmetColor"`
	HelmetDetail       NullString `json:"helmetDetail"`
	JerseyColor        string     `json:"jerseyColor"`
	JerseyLetterColor  NullString `json:"jerseyLetterColor"`
	JerseyStripeDetail NullString `json:"jerseyStripeDetail"`
	PantsColor         string     `json:"pantsColor"`
	PantsDetail        NullString `json:"pantsDetail"`
	Special            NullString `json:"special"`
	TweetUrl           NullString `json:"tweetUrl"`
}

func (u UniformTemplate) GetExecStatement() (insert string, values []interface{}) {
	cols := []string{
		"season", "week", "helmet_color", "helmet_detail",
		"jersey_color", "jersey_letter_color", "jersey_stripe_detail",
		"pants_color", "pants_detail", "special", "tweet_url",
	}
	vars := make([]string, len(cols))
	for i := range cols {
		vars[i] = fmt.Sprintf("$%d", i+1)
	}
	insert = fmt.Sprintf(
		"INSERT INTO game_uniform (%s) VALUES(%s) ON CONFLICT DO NOTHING",
		strings.Join(cols, ", "), strings.Join(vars, ", "),
	)
	values = []interface{}{
		u.Season, u.Week, u.HelmetColor, u.HelmetDetail,
		u.JerseyColor, u.JerseyLetterColor, u.JerseyStripeDetail,
		u.PantsColor, u.PantsDetail, u.Special, u.TweetUrl,
	}
	return insert, values
}

type GameDetailTemplate struct {
	Title                NullString `json:"title"`
	GameDate             string     `json:"gameDate"`
	Final                bool       `json:"final"`
	Win                  NullBool   `json:"win"`
	Score                NullInt32  `json:"score"`
	OpponentScore        NullInt32  `json:"opponentScore"`
	SeasonWins           int        `json:"seasonWins"`
	SeasonLosses         int        `json:"seasonLosses"`
	OpponentSeasonWins   int        `json:"opponentSeasonWins"`
	OpponentSeasonLosses int        `json:"opponentSeasonLosses"`
	Ranking              NullInt32  `json:"ranking"`
	OpponentRanking      NullInt32  `json:"opponentRanking"`
	Broadcast            NullString `json:"broadcast"`
	Overtime             NullInt32  `json:"overtime"`
	Attendance           NullInt32  `json:"attendance"`
	BettingLine          NullString `json:"bettingLine"`
	Capacity             NullInt32  `json:"capacity"`
	GrassField           NullBool   `json:"grassField"`
	OpponentScore1Q      NullInt32  `json:"opponentScore1Q"`
	OpponentScore2Q      NullInt32  `json:"opponentScore2Q"`
	OpponentScore3Q      NullInt32  `json:"opponentScore3Q"`
	OpponentScore4Q      NullInt32  `json:"opponentScore4Q"`
	OpponentScoreOT      NullInt32  `json:"opponentScoreOT"`
	OpponentStats        NullString `json:"opponentStats"`
	Score1Q              NullInt32  `json:"score1Q"`
	Score2Q              NullInt32  `json:"score2Q"`
	Score3Q              NullInt32  `json:"score3Q"`
	Score4Q              NullInt32  `json:"score4Q"`
	ScoreOT              NullInt32  `json:"scoreOT"`
	Stats                NullString `json:"stats"`
	City                 NullString `json:"city"`
	Zip                  NullString `json:"zip"`
	Stadium              NullString `json:"stadium"`
}

func (g GameDetailTemplate) GetExecStatement() (insert string, values []interface{}) {
	cols := []string{
		"title", "gameDate", "final", "win", "score", "opponentScore", "seasonWins", "seasonLosses",
		"opponentSeasonWins", "opponentSeasonLosses", "ranking", "opponentRanking", "broadcast",
		"overtime", "attendance", "bettingLine", "capacity", "grassField", "opponentScore1Q",
		"opponentScore2Q", "opponentScore3Q", "opponentScore4Q", "opponentScoreOT", "opponentStats",
		"score1Q", "score2Q", "score3Q", "score4Q", "scoreOT", "stats", "stadium", "city", "zip",
	}
	vars := make([]string, len(cols))
	for i, v := range cols {
		vars[i] = fmt.Sprintf("%s = $%d", gameColumns[v], i+1)
	}

	insert = fmt.Sprintf(
		"UPDATE game SET %s WHERE id = $%d",
		strings.Join(vars, ", "), len(cols)+1,
	)
	values = []interface{}{
		g.Title, g.GameDate, g.Final, g.Win, g.Score, g.OpponentScore, g.SeasonWins,
		g.SeasonLosses, g.OpponentSeasonWins, g.OpponentSeasonLosses, g.Ranking,
		g.OpponentRanking, g.Broadcast, g.Overtime, g.Attendance, g.BettingLine, g.Capacity,
		g.GrassField, g.OpponentScore1Q, g.OpponentScore2Q, g.OpponentScore3Q, g.OpponentScore4Q,
		g.OpponentScoreOT, g.OpponentStats, g.Score1Q, g.Score2Q, g.Score3Q, g.Score4Q,
		g.ScoreOT, g.Stats, g.Stadium, g.City, g.Zip,
	}
	return insert, values
}

type GameBulkTemplate []struct {
	Final          bool       `json:"final"`
	Canceled       bool       `json:"canceled"`
	GameESPNID     string     `json:"gameESPNID"`
	GameDate       string     `json:"gameDate"`
	Season         int        `json:"season"`
	CanonicalWeek  int        `json:"canonicalWeek"`
	Opponent       string     `json:"opponent"`
	OpponentMascot string     `json:"opponentMascot"`
	OpponentAbbrev string     `json:"opponentAbbrev"`
	OpponentESPNID string     `json:"opponentESPNID"`
	Home           bool       `json:"home"`
	Stadium        NullString `json:"stadium"`
	City           NullString `json:"city"`
	Zip            NullString `json:"zip"`
	RegularSeason  bool       `json:"regularSeason"`
}

func (gs GameBulkTemplate) GetExecStatement() (insert string, values [][]interface{}) {
	cols := []string{
		"final", "canceled", "game_espnid", "game_date", "season", "canonical_week", "opponent",
		"opponent_mascot", "opponent_abbrev", "opponent_espnid", "home", "stadium",
		"city", "zip", "regular_season",
	}
	vars := make([]string, len(cols))
	for i := range cols {
		vars[i] = fmt.Sprintf("$%d", i+1)
	}
	insert = fmt.Sprintf("INSERT INTO game (%s) VALUES (%s) ON CONFLICT DO NOTHING",
		strings.Join(cols, ", "), strings.Join(vars, ", "),
	)
	values = make([][]interface{}, len(gs))
	for i, g := range gs {
		values[i] = []interface{}{
			g.Final, g.Canceled, g.GameESPNID, g.GameDate, g.Season, g.CanonicalWeek, g.Opponent,
			g.OpponentMascot, g.OpponentAbbrev, g.OpponentESPNID, g.Home, g.Stadium,
			g.City, g.Zip, g.RegularSeason,
		}
	}
	return insert, values
}
