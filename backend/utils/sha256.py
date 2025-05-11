import hashlib

def sha256(input: str) -> str:
    byte = input.encode("utf-8")
    hash = hashlib.sha256(byte).hexdigest()
    return hash