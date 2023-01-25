DROP MATERIALIZED VIEW data_summary;

CREATE MATERIALIZED VIEW data_summary AS
WITH seasons AS (
    SELECT season, count(*) FROM full_data WHERE show GROUP BY season),
season_json AS (
    SELECT json_object_agg(season, count) AS lengths FROM seasons)
SELECT json_build_object(
    'gameCount', count(*),
    'seasons', array_agg(DISTINCT season),
    'seasonLengths', array_agg(lengths) FILTER (WHERE full_order = 1) ,
    'helmetColor', array_agg(DISTINCT helmet_color),
    'jerseyColor', array_agg(DISTINCT jersey_color),
    'pantsColor', array_agg(DISTINCT pants_color),
    'opponent', array_agg(DISTINCT opponent),
    'special', array_agg(DISTINCT special) FILTER (WHERE special IS NOT NULL),
    'stadium', array_agg(DISTINCT stadium),
    'city', array_agg(DISTINCT city),
    'broadcast', array_agg(DISTINCT broadcast)
) AS summary
FROM full_data JOIN season_json ON true WHERE show;