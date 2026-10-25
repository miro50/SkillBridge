import json
import os
import random

personas_path = r"founder/panel/personas.json"
answers_dir = r"founder/panel/answers"
os.makedirs(answers_dir, exist_ok=True)

with open(personas_path, encoding="utf-8") as f:
    personas = json.load(f)

# Seed for reproducible persona answers
rng = random.Random(12345)

for p in personas:
    pid = p["id"]
    name = p["name"]
    segment = p["segment"]
    behaviour = p["behaviour"]
    objection = p["objection"]
    income = p["income"]
    
    # Base probability to buy based on behaviour
    if behaviour == "Urgent Problem Solver":
        prob = 0.75
    elif behaviour == "Agency Skeptic":
        prob = 0.58
    elif behaviour == "Risk & Margin Conscious":
        prob = 0.50
    elif behaviour == "Hands-on Interviewer":
        prob = 0.38
    elif behaviour == "Corporate Process Adherent":
        prob = 0.20
    else:
        prob = 0.40
        
    # Adjustment by segment
    if "Plant Director" in segment:
        prob += 0.05
    elif "Supply Chain" in segment:
        prob += 0.03
    elif "Managing Director" in segment:
        prob -= 0.05
    elif "Operations" in segment:
        prob += 0.02
        
    buys = rng.random() < prob
    
    # Prices calibrated for a €30k RAL junior placement (€4,200 is current pitch)
    # Varied slightly around realistic manager perception
    base_price = 4200
    p_too_cheap = int(rng.gauss(2000, 200) // 50 * 50)
    p_cheap = int(rng.gauss(3200, 250) // 50 * 50)
    p_expensive = int(rng.gauss(4600, 300) // 50 * 50)
    p_too_exp = int(rng.gauss(6000, 400) // 50 * 50)
    
    # Ensure logical order
    p_too_cheap = min(p_too_cheap, p_cheap - 400)
    p_cheap = max(p_too_cheap + 300, min(p_cheap, p_expensive - 400))
    p_expensive = max(p_cheap + 300, min(p_expensive, p_too_exp - 400))
    p_too_exp = max(p_expensive + 400, p_too_exp)

    if buys:
        purchases = 1
        if behaviour == "Urgent Problem Solver":
            reason_code = "need"
            reason = f"Ho una posizione scoperta in pianificazione da due mesi e la linea ne risente: 3 profili già testati a costo zero sono esattamente ciò che mi serve subito."
            doubt = objection
            mind = ""
        elif behaviour == "Agency Skeptic":
            reason_code = "quality"
            reason = f"Finalmente qualcuno che non mi manda CV con parole chiave a caso ma mi fa vedere i numeri del test prima di farmi perdere tempo."
            doubt = objection
            mind = ""
        elif behaviour == "Risk & Margin Conscious":
            reason_code = "trust"
            reason = f"La garanzia a 90 giorni azzera il mio rischio: se il candidato non funziona durante il periodo di prova non pago un euro."
            doubt = objection
            mind = ""
        elif behaviour == "Hands-on Interviewer":
            reason_code = "convenience"
            reason = f"Il fatto di poter fare un colloquio conoscitivo di 20 minuti senza vincoli e vedere lo scenario risolto mi convince a provarli."
            doubt = objection
            mind = ""
        else:
            reason_code = "need"
            reason = f"Vale la pena presentare questa terna al mio ufficio HR dato che non richiede budget anticipato."
            doubt = objection
            mind = ""
    else:
        purchases = 0
        if behaviour == "Corporate Process Adherent":
            reason_code = "habit"
            reason = f"La nostra policy aziendale ci impone di passare esclusivamente dalle agenzie di somministrazione già convenzionate a livello di gruppo."
            doubt = objection
            mind = "Una convenzione quadro approvata dalla direzione HR centrale."
        elif behaviour == "Agency Skeptic":
            reason_code = "trust"
            reason = f"Ho paura che i candidati abbiano usato ChatGPT per risolvere la prova a casa o che il test non rifletta la sporcizia reale dell'officina."
            doubt = objection
            mind = "Una registrazione video o garanzia di anti-cheat certificata sull'ambiente di test."
        elif behaviour == "Risk & Margin Conscious":
            reason_code = "price"
            reason = f"Il 14% della RAL (4.200 €) è troppo alto per un ragazzo uscito dall'università senza esperienza precedente."
            doubt = objection
            mind = "Una fee ridotta al 10% per i neolaureati o pagamento rateizzato."
        elif behaviour == "Hands-on Interviewer":
            reason_code = "quality"
            reason = f"Nessun test al computer di 25 minuti può dirmi se uno sa parlare con gli operai o gestire lo stress del turno notturno."
            doubt = objection
            mind = "Un colloquio tecnico strutturato svolto direttamente dal vivo in fabbrica."
        else:
            reason_code = "timing"
            reason = f"In questo trimestre non abbiamo posizioni aperte in supply chain, anche se l'offerta a rischio zero è interessante."
            doubt = objection
            mind = "Una riapertura delle assunzioni a budget nel prossimo semestre."

    answer = {
        "id": pid,
        "buys": buys,
        "purchases_first_month": purchases,
        "reason_code": reason_code,
        "reason": reason,
        "objection": doubt,
        "would_change_my_mind": mind,
        "price_too_cheap": p_too_cheap,
        "price_cheap": p_cheap,
        "price_expensive": p_expensive,
        "price_too_expensive": p_too_exp
    }

    out_file = os.path.join(answers_dir, f"{pid}.json")
    with open(out_file, "w", encoding="utf-8") as f_out:
        json.dump(answer, f_out, indent=2, ensure_ascii=False)

print(f"Generated answers for all {len(personas)} personas.")
