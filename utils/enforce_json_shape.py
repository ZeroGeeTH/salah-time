import json
from typing import Any

def enforce_strict_json_shape(response: Any) -> dict:
    """
    Ensures the response strictly contains only:
    {
      "files": [
        {
          "path": "...",
          "content": "..."
        }
      ],
      "notes": ["..."]
    }
    - No other keys or structures allowed.
    - Files must be a list of dict with exact 'path' and 'content' keys (all strings).
    - Notes must be a list of strings.
    Raises ValueError on any deviation.
    """
    # Top level must be dict
    if not isinstance(response, dict):
        raise ValueError("Response must be a dictionary.")
    # Must have exact keys
    allowed_keys = {'files', 'notes'}
    if set(response.keys()) != allowed_keys:
        raise ValueError(f"Response must have only keys: {allowed_keys}")
    # Check files
    files = response['files']
    if not isinstance(files, list):
        raise ValueError("'files' must be a list.")
    for file in files:
        if not isinstance(file, dict):
            raise ValueError("Each file entry must be a dictionary.")
        if set(file.keys()) != {'path', 'content'}:
            raise ValueError("Each file must have only 'path' and 'content' keys.")
        if not isinstance(file['path'], str) or not isinstance(file['content'], str):
            raise ValueError("'path' and 'content' must be strings.")
    # Check notes
    notes = response['notes']
    if not isinstance(notes, list):
        raise ValueError("'notes' must be a list.")
    for note in notes:
        if not isinstance(note, str):
            raise ValueError("Each note must be a string.")
    return response
