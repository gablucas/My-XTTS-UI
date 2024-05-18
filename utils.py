#GERAR CAMINHO DE SAIDA
import os

def get_unique_output_path(path, voice):
    counter = 1
    base_name = f"{voice}_{counter}"
    while True:
        base_name = f"{voice}_{counter}"
        output_path = os.path.join(path, f"{base_name}.wav")
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