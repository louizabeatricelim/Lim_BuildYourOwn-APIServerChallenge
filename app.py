from flask import Flask, jsonify, request
import sqlite3

app = Flask(__name__)

REQUIRED_FIELDS = ["title", "genre", "platform", "release_year", "developer"]

def get_db():
    conn = sqlite3.connect("games.db")
    conn.row_factory = sqlite3.Row  # lets you access columns by name
    return conn

def validate_game_input(data):
    """Returns (cleaned_dict, None) or (None, error_response_tuple)."""
    if not data or not isinstance(data, dict):
        return None, (jsonify({"error": "Request body must be JSON"}), 400)

    missing = [
        field for field in REQUIRED_FIELDS
        if field not in data or data[field] is None or data[field] == ""
    ]
    if missing:
        return None, (
            jsonify({
                "error": f"Missing required fields: {', '.join(missing)}"
            }),
            400,
        )

    cleaned = {
        "title": data["title"],
        "genre": data["genre"],
        "platform": data["platform"],
        "release_year": data["release_year"],
        "developer": data["developer"],
        "rating": data.get("rating"),
    }
    return cleaned, None

@app.route("/")
def home():
    return jsonify({"message": "Games API is running"})

@app.route("/games", methods=["GET"])
def get_games():
    conn = get_db()
    rows = conn.execute("SELECT * FROM games").fetchall()
    conn.close()
    return jsonify([dict(row) for row in rows])

@app.route("/games/<int:id>", methods=["GET"])
def get_game(id):
    conn = get_db()
    row = conn.execute("SELECT * FROM games WHERE id = ?", (id,)).fetchone()
    conn.close()

    if row is None:
        return jsonify({"error": "Game not found"}), 404

    return jsonify(dict(row)), 200

@app.route("/games", methods=["POST"])
def add_game():
    data = request.get_json(silent=True)
    cleaned, error = validate_game_input(data)
    if error:
        return error

    conn = get_db()
    cursor = conn.execute(
        """
        INSERT INTO games (title, genre, platform, release_year, developer, rating)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            cleaned["title"],
            cleaned["genre"],
            cleaned["platform"],
            cleaned["release_year"],
            cleaned["developer"],
            cleaned["rating"],
        ),
    )
    conn.commit()
    new_id = cursor.lastrowid
    row = conn.execute("SELECT * FROM games WHERE id = ?", (new_id,)).fetchone()
    conn.close()

    return jsonify(dict(row)), 201

@app.route("/games/<int:id>", methods=["PUT"])
def update_game(id):
    data = request.get_json(silent=True)
    cleaned, error = validate_game_input(data)
    if error:
        return error

    conn = get_db()
    existing = conn.execute("SELECT * FROM games WHERE id = ?", (id,)).fetchone()
    if existing is None:
        conn.close()
        return jsonify({"error": "Game not found"}), 404

    conn.execute(
        """
        UPDATE games
        SET title = ?, genre = ?, platform = ?, release_year = ?, developer = ?, rating = ?
        WHERE id = ?
        """,
        (
            cleaned["title"],
            cleaned["genre"],
            cleaned["platform"],
            cleaned["release_year"],
            cleaned["developer"],
            cleaned["rating"],
            id,
        ),
    )
    conn.commit()
    row = conn.execute("SELECT * FROM games WHERE id = ?", (id,)).fetchone()
    conn.close()

    return jsonify(dict(row)), 200

@app.route("/games/<int:id>", methods=["DELETE"])
def delete_game(id):
    conn = get_db()
    existing = conn.execute("SELECT * FROM games WHERE id = ?", (id,)).fetchone()
    if existing is None:
        conn.close()
        return jsonify({"error": "Game not found"}), 404

    title = existing["title"]
    conn.execute("DELETE FROM games WHERE id = ?", (id,))
    conn.commit()
    conn.close()

    return jsonify({
        "message": f"Game deleted: id={id}, title={title}"
    }), 200

if __name__ == "__main__":
    app.run(debug=True)