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
regular_season,score,score1_q,score2_q,score3_q,score4_q,score_ot,
coalesce(wg.season_losses,l.season_losses)AS season_losses,
coalesce(wg.season_wins,l.season_wins) AS season_wins,
stadium,stats,win,zip,
NOT (gu.helmet_color IS NULL OR gu.jersey_color IS NULL OR gu.pants_color IS NULL) AS show,
helmet_color,helmet_detail,jersey_color,jersey_letter_color,jersey_stripe_detail,
pants_color,pants_detail,special,title,tweet_url
FROM wg
LEFT JOIN game_uniform AS gu ON wg.season = gu.season AND wg.week = gu.week
JOIN l ON TRUE;
