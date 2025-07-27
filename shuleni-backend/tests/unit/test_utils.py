from app.utils.validation import validate_school_creation

def test_validation():
    errors = validate_school_creation({
        'name': 'A',
        'owner_name': '',
        'email': 'invalid',
        'password': '123'
    })
    assert all(field in errors for field in ['name', 'owner_name', 'email', 'password'])
