DC_DEV = docker compose
DC_PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml
include .env

dev:
		$(DC_DEV) up -d --build
dev-down:
		$(DC_DEV) down
dev-logs:
		$(DC_DEV) logs -f
dev-db-shell:
		$(DC_DEV) exec db psql -U testuser -d dashboard_db
prod:
		$(DC_PROD) up --build -d
prod-down:
		$(DC_PROD) down
prod-logs:
		$(DC_PROD) logs -f

clean:
		@echo "WARNING: This removes all stopped containers, used networks and volumes!"
		docker system prune -a --volumes -f

db-shell:
		$(DC_PROD) exec db psql -U $(DB_USER) -d $(DB_NAME)

migrate:
		$(DC_PROD) exec backend alembic upgrade head

env-check:
		$(DC_PROD) exec backend env | sort

restart-nginx:
		$(DC_PROD) restart nginx