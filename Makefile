dev:
		docker compose up -d --build
dev-down:
		docker compose down
dev-logs:
		docker compose logs -f
prod:
		docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -dev
prod-down:
		docker compose -f docker-compose.yml -f docker-compose.prod.yml down
prod-logs:
		docker compose -f docker-compose.yml -f docker-compose.prod.yml logs -f

clean:
		docker system prune -a --volumes -f
