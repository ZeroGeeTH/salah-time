import pytest
from contracts.followup_response import FollowUpResponse

def test_followup_response_create():
    response = FollowUpResponse(status="ok", message="Test passed.", data={"foo": 1})
    assert response.status == "ok"
    assert response.message == "Test passed."
    assert response.data == {"foo": 1}

def test_followup_response_status():
    response = FollowUpResponse(status="error", message="An error occurred.", data=None)
    assert response.status == "error"
    assert response.message == "An error occurred."
    assert response.data is None

def test_followup_response_data_types():
    response = FollowUpResponse(status="pending", message="Waiting", data=[1,2,3])
    assert isinstance(response.data, list)
    response = FollowUpResponse(status="done", message="Complete", data="result string")
    assert isinstance(response.data, str)

@pytest.mark.parametrize("status,message,data", [
    ("ok", "All good", {"id": 1}),
    ("fail", "Failure", None),
    ("processing", "Pending...", 123),
])
def test_followup_response_various_inputs(status, message, data):
    resp = FollowUpResponse(status=status, message=message, data=data)
    assert resp.status == status
    assert resp.message == message
    assert resp.data == data
