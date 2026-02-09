#!/usr/bin/env python3
"""
Complete MongoDB Setup Script for BIPS Exam System
Includes all 100 CNA exam questions from CAT_1.docx
"""

from pymongo import MongoClient
from datetime import datetime
import hashlib
import os
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

# MongoDB Configuration - Read from environment variable
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb+srv://admin:cheruiyot8711@cluster0.omcajya.mongodb.net/bips_exam_system?retryWrites=true&w=majority&appName=Cluster0')
DATABASE_NAME = "bips_exam_system"

print(f"🔌 Connecting to MongoDB Atlas...")
print(f"📊 Database: {DATABASE_NAME}")

# All 100 CNA Exam Questions - Complete Set
questions_data = [
    # Questions 1-10: Infection Prevention and Control
    ("What is the primary goal of decontamination?", 
     ["To destroy all microbial life, including spores", "To make an item safe to handle by removing contaminants", 
      "To inhibit microorganisms on living tissue", "To reduce the number of germs with soap and water"], 1, "Infection Prevention and Control"),
    
    ("Which process destroys ALL microbial life, including highly resistant bacterial endospores?",
     ["Cleaning", "Disinfection", "Sterilization", "Antisepsis"], 2, "Infection Prevention and Control"),
    
    ("Disinfection is effective against all EXCEPT:",
     ["Viruses", "Bacteria", "Bacterial spores", "Fungi"], 2, "Infection Prevention and Control"),
    
    ("Applying Dettol to skin before an injection is an example of:",
     ["Sterilization", "Disinfection", "Antisepsis", "Decontamination"], 2, "Infection Prevention and Control"),
    
    ("Why is cleaning often required before sterilization or disinfection?",
     ["It destroys bacterial spores.", "It removes organic material and reduces microbial load.", 
      "It inactivates all pathogens.", "It is the fastest method."], 1, "Infection Prevention and Control"),
    
    ("According to WHO, what is a basic human right related to IPC?",
     ["Access to the newest antibiotics", "Healthcare designed to minimize risks of avoidable infections",
      "Unlimited access to personal protective equipment", "Treatment only by doctors"], 1, "Infection Prevention and Control"),
    
    ("Breaking the \"Chain of Infection\" at the \"Portal of Exit\" can be achieved by:",
     ["Rapid identification of organisms", "Hand hygiene and appropriate PPE use",
      "Aseptic non-touch technique", "Treating underlying diseases"], 1, "Infection Prevention and Control"),
    
    ("What is a major consequence of Healthcare-Associated Infections (HCAIs)?",
     ["Decreased hospital costs", "Reduced patient morbidity", 
      "Increased length of hospital stay", "Shorter nurse shifts"], 2, "Infection Prevention and Control"),
    
    ("Standard Precautions apply:",
     ["Only to patients with diagnosed infections", "Only when handling blood",
      "To all patients at all times", "Only in the operating room"], 2, "Infection Prevention and Control"),
    
    ("According to standard precautions, when must hand hygiene be performed?",
     ["Only after direct patient contact", "Only before a sterile procedure",
      "After touching patient surroundings, even if not touching the patient", 
      "Only when hands are visibly soiled"], 2, "Infection Prevention and Control"),
    
    # Questions 11-20: PPE, Aseptic Technique, and Wound Care
    ("Which PPE is worn to protect against splashes of blood to the face?",
     ["Gloves only", "Gown and gloves", "Face mask and eye protection", "Shoe covers"], 2, "PPE and Safety"),
    
    ("The goal of aseptic technique is to:",
     ["Reduce the number of germs whenever possible.", "Eliminate germs entirely.",
      "Clean the environment weekly.", "Use antiseptics on all surfaces."], 0, "Aseptic Technique"),
    
    ("Which procedure typically requires an aseptic technique?",
     ["Taking blood pressure", "Inserting a urinary catheter", 
      "Making a patient's bed", "Assisting with walking"], 1, "Aseptic Technique"),
    
    ("During an aseptic procedure, what is a key environmental control?",
     ["Allowing family members to observe", "Keeping doors open for ventilation",
      "Having only necessary personnel present", "Using a fan to circulate air"], 2, "Aseptic Technique"),
    
    ("What does black tissue in a wound typically indicate?",
     ["Healthy granulation", "Infection and pus", "Necrosis or eschar", "Epithelialization"], 2, "Wound Care"),
    
    ("A red, painful wound edge with pus drainage is a sign of:",
     ["Normal healing", "Infection", "Maturation phase", "Hemostasis"], 1, "Wound Care"),
    
    ("What is the correct order for cleaning a wound?",
     ["From the dirtiest to the cleanest area", "In a circular motion from the center out",
      "From the cleanest to the dirtiest area", "Using the same swab for the entire wound"], 1, "Wound Care"),
    
    ("Which solution is commonly used for cleaning necrotic or infected open wounds?",
     ["Sterile water only", "Povidone-iodine (diluted)", 
      "Strong undiluted bleach", "Rubbing alcohol"], 1, "Wound Care"),
    
    ("What type of wound closure has the lowest risk of infection?",
     ["Contaminated wounds", "Dirty wounds", "Clean-contaminated wounds", "Clean wounds"], 3, "Wound Care"),
    
    ("Tertiary Intention closure is also known as:",
     ["Primary closure", "Secondary closure", "Delayed Primary Intention", "Immediate closure"], 2, "Wound Care"),
    
    # Questions 21-30: Ethics, Professional Standards, and Patient Rights
    ("What is the correct color-coding system for segregating infectious non-sharp waste?",
     ["Black bag", "Red bag", "Yellow bag", "Blue bag"], 1, "Waste Management"),
    
    ("The ethical principle of \"Autonomy\" refers to:",
     ["Acting in the patient's best interest", "Respecting the patient's right to make decisions",
      "Doing no harm", "Treating everyone equally"], 1, "Ethics"),
    
    ("\"Non-maleficence\" means:",
     ["Be honest", "Do no harm", "Promote well-being", "Be fair"], 1, "Ethics"),
    
    ("Which of the following is part of professional grooming?",
     ["Wearing long, dangling jewelry", "Keeping nails long and polished",
      "Wearing a clean, pressed uniform", "Using strong perfume"], 2, "Professional Standards"),
    
    ("A nurse's fundamental responsibility does NOT include:",
     ["Preventing illness", "Promoting health", 
      "Prescribing medication independently", "Alleviating suffering"], 2, "Professional Standards"),
    
    ("A patient's right to \"Informed Consent\" means:",
     ["They must accept all treatments offered.", 
      "They must be given accurate information before deciding.",
      "Only the doctor needs to understand the procedure.", 
      "Consent is implied upon admission."], 1, "Patient Rights"),
    
    ("A key responsibility of a patient is:",
     ["To diagnose their own condition", "To prescribe their own medication",
      "To adopt a healthy lifestyle", "To manage the hospital budget"], 2, "Patient Rights"),
    
    ("Vital signs do NOT traditionally include:",
     ["Blood pressure", "Pulse", "Pain", "Respiratory rate"], 2, "Vital Signs"),
    
    ("Tachycardia in an adult is defined as a heart rate above:",
     ["50 BPM", "60 BPM", "100 BPM", "120 BPM"], 2, "Vital Signs"),
    
    ("What is the term for an irregular pulse rhythm?",
     ["Tachycardia", "Bradycardia", "Dysrhythmia", "Normocardia"], 2, "Vital Signs"),
    
    # Questions 31-40: Vital Signs and Blood Pressure
    ("The systolic blood pressure reading represents:",
     ["Pressure when ventricles are at rest", "The difference between systolic and diastolic pressure",
      "The highest pressure during ventricular contraction", "The average arterial pressure"], 2, "Vital Signs"),
    
    ("A normal pulse pressure is approximately:",
     ["10 mmHg", "40 mmHg", "80 mmHg", "120 mmHg"], 1, "Vital Signs"),
    
    ("Which factor decreases blood pressure?",
     ["Increased blood volume", "Increased vasoconstriction",
      "Decreased peripheral resistance", "Increased blood viscosity"], 2, "Vital Signs"),
    
    ("Orthostatic Hypotension is:",
     ["A consistently high blood pressure", "A drop in blood pressure upon sitting or standing",
      "Caused by excessive exercise", "Treated with high-sodium diet only"], 1, "Vital Signs"),
    
    ("The balance between heat produced and heat lost by the body is:",
     ["Pulse", "Respiration", "Blood Pressure", "Temperature"], 3, "Vital Signs"),
    
    # Questions 36-45: Anatomy and Body Systems
    ("Which anatomical term describes a structure closer to the midline of the body?",
     ["Lateral", "Medial", "Distal", "Superior"], 1, "Anatomy"),
    
    ("What is the smallest independent unit of life?",
     ["Organ", "Tissue", "Cell", "Molecule"], 2, "Anatomy"),
    
    ("Which organelle is known as the \"powerhouse of the cell\"?",
     ["Nucleus", "Ribosome", "Mitochondria", "Golgi Complex"], 2, "Anatomy"),
    
    ("The outermost layer of the skin is the:",
     ["Dermis", "Hypodermis", "Stratum Basale", "Epidermis"], 3, "Integumentary System"),
    
    ("The primary function of the skeletal system is:",
     ["Hormone production", "Support and protection", "Digestion", "Neural transmission"], 1, "Skeletal System"),
    
    ("Which system is primarily responsible for gaseous exchange?",
     ["Circulatory", "Digestive", "Respiratory", "Urinary"], 2, "Respiratory System"),
    
    ("The primary function of the urinary system is:",
     ["Reproduction", "Hormone production for digestion",
      "Excretion of wastes and fluid balance", "Blood cell formation"], 2, "Urinary System"),
    
    ("A CNA primarily works under the supervision of:",
     ["A Medical Doctor", "A Physical Therapist",
      "A Registered Nurse or Licensed Practical Nurse", "The Hospital Administrator"], 2, "CNA Roles"),
    
    ("Which of the following is a primary role of a CNA?",
     ["Diagnosing illness", "Prescribing medication",
      "Assisting with Activities of Daily Living (ADLs)", "Performing surgery"], 2, "CNA Roles"),
    
    ("In home-based care, a primary goal is to promote patient:",
     ["Dependence for safety", "Comfort and independence",
      "Hospitalization", "Use of emergency services"], 1, "Home Care"),
    
    # Questions 46-55: CNA Responsibilities and Communication
    ("The correct reporting channel for a CNA is typically to:",
     ["The patient's family first", "The nurse in charge",
      "The hospital CEO", "Another CNA"], 1, "CNA Roles"),
    
    ("Which principle ensures a CNA protects patient information?",
     ["Justice", "Confidentiality", "Beneficence", "Autonomy"], 1, "Ethics"),
    
    ("For safety, a CNA should wear:",
     ["Open-toed sandals", "High-heeled shoes",
      "Closed, non-slip shoes", "Leather boots"], 2, "Safety"),
    
    ("The term \"proximal\" refers to a point that is:",
     ["Further from the trunk", "Closer to the trunk",
      "On the front side", "On the back side"], 1, "Anatomy"),
    
    ("Flexion is a movement that:",
     ["Increases the angle between bones", "Decreases the angle between bones (bending)",
      "Moves a limb away from the body", "Moves a limb toward the body"], 1, "Movement"),
    
    ("The system that includes the skin, hair, and nails is the:",
     ["Nervous system", "Integumentary system",
      "Endocrine system", "Lymphatic system"], 1, "Integumentary System"),
    
    ("\"BD\" in medical terminology means:",
     ["Once daily", "Twice daily", "Three times daily", "As needed"], 1, "Medical Terminology"),
    
    ("\"NPO\" means:",
     ["New patient order", "Nothing by mouth",
      "Nasal prong oxygen", "Non-professional order"], 1, "Medical Terminology"),
    
    ("The most critical rule for a CNA is:",
     ["Speed of task completion", "Patient safety first",
      "Following doctor's orders without question", "Documenting at the end of the shift"], 1, "Safety"),
    
    ("Which of the following is a barrier to effective communication?",
     ["Using simple language", "Making eye contact",
      "Using medical jargon with a patient", "Active listening"], 2, "Communication"),
    
    # Questions 56-65: Wound Healing and Patient Care
    ("What is the first phase of wound healing?",
     ["Inflammatory Phase", "Proliferative Phase",
      "Maturation Phase", "Hemostasis Phase"], 3, "Wound Care"),
    
    ("During which phase of wound healing does granulation tissue form?",
     ["Hemostasis", "Inflammatory", "Proliferative", "Maturation"], 2, "Wound Care"),
    
    ("A wound classified as \"Dirty\" would most likely be closed by:",
     ["Primary Intention", "Secondary Intention",
      "Tertiary Intention", "Immediate suture"], 1, "Wound Care"),
    
    ("After removing a soiled dressing, the soiled compresses should be:",
     ["Placed on the bedside table", "Discarded in a waste container immediately",
      "Reused if they look clean", "Washed for reuse"], 1, "Wound Care"),
    
    ("What should you do if a dressing sticks to a wound?",
     ["Pull it off quickly.", "Moisten it with sterile saline/water to loosen it.",
      "Leave it on.", "Cut around it."], 1, "Wound Care"),
    
    ("Which of the following is a sign of wound infection?",
     ["Pink edges", "Absence of pain",
      "Greenish discharge or foul odor", "Dry, clean scab"], 2, "Wound Care"),
    
    ("Sodium hypochloride (bleach) is commonly used for:",
     ["Antisepsis on skin", "Sterilization of surgical instruments",
      "Disinfection of environmental surfaces", "Drinking water purification in a hospital"], 2, "Disinfection"),
    
    ("Which of the following best describes \"Beneficence\"?",
     ["Telling the truth", "Avoiding harm",
      "Acting to promote the patient's well-being", "Respecting privacy"], 2, "Ethics"),
    
    ("If a patient refuses a bed bath, the CNA should:",
     ["Insist that it is necessary.", "Respect the refusal and document it.",
      "Perform it anyway while the patient sleeps.", "Tell the patient they are being difficult."], 1, "Patient Rights"),
    
    ("A normal adult oral temperature range is approximately:",
     ["34.0 - 35.0 °C", "35.5 - 37.3 °C",
      "38.0 - 39.0 °C", "40.0 - 41.0 °C"], 1, "Vital Signs"),
    
    # Questions 66-75: Advanced Clinical Knowledge
    ("When assessing for orthostatic hypotension, a significant finding is a drop in systolic BP of:",
     ["5 mmHg", "10 mmHg", "20 mmHg", "30 mmHg"], 2, "Vital Signs"),
    
    ("Which part of the heart pumps blood to the lungs?",
     ["Left atrium", "Right ventricle", "Left ventricle", "Right atrium"], 1, "Cardiovascular System"),
    
    ("The site where gases are exchanged in the lungs is the:",
     ["Bronchus", "Trachea", "Alveoli", "Pharynx"], 2, "Respiratory System"),
    
    ("The primary organ of the urinary system is the:",
     ["Ureter", "Bladder", "Kidney", "Urethra"], 2, "Urinary System"),
    
    ("The dermis layer of the skin contains:",
     ["Dead keratinized cells", "Sweat glands and hair follicles",
      "Adipose (fat) tissue", "Stratum corneum"], 1, "Integumentary System"),
    
    ("What does the abbreviation \"PRN\" stand for?",
     ["Every morning", "After meals", "As needed", "At bedtime"], 2, "Medical Terminology"),
    
    ("Which body system is responsible for producing movement?",
     ["Nervous", "Muscular", "Skeletal", "Both B and C"], 3, "Muscular/Skeletal System"),
    
    ("When using a thermometer, it is important to:",
     ["Use the same one for all patients without cleaning.", "Disinfect it before use on a patient.",
      "Shake it down only after use.", "Store it in a pocket."], 1, "Infection Control"),
    
    ("The \"Chain of Infection\" link broken by proper hand hygiene is primarily the:",
     ["Infectious Agent", "Portal of Exit",
      "Mode of Transmission", "Susceptible Host"], 2, "Infection Prevention"),
    
    ("Which waste item should be placed in a sharps container?",
     ["Used gauze", "Used bed sheets",
      "Used syringe needle", "Empty medication box"], 2, "Waste Management"),
    
    # Questions 76-85: Respiratory Hygiene, PPE, and Patient Safety
    ("A patient is coughing violently. To practice respiratory hygiene, you should instruct them to:",
     ["Cough into their bare hands.", "Cough into the air.",
      "Cover their mouth/nose with a tissue or elbow.", "Hold their cough if possible."], 2, "Infection Control"),
    
    ("What is the main purpose of a sterile drape during a procedure?",
     ["To keep the patient warm", "To absorb blood",
      "To create a sterile barrier field", "For decorative purposes"], 2, "Aseptic Technique"),
    
    ("How should a CNA's hair be maintained?",
     ["Long and loose", "Neat and secured away from the face",
      "In any style, as it doesn't matter", "Covered only in the operating room"], 1, "Professional Standards"),
    
    ("The term \"diagnosis\" refers to:",
     ["The expected outcome of a disease", "The identification of a disease or condition",
      "The plan for treatment", "The patient's symptoms"], 1, "Medical Terminology"),
    
    ("Which action demonstrates the ethical principle of \"Justice\"?",
     ["Spending more time with a friendly patient.", "Providing the same quality of care to all patients.",
      "Sharing a patient's gossip with another CNA.", "Letting a family member make all decisions."], 1, "Ethics"),
    
    ("Hypertrophic granulation tissue in a wound appears:",
     ["Black and dry", "Yellow and sloughy",
      "Red, raised, and may bleed easily", "Pink and flat"], 2, "Wound Care"),
    
    ("The maturation phase of wound healing can last:",
     ["A few hours", "3-7 days", "Up to 21 days or more", "Exactly one week"], 2, "Wound Care"),
    
    ("When transporting a patient in a wheelchair, the CNA should always:",
     ["Lock the brakes before transferring the patient.", "Push the wheelchair as fast as possible.",
      "Leave the patient unattended to get the elevator.", "Let the patient stand and pivot without assistance."], 0, "Patient Safety"),
    
    ("A patient with dementia is agitated. The best initial approach is to:",
     ["Raise your voice to get their attention.", "Use a calm tone and simple instructions.",
      "Restrain the patient for safety.", "Ignore the behavior until they calm down."], 1, "Patient Care"),
    
    ("Which vital sign is considered the \"fifth vital sign\"?",
     ["Oxygen saturation", "Pain", "Weight", "Height"], 1, "Vital Signs"),
    
    # Questions 86-95: Body Systems and Clinical Practice
    ("The two main divisions of the nervous system are:",
     ["Central and Peripheral", "Sympathetic and Parasympathetic",
      "Brain and Spinal Cord", "Sensory and Motor"], 0, "Nervous System"),
    
    ("The primary function of the large intestine is:",
     ["Digestion of proteins", "Absorption of water and formation of feces",
      "Absorption of nutrients", "Secretion of digestive enzymes"], 1, "Digestive System"),
    
    ("In anatomical position, the palms are facing:",
     ["Backwards", "Forwards", "Towards the thighs", "Upwards"], 1, "Anatomy"),
    
    ("What is the correct sequence for putting on PPE?",
     ["Gown, Mask, Gloves", "Gloves, Mask, Gown",
      "Mask, Gown, Gloves", "Gown, Gloves, Mask"], 0, "PPE"),
    
    ("What is the correct sequence for removing PPE?",
     ["Gloves, Gown, Mask", "Mask, Gown, Gloves",
      "Gown, Mask, Gloves", "Gloves, Mask, Gown"], 0, "PPE"),
    
    ("A patient's radial pulse is difficult to palpate. What should the CNA do next?",
     ["Document \"pulse absent\" and move on.", "Use a stethoscope to check the apical pulse.",
      "Use a blood pressure cuff to find it.", "Ask the patient to exercise first."], 1, "Vital Signs"),
    
    ("Which of the following is a responsibility of a caregiver/CNA?",
     ["Prescribing medication", "Making a medical diagnosis",
      "Administering prescribed oral medications (if allowed by policy)", "Ordering lab tests"], 2, "CNA Roles"),
    
    ("Which of the following is a RIGHT of a patient?",
     ["To demand specific unproven treatments.", "To confidentiality of their health information.",
      "To receive care without paying.", "To disrespect healthcare staff."], 1, "Patient Rights"),
    
    ("Which of the following is a responsibility of a CNA regarding patient care?",
     ["To work outside their scope of practice if asked.", "To observe and report changes in patient condition.",
      "To diagnose changes in condition.", "To adjust medication doses."], 1, "CNA Roles"),
    
    ("A patient complains of chest pain. Your first action should be to:",
     ["Tell them it's probably indigestion.", "Document it in the notes for the nurse to see later.",
      "Stay with the patient and call for the nurse immediately.", "Get them a glass of water."], 2, "Emergency Response"),
    
    # Questions 96-100: Documentation and Final Concepts
    ("When documenting care, the CNA should:",
     ["Record it at the end of the shift from memory.", "Use pencil in case of errors.",
      "Record facts accurately and promptly.", "Only document positive observations."], 2, "Documentation"),
    
    ("Which action best prevents the spread of infection?",
     ["Wearing the same gloves for multiple patients.", "Proper hand hygiene.",
      "Using a gown instead of washing hands.", "Keeping windows closed."], 1, "Infection Control"),
    
    ("The \"QID\" abbreviation means:",
     ["Four times a day", "Every hour",
      "Every other day", "After meals"], 0, "Medical Terminology"),
    
    ("The primary transport system of the body is the:",
     ["Lymphatic system", "Cardiovascular system",
      "Respiratory system", "Nervous system"], 1, "Cardiovascular System"),
    
    ("The most important reason for accurate vital sign measurement is:",
     ["To keep the doctor happy.", "To have data to chart.",
      "To identify changes in a patient's baseline condition.", "It is a required routine task."], 2, "Vital Signs"),
]

