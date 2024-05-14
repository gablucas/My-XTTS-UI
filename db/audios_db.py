# SALVAR DADOS NO BANCO DE DADOS
import sqlite3
from config import Config

def save_audio(voice_name, audio_text, audio_name, audio_path):
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO audio_files (voice_name, audio_text, audio_name, audio_path)
        VALUES (?, ?, ?, ?)
    ''', (voice_name, audio_text, audio_name, audio_path))
    conn.commit()
    conn.close()

def get_audios():
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM audio_files')
    audio_files = cursor.fetchall()
    conn.close()

    return audio_files

def delete_audio_db(id):
    try:
        conn = sqlite3.connect(Config.DATABASE)
        cursor = conn.cursor()
        cursor.execute('DELETE FROM audio_files WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return True, "Database entry deleted successfully."
    except Exception as e:
        return False, f"Error occurred while deleting database entry: {e}"