# SALVAR DADOS NO BANCO DE DADOS
import sqlite3
from config import Config

def save_audio_db(audio_name, audio_text, audio_path, audio_type, voice_id, voice_name):
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO audio_files (audio_name, audio_text, audio_path, audio_type, voice_id, voice_name)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (audio_name, audio_text, audio_path, audio_type, voice_id, voice_name))
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
    conn = sqlite3.connect(Config.DATABASE)
    try:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM audio_files WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return (True, "Audio deleted successfully")
    except sqlite3.Error as e:
        conn.rollback()
        conn.close()
        return (False, f"Error deleting voice: {e}")