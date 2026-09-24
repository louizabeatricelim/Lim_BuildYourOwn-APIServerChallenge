import sqlite3

conn = sqlite3.connect('games.db')
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    genre TEXT NOT NULL,
    platform TEXT NOT NULL,
    release_year INTEGER NOT NULL,
    developer TEXT NOT NULL,
    rating REAL
)
""")

games = [
    ("The Legend of Zelda: Breath of the Wild", "Action-Adventure", "Nintendo Switch", 2017, "Nintendo EPD", 9.7),
    ("Elden Ring", "Action RPG", "PC", 2022, "FromSoftware", 9.6),
    ("God of War Ragnarök", "Action-Adventure", "PlayStation 5", 2022, "Santa Monica Studio", 9.4),
    ("Minecraft", "Sandbox", "PC", 2011, "Mojang Studios", 9.0),
    ("Grand Theft Auto V", "Action", "PlayStation 4", 2013, "Rockstar North", 9.5),
    ("Red Dead Redemption 2", "Action-Adventure", "PC", 2018, "Rockstar Games", 9.7),
    ("The Witcher 3: Wild Hunt", "RPG", "PC", 2015, "CD Projekt Red", 9.3),
    ("Hollow Knight", "Metroidvania", "Nintendo Switch", 2017, "Team Cherry", 9.1),
    ("Hades", "Roguelike", "PC", 2020, "Supergiant Games", 9.2),
    ("Animal Crossing: New Horizons", "Life Sim", "Nintendo Switch", 2020, "Nintendo EPD", 8.8),
    ("Celeste", "Platformer", "PC", 2018, "Extremely OK Games", 9.0),
    ("Stardew Valley", "Farming Sim", "PC", 2016, "ConcernedApe", 9.1),
    ("Super Mario Odyssey", "Platformer", "Nintendo Switch", 2017, "Nintendo EPD", 9.5),
    ("Portal 2", "Puzzle", "PC", 2011, "Valve", 9.5),
    ("Among Us", "Party", "PC", 2018, "Innersloth", 8.0),
]

cursor.executemany(
    """
    INSERT INTO games (title, genre, platform, release_year, developer, rating)
    VALUES (?, ?, ?, ?, ?, ?)
    """,
    games,
)

conn.commit()
conn.close()
print("Database seeded.")