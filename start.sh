echo "Preparando para o lançamento! Desligando as forças anteriores..."
docker-compose down

echo "Reconstruindo e implantando os navios (containers)..."
docker-compose up -d --build

echo "Iniciando o painel de controle (frontend)..."
cd frontend

echo "Instalando as dependências do frontend (npm install)..."
npm install

echo "Ligando o servidor do frontend (npm run dev)..."
npm run dev

echo "Todos a bordo! A aplicação está no ar em http://localhost:5173"