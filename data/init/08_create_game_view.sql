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
