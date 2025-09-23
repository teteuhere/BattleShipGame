#!/bin/bash
# Este script automatiza todo o processo de inicialização do ambiente.
# 1. Derruba containers antigos para uma limpeza completa.
# 2. Reconstrói as imagens para garantir que estão atualizadas.
# 3. Sobe todos os serviços em background (banco de dados, backend, IA).
# 4. AGUARDA o banco de dados estar 100% pronto.
# 5. Roda as migrações do Django para construir o banco de dados.
# 6. Prepara e inicia o servidor de desenvolvimento do frontend.

# --- CORES PARA DEIXAR O TERMINAL BONITÃO ---
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # Sem Cor

echo -e "${YELLOW}Preparando para o lançamento! Desligando as forças anteriores...${NC}"
docker-compose down

echo -e "${YELLOW}Reconstruindo e implantando os navios (containers)...${NC}"
docker-compose up -d --build

echo -e "${YELLOW}Aguardando o banco de dados (mysql_db) ficar 100% operacional...${NC}"
# Este loop espera até que o container do banco de dados esteja saudável
until [ "`docker inspect -f {{.State.Health.Status}} mysql_db`"=="healthy" ]; do
    sleep 1;
done;

echo -e "${GREEN}Banco de dados pronto! Construindo a estrutura (executando as migrations)...${NC}"
# Cria as "plantas" do banco de dados (se houver novas)
docker-compose exec web python manage.py makemigrations
# Constrói as tabelas no banco de dados com base nas plantas
docker-compose exec web python manage.py migrate

echo -e "${GREEN}Universo construído com sucesso! Iniciando o painel de controle (frontend)...${NC}"
# Navega para a pasta do frontend
cd frontend

echo "Instalando as dependências do frontend (npm install)..."
npm install

echo "Ligando o servidor do frontend (npm run dev)..."
npm run dev

echo -e "${GREEN}Todos a bordo! A aplicação está no ar em http://localhost:5173${NC}"
