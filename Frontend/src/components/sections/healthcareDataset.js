// healthcareDataset.js

export const symptomData = {
  fever: {
    causes: [
      { name: "Viral Infection", probability: 0.6 },
      { name: "Bacterial Infection", probability: 0.3 },
      { name: "Other Causes", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Paracetamol", url: "https://www.webmd.com/drugs/2/drug-660/paracetamol-oral/details" },
      { name: "Ibuprofen", url: "https://www.webmd.com/drugs/2/drug-7513/ibuprofen-oral/details" },
    ],
    advice: "Rest, stay hydrated, and monitor your temperature. If fever persists over 3 days, consult a doctor.",
  },

  cough: {
    causes: [
      { name: "Common Cold", probability: 0.7 },
      { name: "Allergy", probability: 0.2 },
      { name: "Other Causes", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Cough Syrup", url: "https://www.webmd.com/drugs/2/drug-4457/dextromethorphan-oral/details" },
    ],
    advice: "Drink warm fluids, avoid irritants. If cough lasts more than 2 weeks or worsens, see a healthcare professional.",
  },

  headache: {
    causes: [
      { name: "Tension Headache", probability: 0.5 },
      { name: "Migraine", probability: 0.4 },
      { name: "Other Causes", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Acetaminophen", url: "https://www.webmd.com/drugs/2/drug-660/acetaminophen-oral/details" },
      { name: "Aspirin", url: "https://www.webmd.com/drugs/2/drug-3260/aspirin-oral/details" },
    ],
    advice: "Rest in a quiet, dark room. Use over-the-counter pain relievers as directed. If headache is severe or persistent, see a doctor.",
  },

  fatigue: {
    causes: [
      { name: "Lack of Sleep", probability: 0.5 },
      { name: "Anemia", probability: 0.3 },
      { name: "Thyroid Issues", probability: 0.2 },
    ],
    medicineLinks: [
      { name: "Iron Supplements", url: "https://www.webmd.com/vitamins/ai/ingredientmono-iron" },
    ],
    advice: "Ensure proper rest, eat balanced diet, and consult doctor if fatigue persists.",
  },

  nausea: {
    causes: [
      { name: "Food Poisoning", probability: 0.6 },
      { name: "Motion Sickness", probability: 0.3 },
      { name: "Pregnancy", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Antiemetics", url: "https://www.webmd.com/drugs/2/drug-15612/ondansetron-oral/details" },
    ],
    advice: "Stay hydrated and rest. If nausea is severe or prolonged, seek medical advice.",
  },

  soreThroat: {
    causes: [
      { name: "Viral Infection", probability: 0.7 },
      { name: "Bacterial Infection (Strep throat)", probability: 0.2 },
      { name: "Allergies", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Lozenges", url: "https://www.webmd.com/drugs/2/drug-6225/benzocaine-oral/details" },
      { name: "Ibuprofen", url: "https://www.webmd.com/drugs/2/drug-7513/ibuprofen-oral/details" },
    ],
    advice: "Gargle warm salt water, stay hydrated, and rest your voice. If severe or persistent, see a healthcare professional.",
  },

  diarrhea: {
    causes: [
      { name: "Viral Gastroenteritis", probability: 0.5 },
      { name: "Food Poisoning", probability: 0.3 },
      { name: "Irritable Bowel Syndrome", probability: 0.2 },
    ],
    medicineLinks: [
      { name: "Loperamide", url: "https://www.webmd.com/drugs/2/drug-9480/loperamide-oral/details" },
      { name: "Oral Rehydration Salts", url: "https://www.webmd.com/diet/oral-rehydration-solutions" },
    ],
    advice: "Stay hydrated and eat bland foods. Avoid dairy and fatty foods. See a doctor if diarrhea persists more than 2 days or is severe.",
  },

  shortnessOfBreath: {
    causes: [
      { name: "Asthma", probability: 0.4 },
      { name: "Chronic Obstructive Pulmonary Disease (COPD)", probability: 0.3 },
      { name: "Heart Conditions", probability: 0.2 },
      { name: "Anxiety", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Inhalers", url: "https://www.webmd.com/asthma/guide/asthma-inhalers" },
      { name: "Bronchodilators", url: "https://www.webmd.com/drugs/2/drug-5960/albuterol-inhalation/details" },
    ],
    advice: "Seek immediate medical help if severe. Use prescribed inhalers. Avoid triggers and maintain regular follow-ups with your healthcare provider.",
  },

  chestPain: {
    causes: [
      { name: "Angina", probability: 0.4 },
      { name: "Heart Attack", probability: 0.3 },
      { name: "Gastroesophageal Reflux Disease (GERD)", probability: 0.2 },
      { name: "Muscle Strain", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Nitroglycerin", url: "https://www.webmd.com/drugs/2/drug-11556/nitroglycerin-oral/details" },
    ],
    advice: "If chest pain is severe or accompanied by sweating, nausea, or shortness of breath, call emergency services immediately. Otherwise, consult your doctor.",
  },

  dizziness: {
    causes: [
      { name: "Dehydration", probability: 0.4 },
      { name: "Low Blood Pressure", probability: 0.3 },
      { name: "Inner Ear Problems", probability: 0.2 },
      { name: "Medication Side Effects", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Meclizine", url: "https://www.webmd.com/drugs/2/drug-9703/meclizine-oral/details" },
    ],
    advice: "Sit or lie down immediately when dizzy. Stay hydrated and avoid sudden movements. If dizziness is frequent or severe, see a healthcare provider.",
  },

  jointPain: {
    causes: [
      { name: "Arthritis", probability: 0.5 },
      { name: "Injury", probability: 0.3 },
      { name: "Infection", probability: 0.2 },
    ],
    medicineLinks: [
      { name: "NSAIDs (e.g., Ibuprofen)", url: "https://www.webmd.com/drugs/2/drug-7513/ibuprofen-oral/details" },
      { name: "Topical Analgesics", url: "https://www.webmd.com/pain-management/guide/topical-pain-relievers" },
    ],
    advice: "Rest the affected joint, apply ice or heat as needed. If pain persists or worsens, consult a doctor for proper diagnosis and treatment.",
  },

  backPain: {
    causes: [
      { name: "Muscle Strain", probability: 0.6 },
      { name: "Herniated Disc", probability: 0.2 },
      { name: "Poor Posture", probability: 0.2 },
    ],
    medicineLinks: [
      { name: "Acetaminophen", url: "https://www.webmd.com/drugs/2/drug-660/acetaminophen-oral/details" },
      { name: "NSAIDs", url: "https://www.webmd.com/drugs/2/drug-7513/ibuprofen-oral/details" },
    ],
    advice: "Maintain good posture, do gentle stretching, and use pain relievers as needed. If pain is severe or lasts more than a few weeks, see a healthcare professional.",
  },

  skinProblem: {
    causes: [
      { name: "Allergic Reaction", probability: 0.4 },
      { name: "Eczema", probability: 0.3 },
      { name: "Fungal Infection", probability: 0.2 },
      { name: "Psoriasis", probability: 0.1 },
    ],
    medicineLinks: [
      { name: "Hydrocortisone Cream", url: "https://www.webmd.com/drugs/2/drug-9279/hydrocortisone-topical/details" },
      { name: "Antifungal Cream", url: "https://www.webmd.com/drugs/2/drug-12864/ketoconazole-topical/details" },
      { name: "Moisturizers", url: "https://www.webmd.com/skin-problems-and-treatments/guide/moisturizers" },
    ],
    advice: "Keep the affected area clean and dry. Avoid scratching or harsh soaps. Use prescribed creams as directed. If condition worsens or spreads, consult a dermatologist.",
  },
};
