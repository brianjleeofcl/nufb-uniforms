DROP MATERIALIZED VIEW data_summary;

CREATE MATERIALIZED VIEW data_summary AS
SELECT json_build_object(
    'gameCount', count(*),
    'seasons', array_agg(DISTINCT season),
    'helmetColor', array_agg(DISTINCT helmet_color),
    'jerseyColor', array_agg(DISTINCT jersey_color),
    'pantsColor', array_agg(DISTINCT pants_color),
    'opponent', array_agg(DISTINCT opponent),
    'special', array_agg(DISTINCT special) FILTER (WHERE special IS NOT NULL),
    'stadium', array_agg(DISTINCT stadium),
    'city', array_agg(DISTINCT city),
    'broadcast', array_agg(DISTINCT broadcast)
) AS summary FROM full_data WHERE show;
