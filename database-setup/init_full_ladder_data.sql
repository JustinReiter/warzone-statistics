USE wzstatistics

-- Insert templates
INSERT INTO templates (tid, name) VALUES (1335598, 'Yorkshire Brawl'); -- Seasonal XLI
INSERT INTO templates (tid, name) VALUES (1352928, 'Unicorn Island');  -- Seasonal XLII

-- Insert ladders
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4075, 'Seasonal XLI', 0, '20200725', '20201008', '20201103 13:20:00', 1335598, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4076, 'Seasonal XLII', 0, '20201021', '20210104', '20201103 13:20:00', 1352928, true);


-- Templates starting from I - XX
INSERT INTO templates (tid, name) VALUES (128652, 'Strategic ME 0 Warlord');
INSERT INTO templates (tid, name) VALUES (153998, 'Strategic ME');
INSERT INTO templates (tid, name) VALUES (174431, 'Yorkshire Brawl');
INSERT INTO templates (tid, name) VALUES (195680, 'ME SR');
INSERT INTO templates (tid, name) VALUES (214096, 'Battle Islands V');
INSERT INTO templates (tid, name) VALUES (233472, 'ME Auto');
INSERT INTO templates (tid, name) VALUES (259967, 'Heavy Earth');
INSERT INTO templates (tid, name) VALUES (284938, 'Randomized MME WR');
INSERT INTO templates (tid, name) VALUES (307308, 'Randomized MME WR, Non-Default KR');
INSERT INTO templates (tid, name) VALUES (328926, 'Four Castles FFA');
INSERT INTO templates (tid, name) VALUES (351534, 'MME WR LD');
INSERT INTO templates (tid, name) VALUES (375211, 'Turkey LD');
INSERT INTO templates (tid, name) VALUES (402622, 'Randomized MME WR LD');
INSERT INTO templates (tid, name) VALUES (435109, 'Guiroma');
INSERT INTO templates (tid, name) VALUES (469448, 'Poland');
INSERT INTO templates (tid, name) VALUES (499185, 'MME WR No Split');
INSERT INTO templates (tid, name) VALUES (540720, 'Greece');
INSERT INTO templates (tid, name) VALUES (582955, 'Snowy Mountains');
INSERT INTO templates (tid, name) VALUES (636318, 'MA MME Light Fog');
INSERT INTO templates (tid, name) VALUES (683171, 'MME LD MA');

-- Ladders starting from I - XX
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4000, 'Season I', 0, '20111208', '20120206', '20201117 22:00:00', 128652, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4001, 'Season II', 0, '20120209', '20120409', '20201117 22:00:00', 153998, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4002, 'Season III', 0, '20120412', '20120611', '20201117 22:00:00', 174431, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4003, 'Season IV', 0, '20120618', '20120817', '20201117 22:00:00', 195680, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4004, 'Season V', 0, '20120820', '20121019', '20201117 22:00:00', 214096, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4005, 'Season VI', 0, '20121021', '20121220', '20201117 22:00:00', 233472, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4006, 'Season VII', 0, '20130101', '20130302', '20201117 22:00:00', 259967, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4007, 'Season VIII', 0, '20130304', '20130503', '20201117 22:00:00', 284938, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4008, 'Season IX', 0, '20130506', '20130705', '20201117 22:00:00', 307308, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4009, 'Season X', 0, '20130708', '20130906', '20201117 22:00:00', 328926, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4010, 'Season XI', 0, '20130909', '20131108', '20201117 22:00:00', 351534, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4011, 'Season XII', 0, '20131111', '20140110', '20201117 22:00:00', 375211, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4012, 'Season XIII', 0, '20140114', '20140315', '20201117 22:00:00', 402622, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4013, 'Season XIV', 0, '20140330', '20140529', '20201117 22:00:00', 435109, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4014, 'Season XV', 0, '20140609', '20140808', '20201117 22:00:00', 469448, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4015, 'Season XVI', 0, '20140811', '20141010', '20201117 22:00:00', 499185, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4016, 'Season XVII', 0, '20141103', '20150102', '20201117 22:00:00', 540720, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4017, 'Season XVIII', 0, '20150122', '20150323', '20201117 22:00:00', 582955, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4018, 'Season XIX', 0, '20150421', '20150620', '20201117 22:00:00', 636318, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4019, 'Season XX', 0, '20150709', '20150907', '20201117 22:00:00', 683171, false);


