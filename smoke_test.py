import sys

def main():
    # Try importing the main module to ensure it loads without error
    try:
        import main
        print("Smoke test passed: main module imported successfully.")
    except Exception as e:
        print(f"Smoke test failed: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
