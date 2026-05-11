import pytest

from my_module import analyze_text


def test_language_compliance_english():
    text = "This is an English sentence."
    result = analyze_text(text)
    assert result["language"] == "en"


def test_language_compliance_non_english():
    text = "C'est une phrase en français."
    result = analyze_text(text)
    assert result["language"] == "fr"


def test_relevance_compliance_relevant():
    text = "The rain in Spain falls mainly on the plain."
    topic = "weather"
    result = analyze_text(text, topic=topic)
    assert result["relevance"] >= 0.6


def test_relevance_compliance_irrelevant():
    text = "The quick brown fox jumps over the lazy dog."
    topic = "climate change"
    result = analyze_text(text, topic=topic)
    assert result["relevance"] <= 0.2


def test_format_compliance_plain_text():
    text = "Just plain text here."
    result = analyze_text(text)
    assert result["format_compliance"] is True


def test_format_compliance_has_html():
    text = "<html><body>Invalid format</body></html>"
    result = analyze_text(text)
    assert result["format_compliance"] is False
