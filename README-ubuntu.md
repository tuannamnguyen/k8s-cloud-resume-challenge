# Introduction

This is a sample e-commerce application built for learning purposes.

Here's how to deploy it on Ubuntu systems:

## Deploy Pre-Requisites

1. Update package metadata

```sh
sudo apt update
```

2. Install and enable UFW

```sh
sudo apt install -y ufw
sudo ufw enable
sudo ufw status
```

## Deploy and Configure Database

1. Install MariaDB

```sh
sudo apt install -y mariadb-server
sudo systemctl start mariadb
sudo systemctl enable mariadb
sudo systemctl status mariadb
```

If you need to change the MariaDB bind address for a multi-node setup, edit:

```sh
sudo vi /etc/mysql/mariadb.conf.d/50-server.cnf
```

2. Configure firewall for Database

```sh
sudo ufw allow 3306/tcp
sudo ufw reload
```

3. Configure Database

```sql
sudo mysql
CREATE DATABASE ecomdb;
CREATE USER 'ecomuser'@'localhost' IDENTIFIED BY 'ecompassword';
GRANT ALL PRIVILEGES ON *.* TO 'ecomuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> On a multi-node setup, provide the IP address of the web server here: `'ecomuser'@'web-server-ip'`

4. Load Product Inventory Information to database

Create the db-load-script.sql file:

```sh
cat > db-load-script.sql <<-EOF
USE ecomdb;
CREATE TABLE products (id mediumint(8) unsigned NOT NULL auto_increment,Name varchar(255) default NULL,Price varchar(255) default NULL, ImageUrl varchar(255) default NULL,PRIMARY KEY (id)) AUTO_INCREMENT=1;

INSERT INTO products (Name,Price,ImageUrl) VALUES ("Laptop","100","c-1.png"),("Drone","200","c-2.png"),("VR","300","c-3.png"),("Tablet","50","c-5.png"),("Watch","90","c-6.png"),("Phone Covers","20","c-7.png"),("Phone","80","c-8.png"),("Laptop","150","c-4.png");

EOF
```

Run the SQL script:

```sh
sudo mysql < db-load-script.sql
```

## Deploy and Configure Web

1. Install required packages

```sh
sudo apt install -y apache2 php libapache2-mod-php php-mysql git
sudo ufw allow 80/tcp
sudo ufw reload
```

2. Configure Apache

Change the directory index priority so `index.php` is loaded before `index.html`.

```sh
sudo sed -i 's/DirectoryIndex index.html index.cgi index.pl index.php index.xhtml index.htm/DirectoryIndex index.php index.html index.cgi index.pl index.xhtml index.htm/g' /etc/apache2/mods-enabled/dir.conf
```

3. Start Apache

```sh
sudo systemctl restart apache2
sudo systemctl enable apache2
sudo systemctl status apache2
```

4. Download code

```sh
sudo rm -f /var/www/html/index.html
sudo git clone https://github.com/kodekloudhub/learning-app-ecommerce.git /var/www/html/
```

5. Create and Configure the `.env` File

Create an `.env` file in the root of your project folder.

```sh
sudo tee /var/www/html/.env > /dev/null <<-EOF
DB_HOST=localhost
DB_USER=ecomuser
DB_PASSWORD=ecompassword
DB_NAME=ecomdb
EOF
```

On a multi-node setup, provide the IP address of the database server in the `.env` file.

6. Update `index.php`

Update the `index.php` file to load the environment variables from the `.env` file and use them to connect to the database.

```php
<?php
// Function to load environment variables from a .env file
function loadEnv($path)
{
    if (!file_exists($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);
        putenv(sprintf('%s=%s', $name, $value));
    }
    return true;
}

// Load environment variables from .env file
loadEnv(__DIR__ . '/.env');

// Retrieve the database connection details from environment variables
$dbHost = getenv('DB_HOST');
$dbUser = getenv('DB_USER');
$dbPassword = getenv('DB_PASSWORD');
$dbName = getenv('DB_NAME');

?>
```

7. Test

```sh
curl http://localhost
```
