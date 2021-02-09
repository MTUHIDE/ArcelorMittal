UPDATE TSESummary SET CompanyName = IF( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) > 1, SUBSTRING_INDEX( CustomerName, '-', 2 ), SUBSTRING_INDEX( CustomerName, '-', 1 ) );

UPDATE TSESummary SET Location = IF( ( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) = 0 ), '', IF( LENGTH(CustomerName) - LENGTH(REPLACE(CustomerName,'-','')) > 1, SUBSTRING_INDEX( CustomerName, '-', -2 ), SUBSTRING_INDEX( CustomerName, '-', -1 ) ) );
