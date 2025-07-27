def test_register_school(client, headers):
    response = client.post('/auth/register/school', json={
        'name': 'New School',
        'owner_name': 'Owner',
        'email': 'new@school.com',
        'password': 'password123'
    }, headers=headers())
    assert response.status_code == 201
    assert 'access_token' in response.json


def test_login(client, user_factory, headers):
    user = user_factory(email='test@user.com', password='mypass')
    response = client.post('/auth/login', json={
        'email': 'test@user.com',
        'password': 'mypass'
    }, headers=headers())
    assert response.status_code == 200
    assert 'access_token' in response.json