# Convert questions to database format
EXAM_QUESTIONS = []
for i, (q_text, opts, ans, category) in enumerate(questions_data, start=1):
    EXAM_QUESTIONS.append({
        "question_number": i,
        "question_text": q_text,
        "options": opts,
        "correct_answer": ans,
        "marks": 1,
        "category": category,
        "section": "A"
    })


def setup_database():
    """Initialize MongoDB database with collections and indexes"""
    
    print("=" * 60)
    print("BIPS Exam System - MongoDB Database Setup")
    print("=" * 60)
    print()
    
    print(f"Connecting to MongoDB Atlas...")
    try:
        client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=10000)
        # Test connection
        client.admin.command('ping')
        print("✅ Successfully connected to MongoDB Atlas")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("\nPlease check:")
        print("  1. Your MongoDB Atlas connection string in .env.local is correct")
        print("  2. Your IP address is whitelisted in Atlas Network Access")
        print("  3. Your database user credentials are correct")
        print("  4. You have internet connectivity")
        return
    
    db = client[DATABASE_NAME]
    
    print(f"\nSetting up database: {DATABASE_NAME}")
    
    # Drop existing collections for fresh setup
    print("\nDropping existing collections...")
    collections = ['questions', 'submissions', 'students', 'admins']
    for coll in collections:
        db[coll].drop()
        print(f"  ✓ Dropped {coll}")
    
    # Create collections with indexes
    print("\nCreating collections and indexes...")
    
    # 1. Questions Collection
    questions_collection = db.questions
    questions_collection.create_index("question_number", unique=True)
    print("  ✓ Created questions collection")
    
    # 2. Submissions Collection
    submissions_collection = db.submissions
    submissions_collection.create_index("admission_number")
    submissions_collection.create_index("submitted_at")
    print("  ✓ Created submissions collection")
    
    # 3. Students Collection
    students_collection = db.students
    students_collection.create_index("admission_number", unique=True)
    print("  ✓ Created students collection")
    
    # 4. Admins Collection
    admins_collection = db.admins
    admins_collection.create_index("username", unique=True)
    print("  ✓ Created admins collection")
    
    # Insert exam questions
    print(f"\nInserting {len(EXAM_QUESTIONS)} exam questions...")
    if EXAM_QUESTIONS:
        result = questions_collection.insert_many(EXAM_QUESTIONS)
        print(f"  ✓ Inserted {len(result.inserted_ids)} questions")
    
    # Insert default admin user
    print("\nCreating default admin user...")
    admin_password = "BIPS2025Secure!"
    hashed_password = hashlib.sha256(admin_password.encode()).hexdigest()
    
    try:
        admins_collection.insert_one({
            "username": "admin",
            "password": hashed_password,
            "created_at": datetime.utcnow(),
            "role": "super_admin"
        })
        print("  ✓ Admin user created successfully")
    except Exception as e:
        print(f"  ⚠ Admin user may already exist: {e}")
    
    # Verify setup
    print("\nVerifying database setup...")
    q_count = questions_collection.count_documents({})
    s_count = students_collection.count_documents({})
    a_count = admins_collection.count_documents({})
    
    print(f"  Questions: {q_count}")
    print(f"  Students: {s_count}")
    print(f"  Admins: {a_count}")
    
    print("\n" + "=" * 60)
    print("✅ DATABASE SETUP COMPLETED SUCCESSFULLY!")
    print("=" * 60)
    print(f"\nDatabase Name: {DATABASE_NAME}")
    print(f"Questions loaded: {q_count} (All 100 CNA questions)")
    print(f"\nAdmin Credentials:")
    print(f"  Username: admin")
    print(f"  Password: {admin_password}")
    print("\n⚠️  IMPORTANT: Change the admin password in production!")
    print("=" * 60)
    
    client.close()


if __name__ == "__main__":
    setup_database()