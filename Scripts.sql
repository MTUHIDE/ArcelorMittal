/* Populate the CompanyName field using CustomerName */
UPDATE TSESummary SET CompanyName = IF( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) > 1, SUBSTRING_INDEX( CustomerName, '-', 2 ), SUBSTRING_INDEX( CustomerName, '-', 1 ) );

/* Populate the Location field using CustomerName */
UPDATE TSESummary SET Location = IF( ( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) = 0 ), '', IF( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) > 1, SUBSTRING_INDEX( CustomerName, '-', -2 ), SUBSTRING_INDEX( CustomerName, '-', -1 ) ) );

/* Count the number of CustomerNames with more than 2 '-' characters */
SELECT COUNT( CustomerName ) AS MoreThan3Dashes FROM  TSESummary WHERE ( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) ) > 2;

/* Select specific fields */
SELECT a.TSEName, a.City, a.State, a.CustomerName, a.CompanyName, a.Location, b.latitude, b.longitude
FROM TSESummary AS a
LEFT JOIN geoname AS b
ON LOWER(a.State) = LOWER(b.admin1code) AND LOWER(a.Location) = LOWER(b.asciiname)
WHERE b.geonameid IS NOT NULL

/* Select all fields */
SELECT *
FROM TSESummary AS a
LEFT JOIN geoname AS b
ON LOWER(a.State) = LOWER(b.admin1code)
AND LOWER(a.Location) = LOWER(b.asciiname)
WHERE b.geonameid IS NOT NULL

/* Updated - Select all fields */
SELECT *
FROM CustomerList AS a
LEFT JOIN geoname AS b
ON LOWER(a.St) = LOWER(b.admin1code)
AND LOWER(a.City) = LOWER(b.asciiname)
WHERE b.geonameid IS NOT NULL

/* New join, more effective */
SELECT a.Customer, a.St, a.City, b.LATITUDE, b.LONGITUDE
FROM CustomerList AS a
LEFT JOIN us_cities AS b
ON LOWER(a.St) = LOWER(b.STATE_CODE)
AND LOWER(a.City) = LOWER(b.CITY)
WHERE b.LATITUDE IS NOT NULL
GROUP BY a.Customer, a.St, a.City

/* New join, only pulls NULL */
SELECT a.Customer, a.St, a.City, b.LATITUDE, b.LONGITUDE
FROM CustomerList AS a
LEFT JOIN us_cities AS b
ON LOWER(a.St) = LOWER(b.STATE_CODE)
AND LOWER(a.City) = LOWER(b.CITY)
WHERE b.LATITUDE IS NULL
GROUP BY a.Customer, a.St, a.City
