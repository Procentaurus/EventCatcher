from pathlib import Path
import os

def deleteFile(path, id):
    if path != '/images/model.png':
        BASE_DIR = Path(__file__).resolve().parent.parent
        final_path = str(BASE_DIR) +'/static/images/profileimages/user_'+ str(id) + '/' + str(path)
        if os.path.exists(final_path):
            os.remove(final_path)
        return True
    else:
        return False