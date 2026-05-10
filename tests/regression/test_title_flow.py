import pytest
from app.title_flow import generate_title, TitleFlowError

def test_generate_title_basic():
    input_data = {
        "author": "Alice",
        "content": "A quick brown fox jumps over the lazy dog."
    }
    title = generate_title(input_data)
    assert isinstance(title, str)
    assert len(title.strip()) > 0

def test_generate_title_empty_content():
    input_data = {
        "author": "Alice",
        "content": ""
    }
    with pytest.raises(TitleFlowError):
        generate_title(input_data)

def test_generate_title_missing_author():
    input_data = {
        "content": "Jumps over text."
    }
    title = generate_title(input_data)
    assert isinstance(title, str)
    assert len(title.strip()) > 0

def test_generate_title_special_characters():
    input_data = {
        "author": "Bob",
        "content": "Symbols: !@#$%^&*() are in the text."
    }
    title = generate_title(input_data)
    assert isinstance(title, str)
    assert len(title.strip()) > 0

def test_generate_title_long_content():
    input_data = {
        "author": "Carol",
        "content": "This is a long content. " * 50
    }
    title = generate_title(input_data)
    assert isinstance(title, str)
    assert len(title.strip()) > 0
