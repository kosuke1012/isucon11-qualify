ALTER TABLE isu_condition ADD COLUMN `condition_level` VARCHAR(80) GENERATED ALWAYS AS (
	CASE((LENGTH(`condition`) - LENGTH(REPLACE(`condition`, '=true', ''))) / LENGTH('=true'))
	WHEN 0 THEN
		'info'
	WHEN 1 THEN
		'warning'
	WHEN 2 THEN
		'warning'
	WHEN 3 THEN
		'critical'
	END) VIRTUAL;