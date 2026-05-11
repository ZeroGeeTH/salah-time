import re
from typing import List

def detect_followup_requests(messages: List[str]) -> List[bool]:
    """
    Detects if each message in `messages` is a follow-up generation request.
    Returns a list of bool where True = follow-up detected.
    """
    followup_patterns = [
        r"follow(-| )?up( (request|generation|question|task))?",
        r"another (request|question|example|task)",
        r"next (request|question|step|task|generation)",
        r"generate (more|again|another)",
        r"continue (generating|generation|with request)",
        r"additional (request|question|task|generation)",
        r"respond again",
        r"please (continue|elaborate|expand)",
    ]
    pattern = re.compile("|".join(f"(?:{pat})" for pat in followup_patterns), re.IGNORECASE)
    return [bool(pattern.search(text)) for text in messages]
