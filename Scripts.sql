/* Populate the CompanyName field using CustomerName */
UPDATE TSESummary SET CompanyName = IF( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) > 1, SUBSTRING_INDEX( CustomerName, '-', 2 ), SUBSTRING_INDEX( CustomerName, '-', 1 ) );

/* Populate the Location field using CustomerName */
UPDATE TSESummary SET Location = IF( ( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) = 0 ), '', IF( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) > 1, SUBSTRING_INDEX( CustomerName, '-', -2 ), SUBSTRING_INDEX( CustomerName, '-', -1 ) ) );

/* Count the number of CustomerNames with more than 2 '-' characters */
SELECT COUNT( CustomerName ) AS MoreThan3Dashes FROM  TSESummary WHERE ( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) ) > 2;
