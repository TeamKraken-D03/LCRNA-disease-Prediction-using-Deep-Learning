from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
from collections import OrderedDict

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    'user': 'Naren',
    'password': 'Naren@4010',
    'host': '127.0.0.1',
    'database': 'ncRNA_Database',
    'port': 3306
}

def get_db_connection():
    """ Establishes and returns a new database connection """
    return mysql.connector.connect(**DB_CONFIG)

@app.get("/")
async def home():
    return {"message": "ncRNA API is running!"}

@app.get("/ncRNA/{symbol}")
async def get_ncRNA_by_symbol(symbol: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
        SELECT `PubMed ID`, `ncRNA Symbol`, `ncRNA Category`, `Species`, `Disease Name`, 
               `Sample`, `Dysfunction Pattern`, `Validated Method`, `Clinical Application`, `Causality` 
        FROM ncRNA_Data 
        WHERE `ncRNA Symbol` = %s
        """
        cursor.execute(query, (symbol,))
        result = cursor.fetchall()
        column_names = [desc[0] for desc in cursor.description]

        cursor.close()
        conn.close()

        if result:
            desired_order = [
                "PubMed ID", "ncRNA Symbol", "ncRNA Category", "Species", "Disease Name",
                "Sample", "Dysfunction Pattern", "Validated Method", "Clinical Application", "Causality"
            ]

            ordered_result = [
                OrderedDict((col, row[column_names.index(col)]) for col in desired_order) for row in result
            ]

            return ordered_result
        else:
            raise HTTPException(status_code=404, detail=f"No data found for symbol: {symbol}")

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"MySQL Error: {err}")

@app.get("/ncRNA/disease/{disease}")
async def get_ncRNA_by_disease(disease: str):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = "SELECT * FROM ncRNA_Data WHERE `Disease Name` = %s"
        cursor.execute(query, (disease,))
        result = cursor.fetchall()

        cursor.close()
        conn.close()

        if result:
            return result
        else:
            raise HTTPException(status_code=404, detail=f"No data found for Disease: {disease}")

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"MySQL Error: {err}")

# Run using: uvicorn filename:app --reload [filename = api.py]
#unicorn api:app --reload
