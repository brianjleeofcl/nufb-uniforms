CREATE MATERIALIZED VIEW uniform_view AS
WITH game_stat AS (
SELECT helmet_color, helmet_detail,
jersey_color, jersey_letter_color, jersey_stripe_detail,
pants_color, pants_detail,
special, game_date, win,
    jsonb_build_object(
    'gameOrder',full_order,
    'season',season,
    'week',week,
    'title',title,
    'date',game_date,
    'opponentAbbrev',opponent_abbrev,
    'opponentRanking',opponent_ranking,
    'opponentLogo',opponent_espnid,
    'score',score,
    'opponentScore',opponent_score,
    'overtime', overtime,
    'win',win,
    'home',home
    ) AS game_summary
FROM full_data
ORDER BY full_order DESC
),
unique_detail AS (
SELECT helmet_color, jersey_color, pants_color,
jsonb_build_object(
    'helmetColor', helmet_color,
    'helmetDetail', helmet_detail,
    'jerseyColor', jersey_color,
    'jerseyLetterColor', jersey_letter_color,
    'jerseyStripeDetail', jersey_stripe_detail,
    'pantsColor', pants_color,
    'pantsDetail', pants_detail,
    'special',special,
    'games', json_agg(game_summary),
    'firstPlayed', min(game_date),
    'lastPlayed', max(game_date),
    'wins', count(*) FILTER (WHERE win),
    'losses', count(*) FILTER (WHERE NOT win),
    'total', count(*),
    'winPercent', to_char((count(*) FILTER (WHERE win) / count(*)::float) * 100, 'FM990D0%')
) AS uniform_detail
FROM game_stat
GROUP BY helmet_color, helmet_detail, jersey_color, jersey_letter_color, jersey_stripe_detail,
pants_color, pants_detail, special
),
detail_agg AS (
SELECT helmet_color, jersey_color, pants_color, json_agg(uniform_detail) AS uniform_variations
FROM unique_detail
GROUP BY helmet_color, jersey_color, pants_color
),
main_agg AS (
SELECT helmet_color, jersey_color, pants_color,
min(game_date) AS first_played,
max(game_date) AS last_played,
count(*) FILTER (WHERE win) AS wins,
count(*) FILTER (WHERE NOT win) AS losses,
count(*) AS total,
json_agg(game_summary) AS game_data
FROM game_stat
GROUP BY helmet_color, jersey_color, pants_color
)
SELECT a.helmet_color, a.jersey_color, a.pants_color,
first_played,last_played, wins, losses, total,
game_data, to_char(wins::float/total * 100,'FM990D0%') AS win_percent, uniform_variations
FROM detail_agg AS d JOIN main_agg AS a
ON d.helmet_color = a.helmet_color AND d.jersey_color = a.jersey_color AND d.pants_color = a.pants_color
ORDER BY last_played;