DC_DEV = docker compose
DC_PROD = docker compose -f docker-compose.yml -f docker-compose.prod.yml
include .env

#Dev commands
dev:
		$(DC_DEV) up -d --build
dev-down:
		$(DC_DEV) down
dev-logs:
		$(DC_DEV) logs -f
dev-db-shell:
		$(DC_DEV) exec db psql -U testuser -d dashboard_db

#Production commands
prod:
		@echo ""
		@echo "🚀 === Starting Core Application === 🚀"
		$(DC_PROD) build
		$(DC_PROD) up -d
		@echo ""
		@echo "📊 === Starting Monitoring Stack === 📊"
		$(DC_PROD) up -d --no-deps prometheus cadvisor grafana
prod-down:
		$(DC_PROD) --profile monitoring down
prod-logs:
		$(DC_PROD) logs -f

#Utility commands
db-shell:
		$(DC_PROD) exec db psql -U $(DB_USER) -d $(DB_NAME)

migrate:
		$(DC_PROD) exec -T backend alembic upgrade head

init-db:
		$(DC_PROD) exec -T backend python -m app.init_db

env-check:
		$(DC_PROD) exec backend env | sort

reload-nginx:
		@echo "Gracefully reloading Nginx config and DNS..."
		$(DC_PROD) exec nginx nginx -s reload

clean:
		@echo "Pruning old unused Docker images (safely)..."
		docker image prune -af --filter "until=24h"

fix-perms:
		@echo "Fixing permissions using container..."
		docker run --rm -v $(shell pwd):/app -w /app alpine chown -R $(shell id -u):$(shell id -g) .

#Testing commands
test-backend:
		@echo "Running backend tests..."
		$(DC_PROD) exec backend pytest

test-frontend:
		@echo "Running frontend tests..."

test-all: test-backend test-frontend