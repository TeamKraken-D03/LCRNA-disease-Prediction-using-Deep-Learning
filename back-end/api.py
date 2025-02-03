from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
DB_CONFIG = {
    'user': 'Naren',
    'password': 'Naren@4010',
    'host': '127.0.0.1',
    'database': 'ncRNA_Database',  
    'port': 3306 }

def get_db_connection():
    """ Establishes and returns a new database connection """
    return mysql.connector.connect(**DB_CONFIG)

@app.route('/')
def home():
    return jsonify({"message": "ncRNA API is running!"})

# GET ncRNA by symbol
@app.route('/ncRNA/<string:symbol>', methods=['GET'])
def get_ncRNA_by_symbol(symbol):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM ncRNA_Data WHERE `ncRNA Symbol` = %s"
        cursor.execute(query, (symbol,))
        result = cursor.fetchall()

        cursor.close()
        conn.close()

        if result:
            return jsonify(result), 200
        else:
            return jsonify({"error": "No data found for symbol: " + symbol}), 404

    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {err}"}), 500

#GET ncRNA by symbol
@app.route('/ncRNA/disease/<string:disease>', methods=['GET'])
def get_ncRNA_by_disease(disease):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        
        query = "SELECT * FROM ncRNA_Data WHERE `Disease Name` = %s"
        cursor.execute(query, (disease,))
        result = cursor.fetchall()

        cursor.close()
        conn.close()

        if result:
            return jsonify(result), 200
        else:
            return jsonify({"error": "No data found for Disease: " + disease}), 404

    except mysql.connector.Error as err:
        return jsonify({"error": f"MySQL Error: {err}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
