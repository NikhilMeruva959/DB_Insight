show databases;
USE students;

CREATE TABLE BUS115
(
  id              INT unsigned NOT NULL AUTO_INCREMENT, # Unique ID for the student
  first_name            VARCHAR(150) NOT NULL,                # Name of the cat
  last_name           VARCHAR(150) NOT NULL,                # Owner of the cat
  birth           DATE NOT NULL,                        # Birthday of the cat
  PRIMARY KEY     (id)                                  # Make the id the primary key
);

SHOW TABLES;

DESCRIBE BUS115;

INSERT INTO BUS115 ( first_name, last_name, birth) VALUES
  ( 'Sandy', 'Lennon', '2015-01-03' ),
  ( 'Cookie', 'Casey', '2013-11-13' ),
  ( 'Charlie', 'River', '2016-05-21' );

SELECT * FROM BUS115;

SELECT CURRENT_USER();

show variables;

select @@hostname;

SELECT COUNT(*) FROM BUS115;

CREATE USER 'root'@'localhost' IDENTIFIED BY 'Verisk67';
GRANT ALL PRIVILEGES ON students.* TO 'root'@'localhost';
FLUSH PRIVILEGES;

SELECT user, host, plugin FROM mysql.user WHERE user = 'root@localhost';

SHOW PLUGINS;

SELECT USER();

UNINSTALL PLUGIN mysql_native_password;
INSTALL PLUGIN mysql_native_password SONAME 'mysql_native_password.so';

