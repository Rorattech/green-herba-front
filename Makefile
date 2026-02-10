PROJECT_NAME := green-herba-front
FRONTEND_SERVICE := frontend

.PHONY: help
help: ## Show available make commands
	@echo "Make commands for $(PROJECT_NAME):"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## ' Makefile | sed -E 's/:.*?## / - /'

.PHONY: install
install: ## Install Node dependencies
	npm install

.PHONY: dev
dev: ## Run Next.js dev server locally (without Docker)
	npm run dev

.PHONY: build
build: ## Build Next.js app
	npm run build

.PHONY: start
start: ## Start Next.js in production mode (without Docker)
	npm run start

.PHONY: lint
lint: ## Run ESLint
	npm run lint

.PHONY: test
test: ## Run Jest tests
	npm test

.PHONY: test-watch
test-watch: ## Run Jest in watch mode
	npm run test:watch

.PHONY: dc-build
dc-build: ## Build Docker images with docker compose
	docker compose build

.PHONY: dc-up
dc-up: ## Start app with docker compose (detached)
	docker compose up -d

.PHONY: dc-down
dc-down: ## Stop and remove docker compose containers
	docker compose down

.PHONY: dc-logs
dc-logs: ## Follow logs from docker compose
	docker compose logs -f

.PHONY: dc-restart
dc-restart: ## Restart docker compose stack
	docker compose down && docker compose up -d

