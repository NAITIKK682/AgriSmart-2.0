"""
Seed data script for AgriSmart 2.0
Populates the database with sample data for testing
"""

import sqlite3
from datetime import datetime, timedelta
import random

def seed_database():
    conn = sqlite3.connect('agrismart.db')
    cursor = conn.cursor()
    
    # Clear existing data (optional)
    tables = ['farming_tips', 'government_schemes', 'forum_posts', 'products']
    for table in tables:
        cursor.execute(f'DELETE FROM {table}')
    
    # Seed farming tips
    farming_tips = [
        {
            'title': 'Organic Fertilizer Benefits',
            'category': 'Soil Management',
            'content': 'Organic fertilizers improve soil structure, increase water retention, and provide slow-release nutrients. Use compost, vermicompost, or green manure for best results.',
            'tags': 'organic,fertilizer,soil',
            'language': 'en'
        },
        {
            'title': 'जैविक खाद के लाभ',
            'category': 'मृदा प्रबंधन',
            'content': 'जैविक उर्वरक मिट्टी की संरचना में सुधार करते हैं, पानी की अवधारण बढ़ाते हैं और धीमी गति से पोषक तत्व प्रदान करते हैं। सर्वोत्तम परिणामों के लिए कम्पोस्ट, वर्मीकम्पोस्ट या हरी खाद का उपयोग करें।',
            'tags': 'जैविक,उर्वरक,मृदा',
            'language': 'hi'
        },
        {
            'title': 'Pest Control Using Neem',
            'category': 'Pest Management',
            'content': 'Neem-based pesticides are effective against 200+ pest species. Mix neem oil with water (1:20 ratio) and spray on crops every 7-10 days for prevention.',
            'tags': 'pest,neem,organic',
            'language': 'en'
        },
        {
            'title': 'Drip Irrigation Setup',
            'category': 'Irrigation',
            'content': 'Drip irrigation saves 40-60% water compared to flood irrigation. Install drippers 30cm apart for vegetables and 60cm for fruit crops. Check filters weekly.',
            'tags': 'irrigation,water,drip',
            'language': 'en'
        },
        {
            'title': 'Crop Rotation Benefits',
            'category': 'Farming Practices',
            'content': 'Rotate crops to prevent soil depletion and break pest cycles. Follow legumes with cereals, then vegetables. This maintains soil fertility naturally.',
            'tags': 'rotation,soil,fertility',
            'language': 'en'
        },
        {
            'title': 'Monsoon Farming Tips',
            'category': 'Seasonal Guides',
            'content': 'During monsoon, ensure proper drainage, avoid waterlogging, and plant rice, maize, or soybeans. Apply organic mulch to prevent soil erosion.',
            'tags': 'monsoon,seasonal,drainage',
            'language': 'en'
        },
        {
            'title': 'रबी फसल की तैयारी',
            'category': 'मौसमी गाइड',
            'content': 'रबी के मौसम के लिए गेहूं, चना, सरसों लगाएं। अक्टूबर-नवंबर में बुवाई करें। मिट्टी की नमी बनाए रखें और जैविक खाद का उपयोग करें।',
            'tags': 'रबी,गेहूं,मौसम',
            'language': 'hi'
        },
        {
            'title': 'Soil Testing Guide',
            'category': 'Soil Management',
            'content': 'Test soil every 2-3 years for pH, NPK, and micronutrients. Ideal pH for most crops: 6.0-7.5. Contact local agriculture office for testing kits.',
            'tags': 'soil,testing,pH',
            'language': 'en'
        }
    ]
    
    for tip in farming_tips:
        cursor.execute('''
            INSERT INTO farming_tips (title, category, content, tags, language, views, likes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (tip['title'], tip['category'], tip['content'], tip['tags'], tip['language'], 
              random.randint(10, 500), random.randint(5, 100)))
    
    # Seed government schemes
    schemes = [
        {
            'name': 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
            'category': 'Subsidy',
            'description': 'Direct income support of ₹6000 per year to all farmer families in three equal installments.',
            'eligibility': 'All landholding farmer families. Institutional landholders, constitutional post holders, and income taxpayers excluded.',
            'benefits': '₹2000 every 4 months, directly transferred to bank accounts',
            'application_process': 'Apply online at pmkisan.gov.in or through Common Service Centers. Required: Aadhaar, bank account, land records.',
            'contact_info': 'Helpline: 155261 / 011-24300606, Email: pmkisan-ict@gov.in',
            'state': 'All'
        },
        {
            'name': 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
            'category': 'Insurance',
            'description': 'Comprehensive crop insurance covering yield losses due to natural calamities, pests, and diseases.',
            'eligibility': 'All farmers growing notified crops in notified areas',
            'benefits': 'Premium: 2% for Kharif, 1.5% for Rabi, 5% for horticulture. Government subsidizes rest.',
            'application_process': 'Apply through banks, insurance companies, or Common Service Centers within crop cut-off dates.',
            'contact_info': 'Helpline: 011-23382012, Website: pmfby.gov.in',
            'state': 'All'
        },
        {
            'name': 'Kisan Credit Card (KCC)',
            'category': 'Loan',
            'description': 'Credit facility for farmers to meet agricultural expenses at subsidized interest rates.',
            'eligibility': 'Farmers owning land, tenant farmers, oral lessees, and sharecroppers',
            'benefits': 'Up to ₹3 lakh at 7% interest (4% with prompt repayment). Flexible credit limit.',
            'application_process': 'Apply at any bank branch with land documents, Aadhaar, and identity proof.',
            'contact_info': 'Contact local bank branches or agriculture department',
            'state': 'All'
        },
        {
            'name': 'Soil Health Card Scheme',
            'category': 'Training',
            'description': 'Free soil testing and health cards to promote balanced fertilizer use.',
            'eligibility': 'All farmers',
            'benefits': 'Free soil testing, customized fertilizer recommendations, improved yields',
            'application_process': 'Contact local agriculture office or Krishi Vigyan Kendra for soil sample collection.',
            'contact_info': 'Visit: soilhealth.dac.gov.in',
            'state': 'All'
        },
        {
            'name': 'National Agriculture Market (e-NAM)',
            'category': 'Subsidy',
            'description': 'Online trading platform for agricultural commodities with unified market access.',
            'eligibility': 'All farmers and traders',
            'benefits': 'Better price discovery, transparent auctions, online payment, reduced intermediaries',
            'application_process': 'Register at enam.gov.in with Aadhaar and bank details',
            'contact_info': 'Helpline: 1800-270-0224, Website: enam.gov.in',
            'state': 'All'
        },
        {
            'name': 'Paramparagat Krishi Vikas Yojana (PKVY)',
            'category': 'Subsidy',
            'description': 'Support for organic farming through cluster-based approach.',
            'eligibility': 'Farmers willing to adopt organic farming practices',
            'benefits': '₹50,000 per hectare over 3 years for organic inputs, certification, and marketing',
            'application_process': 'Form farmer groups (minimum 50 farmers), apply through state agriculture department',
            'contact_info': 'Contact state organic farming departments',
            'state': 'All'
        }
    ]
    
    for scheme in schemes:
        cursor.execute('''
            INSERT INTO government_schemes (name, category, description, eligibility, benefits, 
            application_process, contact_info, state, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
        ''', (scheme['name'], scheme['category'], scheme['description'], scheme['eligibility'],
              scheme['benefits'], scheme['application_process'], scheme['contact_info'], scheme['state']))
    
    # Seed products
    products = [
        {'name': 'Organic Wheat', 'category': 'Grains', 'price': 35, 'unit': 'kg', 'is_organic': 1},
        {'name': 'Basmati Rice', 'category': 'Grains', 'price': 80, 'unit': 'kg', 'is_organic': 0},
        {'name': 'Fresh Tomatoes', 'category': 'Vegetables', 'price': 30, 'unit': 'kg', 'is_organic': 1},
        {'name': 'Onions', 'category': 'Vegetables', 'price': 25, 'unit': 'kg', 'is_organic': 0},
        {'name': 'Green Chillies', 'category': 'Vegetables', 'price': 40, 'unit': 'kg', 'is_organic': 1},
        {'name': 'Potatoes', 'category': 'Vegetables', 'price': 20, 'unit': 'kg', 'is_organic': 0},
        {'name': 'Organic Milk', 'category': 'Dairy', 'price': 60, 'unit': 'liter', 'is_organic': 1},
        {'name': 'Fresh Eggs', 'category': 'Poultry', 'price': 6, 'unit': 'piece', 'is_organic': 0},
        {'name': 'Alphonso Mangoes', 'category': 'Fruits', 'price': 120, 'unit': 'kg', 'is_organic': 1},
        {'name': 'Fresh Spinach', 'category': 'Vegetables', 'price': 25, 'unit': 'kg', 'is_organic': 1},
        {'name': 'Vermicompost', 'category': 'Fertilizers', 'price': 8, 'unit': 'kg', 'is_organic': 1},
        {'name': 'Neem Oil Pesticide', 'category': 'Pesticides', 'price': 150, 'unit': 'liter', 'is_organic': 1},
    ]
    
    for product in products:
        cursor.execute('''
            INSERT INTO products (seller_id, name, category, description, price, unit, quantity, 
            is_organic, rating, reviews_count, status)
            VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
        ''', (product['name'], product['category'], 
              f"High quality {product['name'].lower()} directly from farm", 
              product['price'], product['unit'], random.randint(100, 1000),
              product['is_organic'], round(random.uniform(4.0, 5.0), 1), random.randint(5, 50)))
    
    # Seed forum posts
    forum_posts = [
        {
            'title': 'Best time to plant wheat?',
            'content': 'I am in Punjab region. When should I start planting wheat this season? What are the ideal soil conditions?',
            'category': 'Crops',
            'tags': 'wheat,planting,season'
        },
        {
            'title': 'Dealing with aphid infestation',
            'content': 'My cotton crop has aphid problem. Looking for organic solutions. Has anyone tried neem spray?',
            'category': 'Pest Control',
            'tags': 'pest,aphid,organic'
        },
        {
            'title': 'Drip irrigation vs sprinkler',
            'content': 'Planning to upgrade irrigation system. Which is better for vegetables - drip or sprinkler? Cost comparison?',
            'category': 'Irrigation',
            'tags': 'irrigation,drip,sprinkler'
        },
        {
            'title': 'Government subsidy for solar pump',
            'content': 'Anyone got subsidy for installing solar water pump? What is the process and which scheme to apply?',
            'category': 'Government Schemes',
            'tags': 'subsidy,solar,pump'
        }
    ]
    
    for post in forum_posts:
        cursor.execute('''
            INSERT INTO forum_posts (user_id, title, content, category, tags, views, likes)
            VALUES (1, ?, ?, ?, ?, ?, ?)
        ''', (post['title'], post['content'], post['category'], post['tags'],
              random.randint(20, 200), random.randint(5, 50)))
    
    conn.commit()
    conn.close()
    print("✅ Database seeded successfully!")

if __name__ == '__main__':
    seed_database()