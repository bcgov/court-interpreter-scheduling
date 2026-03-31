import sys
import os

# Ensure the api/ directory is on sys.path so imports like
# "from models.booking_model import ..." resolve correctly.
sys.path.insert(0, os.path.dirname(__file__))
