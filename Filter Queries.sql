-- State Filter
SELECT * FROM TSESummary WHERE State = "";

-- Multiple State Filter
SELECT * FROM TSESummary WHERE State IN ( "", "" );

-- Latitude Filters
SELECT * FROM TSESummary WHERE Latitude > 0;
SELECT * FROM TSESummary WHERE Latitude < 0;
SELECT * FROM TSESummary WHERE Latitude BETWEEN 0 AND 100;

-- Longitude Filters
SELECT * FROM TSESummary WHERE Longitude > 0;
SELECT * FROM TSESummary WHERE Longitude < 0;
SELECT * FROM TSESummary WHERE Longitude BETWEEN 0 AND 100;

-- Combined Coordinate Filters
SELECT * FROM TSESummary WHERE Latitude > 0 AND Longitude > 0;
SELECT * FROM TSESummary WHERE Latitude BETWEEN 0 AND 100 AND Longitude BETWEEN 0 AND 100;

-- Name Filters
SELECT * FROM TSESummary WHERE TSEName LIKE "%FirstName%" AND TSEName LIKE "%LastName%"

-- Company Name Filter
SELECT * FROM TSESummary WHERE CompanyName LIKE "%CompanyName%"

-- City Filter
SELECT * FROM TSESummary WHERE Location LIKE "%LocationName%"