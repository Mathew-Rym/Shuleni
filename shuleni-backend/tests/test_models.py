import os
from pathlib import Path

def test_run_file_exists():
    # Adjust the path based on where this test runs from
    run_path = Path("shuleni-backend/run.py")
    assert run_path.exists(), "❌ 'run.py' not found in the root directory."

def test_run_file_has_app_creation():
    run_path = Path("shuleni-backend/run.py")
    content = run_path.read_text()

    # Look for create_app pattern or app instantiation
    assert "create_app" in content, "❌ 'run.py' does not include 'create_app()' function."
    assert "app = create_app()" in content or "app=create_app()" in content, "❌ 'run.py' is missing 'app = create_app()' assignment."
