--DB_Insight query
CREATE TABLE config_db_info ( 
  config_db_id BIGSERIAL PRIMARY KEY,
  db_name VARCHAR(75),
  db_type VARCHAR(50),
  enviornment VARCHAR(20),
  db_user_id VARCHAR(75),
  db_password VARCHAR(50),
  host_id VARCHAR(20),
  port_id VARCHAR(10),
  connection_str VARCHAR(255),
  team_name VARCHAR(100),
  team_poc VARCHAR(100)
);

CREATE TABLE conf_db_query (
  config_query_id BIGSERIAL PRIMARY KEY,
  menu_action VARCHAR(100),
  menu_desc VARCHAR(500),
  sql_query VARCHAR(2000),
  config_db_id integer REFERENCES config_db_info (config_db_id)
);

--select queries
SELECT * from config_db_info
	
SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'config_db_info'

--...

	--
--inserting
INSERT INTO public.config_db_info(
	db_name, db_type, enviornment, db_user_id, db_password, host_id, port_id, connection_str, team_name, team_poc)
	VALUES ('cars_db', 'postgres', 'dev', 'postgres', '', 'localhost', '5432', 'postgres://postgres:@localhost:5432/cars_db', 'sales', 'Ron K.');

INSERT INTO public.config_db_info(
	db_name, db_type, enviornment, db_user_id, db_password, host_id, port_id, connection_str, team_name, team_poc)
	VALUES ('pencils_db', 'postgres', 'dev', 'postgres', '', 'localhost', '5432', 'postgres://postgres:@localhost:5432/pencils_db', 'orders', 'Tom C. K.');

INSERT INTO public.config_db_info(
	db_name, db_type, enviornment, db_user_id, db_password, host_id, port_id, connection_str, team_name, team_poc)
VALUES 
    ('inventory_db', 'oracle', 'prod', 'inv_user', 'password123', 'inventory_host', '1521', 'oracle://inv_user:password123@inventory_host:1521/inventory_db', 'operations', 'Alice B.'),
    ('customer_db', 'mssql', 'test', 'cust_user', 'custpass', 'customer_host', '1433', 'mssql://cust_user:custpass@customer_host:1433/customer_db', 'customer_service', 'Bob C.'),
    ('finance_db', 'MySQL', 'dev', 'fin_user', 'finpass', 'finance_host', '3306', 'mysql://fin_user:finpass@finance_host:3306/finance_db', 'finance', 'Charlie D.'),
    ('hr_db', 'postgresql', 'prod', 'hr_user', 'hrpassword', 'hr_host', '5432', 'postgresql://hr_user:hrpassword@hr_host:5432/hr_db', 'human_resources', 'Dana E.'),
    ('sales_db', 'azure', 'test', 'sales_user', 'salespass', 'sales_host', '1433', 'azure://sales_user:salespass@sales_host:1433/sales_db', 'sales', 'Eve F.'),
    ('logistics_db', 'dBL', 'dev', 'log_user', 'logpass', 'logistics_host', '27017', 'dBL://log_user:logpass@logistics_host:27017/logistics_db', 'logistics', 'Frank G.'),
    ('marketing_db', 'oracle', 'prod', 'mkt_user', 'mktpass', 'marketing_host', '1521', 'oracle://mkt_user:mktpass@marketing_host:1521/marketing_db', 'marketing', 'Grace H.'),
    ('support_db', 'mssql', 'test', 'sup_user', 'suppass', 'support_host', '1433', 'mssql://sup_user:suppass@support_host:1433/support_db', 'support', 'Hank I.'),
    ('billing_db', 'MySQL', 'dev', 'bill_user', 'billpass', 'billing_host', '3306', 'mysql://bill_user:billpass@billing_host:3306/billing_db', 'billing', 'Ivy J.'),
    ('development_db', 'postgresql', 'prod', 'dev_user', 'devpass', 'development_host', '5432', 'postgresql://dev_user:devpass@development_host:5432/development_db', 'development', 'Jack K.');

INSERT INTO public.config_db_info(
	db_name, db_type, enviornment, db_user_id, db_password, host_id, port_id, connection_str, team_name, team_poc)
	VALUES ('students', 'mysql', 'dev', 'root@localhost', 'Verisk67', 'localhost', '3306', 'mysql://mysql:@localhost:3306/students', 'SBU', 'Nik M.');

INSERT INTO public.config_db_info(
	db_name, db_type, enviornment, db_user_id, db_password, host_id, port_id, connection_str, team_name, team_poc)
	VALUES ('students', 'mysql', 'dev', 'root@localhost', 'Verisk67', 'localhost', '3306', 'mysql://mysql:Verisk67@localhost:3306/students', 'SBU', 'Nik M.');

INSERT INTO public.config_db_info(
	db_name, db_type, enviornment, db_user_id, db_password, host_id, port_id, connection_str, team_name, team_poc)
	VALUES ('students', 'mysql', 'dev', 'root@localhost', 'Verisk67', 'localhost', '3306', 'mysql://root@localhost:Verisk67@localhost:3306/students', 'SBU', 'Nik M.');

INSERT INTO public.config_db_info(
	db_name, db_type, enviornment, db_user_id, db_password, host_id, port_id, connection_str, team_name, team_poc)
	VALUES ('students', 'mysql', 'dev', 'root', 'Verisk67', 'localhost', '3306', 'mysql://root:Verisk67@localhost:3306/students', 'SBU', 'Nik M.');

-- query
SELECT * from conf_db_query
	
SELECT column_name, data_type, character_maximum_length FROM information_schema.columns WHERE table_name = 'conf_db_query'

INSERT INTO public.conf_db_query(
	menu_action, menu_desc, sql_query, config_db_id)
	VALUES ('row_count', 'get row count of table', 'SELECT COUNT(*) FROM cars;', 1);

INSERT INTO public.conf_db_query(
	menu_action, menu_desc, sql_query, config_db_id)
	VALUES ('num_tables', 'get the number of tables', 'select count(*) from information_schema.tables where table_schema = ''public'';', 1);

INSERT INTO public.conf_db_query(
	menu_action, menu_desc, sql_query, config_db_id)
	VALUES ('student_count', 'get student count of table', 'SELECT COUNT(*) FROM BUS115;', 13);

INSERT INTO public.conf_db_query(
	menu_action, menu_desc, sql_query, config_db_id)
	VALUES ('student_count', 'get student count of table', 'SELECT COUNT(*) FROM BUS115;', 14);

INSERT INTO public.conf_db_query(
	menu_action, menu_desc, sql_query, config_db_id)
	VALUES ('student_count', 'get student count of table', 'SELECT COUNT(*) FROM BUS115;', 15);

INSERT INTO public.conf_db_query(
	menu_action, menu_desc, sql_query, config_db_id)
	VALUES ('student_count', 'get student count of table', 'SELECT COUNT(*) FROM BUS115;', 16);

DELETE FROM public.conf_db_query WHERE config_db_id = 15;




