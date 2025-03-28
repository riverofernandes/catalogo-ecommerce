## Instalação e Uso API

### **Pré-requisitos**
- Docker
- Docker Compose

### **1 Clonar o Repositório**
```sh
git clone https://github.com/riverofernandes/catalogo-ecommerce.git
cd catalogo-ecommerce/api-laravel
```

### **2 Instalar Dependências**
```sh
composer install
```

### **3 Configurar Variáveis de Ambiente**
Copie o arquivo `.env.example` e renomeie para `.env`:
```sh
cp .env.example .env
```
Edite o arquivo `.env` para configurar o banco de dados.

### **4 Gerar a Chave da Aplicação**
```sh
php artisan key:generate
```

### **5 Subir os Containers com Laravel Sail**
```sh
./vendor/bin/sail up -d
```

### **6 Rodar as Migrations**
```sh
php artisan migrate ou sail artisan migrate
```
caso queirar popular o banco com alguns produtos 
```sh
php artisan db:seed --class=ProductSeeder ou sail artisan db:seed --class=ProductSeeder
```

### **7 Rodar o Servidor** (Opcional)
```sh
php artisan serve
```
A API estará disponível em `http://localhost`

### **8 Rodar os Testes**
Para garantir que a API está funcionando corretamente, execute os testes:
```sh
php artisan test
```

## Instalação e Uso Front React.js

### **1 Acesse o Ambiente**
cd ..
cd frontend

### **2 Configurar Variáveis de Ambiente**
Copie o arquivo `.env.example` e renomeie para `.env`:
```sh
cp .env.example .env
```
Edite o arquivo `.env` no campo REACT_APP_PUBLIC_APP_URL_API para configurar o acesso a API.

### **3 Instalar Dependências**
```sh
npm install
```

### **4 Iniciar Projeto**
```sh
npm start
```