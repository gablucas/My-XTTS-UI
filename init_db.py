import sqlite3
from config import Config

def init_db():
    print("Loading DB...")
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS audio_files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            voice_name TEXT NOT NULL,
            audio_text TEXT NOT NULL,
            audio_name TEXT NOT NULL,
            audio_path TEXT NOT NULL
        )
    ''')

    # Criar tabela para vozes
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS voices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            voice_name TEXT NOT NULL,
            voice_path TEXT NO NULL,
            voice_emotion TEXT NOT NULL
        )
    ''')
    cursor.execute('''
            INSERT INTO your_table_name (name, emotion)
            VALUES (?, ?)
        ''', ('value1', 'value2'))

    conn.commit()
    conn.close();

if __name__ == '__main__':
    init_db()