#GERAR CAMINHO DE SAIDA
import os

def get_unique_output_path(path, voice):
    base_name = f"{voice}"
    counter = 1
    while True:
        output_path = os.path.join(path, f"{base_name}_{counter}.wav")
        if not os.path.exists(output_path):
            break
        counter += 1
    return base_name, output_path

#EXCLUIR AUDIOS
def delete_file_folder(file_path):
    try:
        os.remove(file_path)
        return True, f"File {file_path} deleted successfully."
    except FileNotFoundError:
        return False, f"File {file_path} not found."
    except Exception as e:
        return False, f"Error occurred while deleting file {file_path}: {e}"