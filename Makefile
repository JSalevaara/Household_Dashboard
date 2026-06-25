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

db-shell:
		$(DC_PROD) exec db psql -U $(DB_USER) -d $(DB_NAME)

migrate:
		$(DC_PROD) exec -T backend alembic upgrade head

init-db:
		$(DC_PROD) exec -T backend python -m app.init_db

env-check:
		$(DC_PROD) exec backend env | sort

# --- NEW: Graceful Reload (0 dropped connections) ---
reload-nginx:
		@echo "Gracefully reloading Nginx config and DNS..."
		$(DC_PROD) exec nginx nginx -s reload

# --- NEW: Safe Cleanup (Won't crash your server) ---
clean:
		@echo "Pruning old unused Docker images (safely)..."
		docker image prune -af --filter "until=24h"

# --- NEW: Safe permission fix (just in case dev files get stuck) ---
fix-perms:
		@echo "Fixing permissions using container..."
		docker run --rm -v $(shell pwd):/app -w /app alpine chown -R $(shell id -u):$(shell id -g) .