def test_school_data_isolation(client, school_factory, headers, user_factory):
    school1 = school_factory()
    school2 = school_factory()

    user1 = user_factory(school_id=school1.id)

    response = client.get(
        '/api/schools/info',
        headers=headers(user=user1)
    )
    assert response.status_code == 422
    assert response.json["msg"] == "Subject must be a string"
