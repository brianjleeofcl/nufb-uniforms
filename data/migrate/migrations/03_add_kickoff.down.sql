
DROP MATERIALIZED VIEW game_view;
DROP MATERIALIZED VIEW uniform_view;
DROP MATERIALIZED VIEW data_summary;
DROP VIEW full_data;

CREATE VIEW full_data AS
WITH wg AS (
SELECT row_number() OVER (PARTITION BY season ORDER BY game_date) AS week,
row_number() OVER (ORDER BY game_date) AS full_order,
*
FROM game
WHERE NOT canceled
),
l AS (
SELECT season_wins, season_losses FROM wg WHERE season_wins IS NOT NULL Order by full_order desc limit 1
)
SELECT
full_order,wg.season,wg.week,wg.id AS game_id,
attendance,betting_line,broadcast,canonical_week,capacity,city,final,game_date,game_espnid,
grass_field,home,opponent,opponent_abbrev,opponent_espnid,opponent_mascot,opponent_ranking,
opponent_score,opponent_score1_q,opponent_score2_q,opponent_score3_q,opponent_score4_q,
opponent_score_ot,opponent_season_losses,opponent_season_wins,opponent_stats,overtime,ranking,
opponent = ANY (conf.division) OR opponent = ANY (conf.crossover) AS conference_game,
opponent = ANY (conf.division) AS division_game,
regular_season,score,score1_q,score2_q,score3_q,score4_q,score_ot,
coalesce(wg.season_losses,l.season_losses)AS season_losses,
coalesce(wg.season_wins,l.season_wins) AS season_wins,
stadium,stats,win,zip,
NOT (gu.helmet_color IS NULL OR gu.jersey_color IS NULL OR gu.pants_color IS NULL) AS show,
helmet_color,helmet_detail,jersey_color,jersey_letter_color,jersey_stripe_detail,
pants_color,pants_detail,special,title,tweet_url
FROM wg
LEFT JOIN game_uniform AS gu ON wg.season = gu.season AND wg.week = gu.week
LEFT JOIN b1g_teams AS conf ON conf.seasons @> wg.season
JOIN l ON TRUE;

CREATE MATERIALIZED VIEW data_summary AS
SELECT json_build_object(
'helmetColor', array_agg(DISTINCT helmet_color),
'jerseyColor', array_agg(DISTINCT jersey_color),
'pantsColor', array_agg(DISTINCT pants_color),
'opponent', array_agg(distinct opponent),
'special', array_agg(DISTINCT special) FILTER (WHERE special IS NOT NULL),
'stadium', array_agg(DISTINCT stadium),
'city', array_agg(DISTINCT city),
'broadcast', array_agg(DISTINCT broadcast)
) AS summary FROM full_data WHERE show;

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

CREATE MATERIALIZED VIEW game_view AS
WITH link AS (
SELECT json_agg(link) as links, season, week FROM game_link GROUP BY season, week
)
SELECT
full_order,g.season,max(g.week) FILTER (WHERE show) OVER (PARTITION BY g.season) AS season_length,g.week,
attendance,betting_line,broadcast,canonical_week,capacity,city,final,game_date,game_espnid,
grass_field,home,opponent,opponent_abbrev,opponent_espnid,opponent_mascot,opponent_ranking,
opponent_score,opponent_score1_q,opponent_score2_q,opponent_score3_q,opponent_score4_q,
opponent_score_ot,opponent_season_losses,opponent_season_wins,opponent_stats,overtime,ranking,
conference_game, division_game,
regular_season,score,score1_q,score2_q,score3_q,score4_q,score_ot,
season_losses,season_wins,stadium,stats,win,zip,g.game_id,links,show,
g.helmet_color,helmet_detail,g.jersey_color,jersey_letter_color,jersey_stripe_detail,
g.pants_color,pants_detail,special,title,tweet_url,
u.first_played,u.last_played,u.wins AS uniform_wins,u.losses AS uniform_losses,u.win_percent AS uniform_win_percent,
u.total AS uniform_current_total, to_char(row_number() OVER (PARTITION BY g.helmet_color, g.jersey_color, g.pants_color ORDER BY full_order), 'FM99th') AS uniform_appearance
FROM full_data AS g
LEFT JOIN uniform_view AS u ON g.helmet_color = u.helmet_color AND g.jersey_color = u.jersey_color AND g.pants_color = u.pants_color
LEFT JOIN link ON g.season = link.season AND g.week = link.week
ORDER BY full_order;
