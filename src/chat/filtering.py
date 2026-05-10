from typing import List, Dict, Any

def filter_messages(messages: List[Dict[str, Any]], context_criteria: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Filters a list of chat messages based on their content and history context.

    Args:
        messages: A list of chat message dicts, each dict should contain at least 'content' and 'metadata' keys.
        context_criteria: Dict defining criteria that must be satisfied in previous messages to let a message through.

    Returns:
        Filtered list of message dicts.
    """
    filtered = []
    for i, msg in enumerate(messages):
        matches = True
        for key, value in context_criteria.items():
            # Look for this key/value pair in the prior history up to but not including this message
            found_in_history = False
            for prev_msg in messages[:i]:
                if isinstance(prev_msg.get('metadata', {}), dict):
                    if prev_msg['metadata'].get(key) == value:
                        found_in_history = True
                        break
            if not found_in_history:
                matches = False
                break
        if matches:
            filtered.append(msg)
    return filtered