-- ==================================================================================================


-- Templates starting from XXI - XL
INSERT INTO templates (tid, name) VALUES (721452, 'Strategic ME');
INSERT INTO templates (tid, name) VALUES (761923, 'French Brawl');
INSERT INTO templates (tid, name) VALUES (802345, 'MME Commanders');
INSERT INTO templates (tid, name) VALUES (861879, 'Red Dead Redemption');
INSERT INTO templates (tid, name) VALUES (910528, 'LD MME Commanders');
INSERT INTO templates (tid, name) VALUES (944658, 'Floating Rocks WR');
INSERT INTO templates (tid, name) VALUES (975768, 'Elitist Africa');
INSERT INTO templates (tid, name) VALUES (1006280, 'Strategic Commanders');
INSERT INTO templates (tid, name) VALUES (1048069, 'Eberron World');
INSERT INTO templates (tid, name) VALUES (1075570, 'Succession Wars');
INSERT INTO templates (tid, name) VALUES (1065983, 'MME Commerce');
INSERT INTO templates (tid, name) VALUES (1142644, 'Biomes of America');
INSERT INTO templates (tid, name) VALUES (1163796, 'Volcano Island');
INSERT INTO templates (tid, name) VALUES (1184319, 'Blitzkrieg Bork');
INSERT INTO templates (tid, name) VALUES (1211509, 'Hannibal at the Gates');
INSERT INTO templates (tid, name) VALUES (1231157, 'Timid Lands');
INSERT INTO templates (tid, name) VALUES (1247560, 'Earthsea');
INSERT INTO templates (tid, name) VALUES (1260108, 'Strategic ME');
INSERT INTO templates (tid, name) VALUES (1279588, 'Georgia Army Cap');
INSERT INTO templates (tid, name) VALUES (1311541, 'Landria');

-- Ladders starting from XXI - XL
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4020, 'Season XXI', 0, '20150927', '20151126', ' 20201117 22:00:00', 721452, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4021, 'Season XXII', 0, '20151209', '20160207', '20201117 22:00:00', 761923, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4022, 'Season XXIII', 0, '20160210', '20160410', '20201117 22:00:00', 802345, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4023, 'Season XXIV', 0, '20160515', '20160714', '20201117 22:00:00', 861879, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4024, 'Season XXV', 0, '20160814', '20161013', '20201117 22:00:00', 910528, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4025, 'Season XXVI', 0, '20161101', '20161231', '20201117 22:00:00', 944658, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4026, 'Season XXVII', 0, '20170108', '20170309', '20201117 22:00:00', 975768, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4027, 'Season XXVIII', 0, '20170312', '20170511', '20201117 22:00:00', 1006280, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4028, 'Season XXIX', 0, '20170615', '20170814', '20201117 22:00:00', 1048069, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4029, 'Season XXX', 0, '20170902', '20171101', '20201117 22:00:00', 1075570, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4030, 'Season XXXI', 0, '20171208', '20180221', '20201117 22:00:00', 1065983, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4031, 'Season XXXII', 0, '20180424', '20180708', '20201117 22:00:00', 1142644, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4032, 'Season XXXIII', 0, '20180804', '20181018', '20201117 22:00:00', 1163796, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4065, 'Season XXXIV', 0, '20181028', '20190111', '20201117 22:00:00', 1184319, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4066, 'Season XXXV', 0, '20190211', '20190427', '20201117 22:00:00', 1211509, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4067, 'Season XXXVI', 0, '20190507', '20190721', '20201117 22:00:00', 1231157, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4068, 'Season XXXVII', 0, '20190801', '20191015', '20201117 22:00:00', 1247560, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4069, 'Season XXXVIII', 0, '20191017', '20191231', '20201117 22:00:00', 1260108, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4070, 'Season XXXIX', 0, '20200129', '20200413', '20201117 22:00:00', 1279588, false);
INSERT INTO ladders (lid, name, game_count, start_date, end_date, last_updated, tid, active) VALUES (4074, 'Season XL', 0, '20200501', '20200715', '20201117 22:00:00', 1311541, false);
