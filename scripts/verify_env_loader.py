import os

REQUIRED_ENV_VARS = [
    'DATABASE_URL',
    'SECRET_KEY',
    'API_KEY',
]

def main():
    missing = []
    for var in REQUIRED_ENV_VARS:
        if not os.environ.get(var):
            missing.append(var)
    if missing:
        print(f"Missing required environment variables: {', '.join(missing)}")
        exit(1)
    print("All required environment variables are set.")
    exit(0)

if __name__ == "__main__":
    main()
