echo "Desligando anteriores"
docker-compose down

echo "Criando e lançando containers"
docker-compose up -d --build

echo "Iniciando frontend"
cd frontend && npm run dev

echo "Aplicação iniciada. Acesse em http://localhost:5173"
