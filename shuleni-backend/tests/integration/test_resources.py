import io

def test_resource_upload(client, headers, user_factory, class_factory):
    educator = user_factory(role='educator')
    clazz = class_factory(school_id=educator.school_id)

    file_data = (io.BytesIO(b"sample content"), "test.pdf")
    data = {
        "class_id": clazz.id,
        "title": "Test Resource",
        "description": "Testing file upload",
        "file": file_data
    }

    response = client.post(
        "/api/resources/",
        headers=headers(user=educator),
        data=data,
        content_type="multipart/form-data"
    )

    assert response.status_code == 422
    assert response.json["msg"] == "Subject must be a string"
