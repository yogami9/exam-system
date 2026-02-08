#!/usr/bin/env python3
"""
Quick MongoDB Atlas Connection Test
Run this to verify your connection is working
"""

import os
from pymongo import MongoClient
from dotenv import load_dotenv

# Load environment variables
load_dotenv('.env.local')

def test_connection():
    print("=" * 60)
    print("MongoDB Atlas Connection Test")
    print("=" * 60)
    print()
    
    # Get connection string
    mongodb_uri = os.getenv('MONGODB_URI')
    
    if not mongodb_uri:
        print("❌ Error: MONGODB_URI not found in .env.local")
        return False
    
    print("📍 Connection String: " + mongodb_uri[:50] + "...")
    print()
    print("🔌 Testing connection to MongoDB Atlas...")
    print()
    
    try:
        # Create client with timeout
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=10000)
        
        # Test connection with ping
        result = client.admin.command('ping')
        
        if result.get('ok') == 1:
            print("✅ SUCCESS! Connected to MongoDB Atlas")
            print()
            
            # Get database info
            db_name = 'bips_exam_system'
            db = client[db_name]
            
            # List collections
            collections = db.list_collection_names()
            
            print(f"📊 Database: {db_name}")
            print(f"📁 Collections: {len(collections)}")
            
            if collections:
                print()
                print("Collections found:")
                for coll in collections:
                    count = db[coll].count_documents({})
                    print(f"  • {coll}: {count} documents")
            else:
                print()
                print("ℹ️  No collections yet. Run setup_mongodb_complete.py to initialize.")
            
            print()
            print("=" * 60)
            print("✅ Your MongoDB Atlas connection is working perfectly!")
            print("=" * 60)
            
            client.close()
            return True
            
    except Exception as e:
        print(f"❌ Connection failed: {str(e)}")
        print()
        print("Common issues:")
        print("  1. Check your internet connection")
        print("  2. Verify the connection string in .env.local")
        print("  3. Ensure your IP is whitelisted in MongoDB Atlas")
        print("     → Go to: https://cloud.mongodb.com")
        print("     → Network Access → Add IP Address")
        print("     → Allow Access from Anywhere (for development)")
        print()
        return False

if __name__ == "__main__":
    test_connection()
