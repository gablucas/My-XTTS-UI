import sqlite3
from flask import current_app
from config import Config

def save_voice(voice_name, voice_path, voice_emotion, voice_type, voice_complement):
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO voices (voice_name, voice_path, voice_emotion, voice_type, voice_complement)
        VALUES (?, ?, ?, ?, ?)
    ''', (voice_name, voice_path, voice_emotion, voice_type, voice_complement))
    conn.commit()
    conn.close()

def get_voices_db():
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM voices')
    voices = cursor.fetchall()
    conn.close()
    return voices

def get_voice(voice_id):
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM voices WHERE id = ?', (voice_id,))
    voice = cursor.fetchone()
    conn.close()
    return voice

def update_voice(voice_id, name, description=''):
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        UPDATE voices
        SET name = ?, description = ?
        WHERE id = ?
    ''', (name, description, voice_id))
    conn.commit()
    conn.close()

def delete_voice(voice_id):
    conn = sqlite3.connect(Config.DATABASE)
    cursor = conn.cursor()
    cursor.execute('DELETE FROM voices WHERE id = ?', (voice_id,))
    conn.commit()
    conn.close()