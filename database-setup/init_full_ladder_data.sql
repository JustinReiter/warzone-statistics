USE wzstatistics

-- Insert templates
INSERT INTO templates (tid, name) VALUES (1335598, 'Yorkshire Brawl'); -- Seasonal XLI
INSERT INTO templates (tid, name) VALUES (1352928, 'Unicorn Island');  -- Seasonal XLII

-- Insert ladders
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4075, 'Seasonal XLI', 0, '20200725', '20201008', '20201103 13:20:00', 1335598, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4076, 'Seasonal XLII', 0, '20201021', '20210104', '20201103 13:20:00', 1352928, true);
