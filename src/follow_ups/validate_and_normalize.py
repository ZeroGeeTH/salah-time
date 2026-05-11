from typing import Any, Dict, List, Tuple, Union

class FollowUpValidationError(Exception):
    pass

def validate_and_normalize_follow_ups(payload: Any) -> List[Dict[str, Any]]:
    """
    Validates and normalizes a follow_ups payload.

    Args:
        payload: The payload to validate, which should be a list of follow-up dicts.

    Returns:
        A normalized list of follow-up dicts.
    Raises:
        FollowUpValidationError: if payload is invalid.
    """
    if not isinstance(payload, list):
        raise FollowUpValidationError("Payload must be a list of follow-up items.")

    normalized = []
    for idx, item in enumerate(payload):
        if not isinstance(item, dict):
            raise FollowUpValidationError(f"Follow-up at index {idx} is not a dict.")
        # Normalize and validate fields
        normalized_item = {}
        # Example required field: 'message'
        if 'message' not in item or not isinstance(item['message'], str):
            raise FollowUpValidationError(f"Missing or invalid 'message' in follow-up at index {idx}.")
        normalized_item['message'] = item['message'].strip()

        # Optional field: 'type', normalized to lower-case if present
        if 'type' in item:
            if not isinstance(item['type'], str):
                raise FollowUpValidationError(f"Invalid 'type' in follow-up at index {idx}.")
            normalized_item['type'] = item['type'].strip().lower()
        else:
            normalized_item['type'] = 'default'
        
        # Optional field: 'metadata'
        if 'metadata' in item:
            if not isinstance(item['metadata'], dict):
                raise FollowUpValidationError(f"Invalid 'metadata' in follow-up at index {idx}.")
            normalized_item['metadata'] = item['metadata']
        else:
            normalized_item['metadata'] = {}

        normalized.append(normalized_item)
    return normalized
