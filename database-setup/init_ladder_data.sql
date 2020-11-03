USE wzstatistics

-- Insert templates
INSERT INTO templates (tid, name) VALUES (1335598, "Yorkshire Brawl"); -- Seasonal XLI
INSERT INTO templates (tid, name) VALUES (1352928, "Unicorn Island");  -- Seasonal XLII

-- Insert ladders
INSERT INTO ladders (lid, name, game_count, start_date, end_date, tid, active) VALUES (4075, "Seasonal XLI", 0, '20200725', '20201008', 1335598, 0);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, tid, active) VALUES (4076, "Seasonal XLII", 0, '20201021', '20210104', 1352928, 1);
