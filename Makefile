.PHONY: format check

format:
    cd frontend && npm run format
    cd backend && black .

check:
    cd frontend && npm run check
    cd backend && black --check .