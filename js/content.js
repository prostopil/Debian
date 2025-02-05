export async function loadContent() {
  return [
    {
      title: "Подготовка системы",
      content: `
        <h3>Обновление системы</h3>
        <pre><code class="language-bash">
apt update
apt upgrade -y
        </code></pre>
        
        <h3>Установка базовых инструментов</h3>
        <pre><code class="language-bash">
apt install -y wget curl git net-tools
        </code></pre>
      `
    },
    {
      title: "Установка MySQL",
      content: `
        <h3>Установка MySQL Server</h3>
        <pre><code class="language-bash">
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql
        </code></pre>
        
        <h3>Настройка безопасности MySQL</h3>
        <pre><code class="language-bash">
mysql_secure_installation
        </code></pre>
      `
    },
    {
      title: "Установка PostgreSQL",
      content: `
        <h3>Установка PostgreSQL</h3>
        <pre><code class="language-bash">
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
        </code></pre>
        
        <h3>Первичная настройка</h3>
        <pre><code class="language-bash">
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'your_password';"
        </code></pre>
      `
    },
    {
      title: "Установка PHP",
      content: `
        <h3>Установка PHP 7.4</h3>
        <pre><code class="language-bash">
apt install -y php7.4 php7.4-fpm php7.4-mysql php7.4-pgsql
        </code></pre>
        
        <h3>Установка PHP 8.0</h3>
        <pre><code class="language-bash">
apt install -y software-properties-common
add-apt-repository ppa:ondrej/php
apt update
apt install -y php8.0 php8.0-fpm php8.0-mysql php8.0-pgsql
        </code></pre>
      `
    },
    {
      title: "Установка Nginx",
      content: `
        <h3>Установка Nginx</h3>
        <pre><code class="language-bash">
apt install -y nginx
systemctl start nginx
systemctl enable nginx
        </code></pre>
        
        <h3>Базовая конфигурация</h3>
        <pre><code class="language-nginx">
server {
    listen 80;
    server_name example.com;
    root /var/www/html;
    
    location / {
        try_files $uri $uri/ =404;
    }
    
    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
    }
}
        </code></pre>
      `
    },
    {
      title: "Установка Zabbix",
      content: `
        <h3>Установка репозитория Zabbix</h3>
        <pre><code class="language-bash">
wget https://repo.zabbix.com/zabbix/5.4/debian/pool/main/z/zabbix-release/zabbix-release_5.4-1+debian10_all.deb
dpkg -i zabbix-release_5.4-1+debian10_all.deb
apt update
        </code></pre>
        
        <h3>Установка Zabbix сервера</h3>
        <pre><code class="language-bash">
apt install -y zabbix-server-mysql zabbix-frontend-php zabbix-nginx-conf zabbix-agent
        </code></pre>
        
        <h3>Создание базы данных</h3>
        <pre><code class="language-sql">
CREATE DATABASE zabbix character set utf8 collate utf8_bin;
CREATE USER 'zabbix'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON zabbix.* TO 'zabbix'@'localhost';
FLUSH PRIVILEGES;
        </code></pre>
      `
    },
    {
      title: "Проверка установки",
      content: `
        <h3>Проверка служб</h3>
        <pre><code class="language-bash">
systemctl status mysql
systemctl status postgresql
systemctl status php7.4-fpm
systemctl status php8.0-fpm
systemctl status nginx
systemctl status zabbix-server
        </code></pre>
        
        <h3>Проверка версий</h3>
        <pre><code class="language-bash">
mysql --version
psql --version
php --version
nginx -v
zabbix_server -V
        </code></pre>
        
        <h3>Проверка портов</h3>
        <pre><code class="language-bash">
netstat -tulpn
        </code></pre>
      `
    }
  ];
}