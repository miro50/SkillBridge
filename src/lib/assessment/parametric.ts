/**
 * SkillBridge Multi-Scenario Parametric Engine (SPEC-002)
 *
 * Deterministically generates parameters for 20 industrial simulation scenarios
 * across 4 core engineering roles (5 distinct simulations per role):
 *
 * CATEGORIA 1: SUPPLY CHAIN & OPERATIONS SPECIALIST
 * 1. valvola-v104: Rottura O-Ring NBR-70 su Linea 2 Montaggio Valvole
 * 2. pompa-p402: Blocco Doganale Giranti in Bronzo per Pompe Centrifughe
 * 3. riduttore-r120: Incendio Fornitore Cuscinetti a Rulli per Riduttori
 * 4. cilindro-c750: Quarantena Steli Cromati Difettosi per Cilindri Idraulici
 * 5. attuatore-a910: Blocco Valico Stradale Guarnizioni PTFE per Attuatori Subsea
 *
 * CATEGORIA 2: PRODUCTION PLANNER & MRP SPECIALIST
 * 6. packaging-p200: Collo di Bottiglia & Cambio Formato Blisteratrice Pharma
 * 7. pressa-m800: Riprogrammazione MPS Coils Lamiera per Pressa Transfer 800T
 * 8. verniciatura-v310: Saturazione Cabina & Mancanza Polvere Termoindurente RAL
 * 9. imbottigliamento-b500: Slittamento Capsule Alluminio su Linea Alta Velocità
 * 10. estrusione-e620: Esaurimento Granulo Medicale per Estrusore Tubi Cleanroom
 *
 * CATEGORIA 3: BUYER TECNICO & PROCUREMENT SPECIALIST
 * 11. scheda-e501: Crisi Approvvigionamento Microcontrollore Automotive SMT
 * 12. fusione-f350: Fallimento Fonderia Carter Trasmissione in Pressofusione
 * 13. cablaggio-w110: Carenza Rame & Guaine Ignifughe per Cablaggi Ferroviari
 * 14. sensore-s820: Taglio Quota Fornitore Sensori di Pressione Criogenici
 * 15. titanio-t950: Embargo & Rischio Fornitura Barre in Titanio Grado 5 Aerospaziale
 *
 * CATEGORIA 4: JUNIOR PROCESS & LEAN CONTINUOUS IMPROVEMENT ENGINEER
 * 16. process-m300: Bilanciamento Linea & Collo di Bottiglia Motore Brushless M-300
 * 17. smed-k150: Progetto SMED & Rottura Mandrino Corsa su Estrusione Profili
 * 18. kanban-k800: Rottura Loop Kanban & Saturazione AGV Ingranaggi Riduttori
 * 19. qualita-q420: Contenimento Scarti 8D & Deriva Cella Flessibile Bielle
 * 20. takt-t600: Sbilanciamento Takt Time & Collo Bottiglia Saldatura Inverter
 *
 * Uses unsigned 32-bit token hashing (anti-cheat) to guarantee uniqueness per candidate.
 */

export interface PrimarySupplierConfig {
  name: string;
  standardLeadTimeDays: number;
  disruptedLeadTimeDays: number;
  unitCost: number;
}

export interface ExpeditedSupplierConfig {
  name: string;
  leadTimeDays: number;
  unitCost: number;
  batchSize: number;
}

export interface SupplyChainScenarioConfig {
  id: string;
  title: string;
  role: string;
  shortDescription?: string;
  partNumber: string;
  productionLine: string;
  initialStock: number;
  dailyConsumption: number;
  safetyStock: number;
  primarySupplier: PrimarySupplierConfig;
  expeditedSupplier: ExpeditedSupplierConfig;
  downtimeCostPerHour: number;
  shiftHoursPerDay: number;
  // Calculated target values for grading
  expectedStockoutDay: number;
  expectedDowntimeDays: number;
  expectedDowntimeHours: number;
  expectedDowntimeCost: number;
  expectedReorderQty: number;
  expectedExtraCost: number;
}

/**
 * Public client-safe representation of the scenario (expected values stripped).
 */
export type PublicScenarioConfig = Omit<
  SupplyChainScenarioConfig,
  | 'expectedStockoutDay'
  | 'expectedDowntimeDays'
  | 'expectedDowntimeHours'
  | 'expectedDowntimeCost'
  | 'expectedReorderQty'
  | 'expectedExtraCost'
>;

export interface ScenarioCatalogItem {
  id: string;
  title: string;
  role: string;
  category: 'supply_chain' | 'production_planning' | 'procurement' | 'lean_process';
  difficulty: 'Intermedio' | 'Avanzato';
  partNumber: string;
  productionLine: string;
  summary: string;
  primarySupplier: string;
  downtimeCostPerHour: number;
}

export interface ScenarioTemplate {
  id: string;
  title: string;
  role: string;
  category: 'supply_chain' | 'production_planning' | 'procurement' | 'lean_process';
  difficulty: 'Intermedio' | 'Avanzato';
  partNumber: string;
  productionLine: string;
  shortDescription: string;
  summary: string;
  primarySupplierName: string;
  standardLeadTime: number;
  disruptedLeadTime: number;
  standardUnitCost: number;
  expeditedSupplierName: string;
  expeditedLeadTime: number;
  expeditedCosts: number[];
  batchSize: number;
  consumptions: number[];
  stockMultipliers: number[];
  downtimeCostPerHour: number;
  shiftHoursPerDay?: number;
  safetyStock: number;
}

export const SCENARIO_TEMPLATES: Record<string, ScenarioTemplate> = {
  // ==========================================================================
  // CATEGORIA 1: SUPPLY CHAIN & OPERATIONS SPECIALIST (5 Scenari)
  // ==========================================================================
  'valvola-v104': {
    id: 'valvola-v104',
    title: 'Rottura Supply Chain Valvola V-104 su Linea Montaggio 2',
    role: 'Supply Chain & Operations Specialist',
    category: 'supply_chain',
    difficulty: 'Intermedio',
    partNumber: 'V-104-BR',
    productionLine: 'Linea Montaggio 2',
    shortDescription: 'Gestione rottura fornitura O-Ring di tenuta per assemblaggio valvole oleodinamiche.',
    summary:
      'Rottura fornitura O-Ring critici, calcolo ROP con lotto minimo aereo da 200 pezzi e costo fermo linea da 1.200 €/h.',
    primarySupplierName: 'Valvomeccanica S.p.A.',
    standardLeadTime: 5,
    disruptedLeadTime: 14,
    standardUnitCost: 50,
    expeditedSupplierName: 'AirSupply Logistics International',
    expeditedLeadTime: 3,
    expeditedCosts: [80, 85, 90],
    batchSize: 200,
    consumptions: [35, 40, 45],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 1200,
    shiftHoursPerDay: 8,
    safetyStock: 80,
  },

  'pompa-p402': {
    id: 'pompa-p402',
    title: 'Blocco Doganale Giranti in Bronzo per Pompe Centrifughe P-402',
    role: 'Supply Chain & Operations Specialist',
    category: 'supply_chain',
    difficulty: 'Intermedio',
    partNumber: 'GIR-P402',
    productionLine: 'Linea Collaudo & Assemblaggio Pompe 1',
    shortDescription: 'Blocco container al porto di Genova su giranti marine in bronzo e calcolo fornitura rapida da fonderia UE.',
    summary:
      'Blocco container al porto di Genova con ritardo fornitore di 16 giorni. Calcolo stockout, costo fermo linea da 1.400 €/h e fornitura d\'emergenza (lotto 100 pz).',
    primarySupplierName: 'Fonderie San Giorgio S.r.l.',
    standardLeadTime: 7,
    disruptedLeadTime: 16,
    standardUnitCost: 65,
    expeditedSupplierName: 'EuroCast Rapid Foundry EU',
    expeditedLeadTime: 3,
    expeditedCosts: [105, 110, 115],
    batchSize: 100,
    consumptions: [40, 50, 60],
    stockMultipliers: [7, 8, 9],
    downtimeCostPerHour: 1400,
    shiftHoursPerDay: 8,
    safetyStock: 70,
  },

  'riduttore-r120': {
    id: 'riduttore-r120',
    title: 'Incendio Fornitore Cuscinetti per Riduttori Industriali R-120',
    role: 'Supply Chain & Operations Specialist',
    category: 'supply_chain',
    difficulty: 'Avanzato',
    partNumber: 'CUS-R120',
    productionLine: 'Linea Montaggio Riduttori Heavy-Duty',
    shortDescription: 'Incendio presso lo stabilimento fornitore di cuscinetti a rulli e attivazione canale distributore autorizzato.',
    summary:
      'Incendio presso fornitore cuscinetti con ritardo di 20 giorni. Calcolo deficit, mancata produzione da 1.600 €/h e lotto aereo da distributore (lotto 80 pz).',
    primarySupplierName: 'ItalBearing Precision S.p.A.',
    standardLeadTime: 6,
    disruptedLeadTime: 20,
    standardUnitCost: 85,
    expeditedSupplierName: 'AeroBearing Logistics Global',
    expeditedLeadTime: 4,
    expeditedCosts: [140, 150, 160],
    batchSize: 80,
    consumptions: [30, 35, 40],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 1600,
    shiftHoursPerDay: 8,
    safetyStock: 60,
  },

  'cilindro-c750': {
    id: 'cilindro-c750',
    title: 'Quarantena Steli Cromati per Cilindri Idraulici C-750',
    role: 'Supply Chain & Operations Specialist',
    category: 'supply_chain',
    difficulty: 'Intermedio',
    partNumber: 'STL-C750',
    productionLine: 'Reparto Lappatura & Assemblaggio Cilindri',
    shortDescription: 'Scarto del 40% per porosità su steli cromati, blocco collaudo e fornitura espressa da trafileria certificata.',
    summary:
      'Scarti critici al controllo qualità in ingresso con 14 giorni di quarantena lotti. Fermo linea da 1.100 €/h e fornitura espressa (lotto 120 pz).',
    primarySupplierName: 'Acciaierie & Trafilerie Venete S.r.l.',
    standardLeadTime: 5,
    disruptedLeadTime: 14,
    standardUnitCost: 45,
    expeditedSupplierName: 'RapidSteel Germany GmbH',
    expeditedLeadTime: 3,
    expeditedCosts: [75, 80, 85],
    batchSize: 120,
    consumptions: [45, 55, 65],
    stockMultipliers: [7, 8, 9],
    downtimeCostPerHour: 1100,
    shiftHoursPerDay: 8,
    safetyStock: 80,
  },

  'attuatore-a910': {
    id: 'attuatore-a910',
    title: 'Blocco Valico Stradale Guarnizioni PTFE per Attuatori Subsea A-910',
    role: 'Supply Chain & Operations Specialist',
    category: 'supply_chain',
    difficulty: 'Avanzato',
    partNumber: 'TEN-A910',
    productionLine: 'Camera Bianca Assemblaggio Attuatori Oil&Gas',
    shortDescription: 'Chiusura valico alpino per frana su guarnizioni PTFE criogeniche con spedizione aerea urgente da Berna.',
    summary:
      'Chiusura transalpina con ritardo di 15 giorni su componenti Oil&Gas. Fermo camera bianca da 2.200 €/h e spedizione cargo aerea dedicata (lotto 60 pz).',
    primarySupplierName: 'Polimeri Industriali Modena S.r.l.',
    standardLeadTime: 6,
    disruptedLeadTime: 15,
    standardUnitCost: 110,
    expeditedSupplierName: 'SwissPolymer Air Express',
    expeditedLeadTime: 2,
    expeditedCosts: [180, 190, 200],
    batchSize: 60,
    consumptions: [20, 25, 30],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 2200,
    shiftHoursPerDay: 8,
    safetyStock: 40,
  },

  // ==========================================================================
  // CATEGORIA 2: PRODUCTION PLANNER & MRP SPECIALIST (5 Scenari)
  // ==========================================================================
  'packaging-p200': {
    id: 'packaging-p200',
    title: 'Collo di Bottiglia & Cambio Formato su Linea Packaging P-200',
    role: 'Production Planner & MRP Specialist',
    category: 'production_planning',
    difficulty: 'Avanzato',
    partNumber: 'PKG-P200',
    productionLine: 'Reparto Packaging & Blisteratrice 1',
    shortDescription: 'Riprogrammazione MRP astucci termosaldati per evitare penali cliente su linea blisteratrice.',
    summary:
      'Guasto fornitore astucci farmaceutici, ricalcolo fabbisogno MRP, lotto rapido da 250 pezzi e trade-off fermo linea da 1.500 €/h.',
    primarySupplierName: 'Cartotecnica Industriale S.p.A.',
    standardLeadTime: 6,
    disruptedLeadTime: 15,
    standardUnitCost: 40,
    expeditedSupplierName: 'FastPack Express Italia',
    expeditedLeadTime: 3,
    expeditedCosts: [65, 70, 75],
    batchSize: 250,
    consumptions: [50, 60, 70],
    stockMultipliers: [7, 8, 9],
    downtimeCostPerHour: 1500,
    shiftHoursPerDay: 8,
    safetyStock: 100,
  },

  'pressa-m800': {
    id: 'pressa-m800',
    title: 'Riprogrammazione MPS Coils Lamiera per Pressa Transfer M-800',
    role: 'Production Planner & MRP Specialist',
    category: 'production_planning',
    difficulty: 'Avanzato',
    partNumber: 'COIL-M800',
    productionLine: 'Reparto Tranciatura & Presse Pesanti',
    shortDescription: 'Slittamento laminatoio siderurgico e ricalcolo MPS su pressa transfer 800T per scocche elettrodomestici.',
    summary:
      'Ritardo acciaieria di 17 giorni su coils lamiera DC04. Ricalcolo MPS lotti minimi, danno fermo pressa da 1.900 €/h e acquisto pronto magazzino (lotto 300 pz).',
    primarySupplierName: 'Laminati Piani Nord S.p.A.',
    standardLeadTime: 7,
    disruptedLeadTime: 17,
    standardUnitCost: 55,
    expeditedSupplierName: 'Centro Servizi ProntoCoil',
    expeditedLeadTime: 3,
    expeditedCosts: [90, 95, 100],
    batchSize: 300,
    consumptions: [70, 85, 100],
    stockMultipliers: [7, 8, 9],
    downtimeCostPerHour: 1900,
    shiftHoursPerDay: 8,
    safetyStock: 150,
  },

  'verniciatura-v310': {
    id: 'verniciatura-v310',
    title: 'Saturazione Cabina & Mancanza Polvere Termoindurente V-310',
    role: 'Production Planner & MRP Specialist',
    category: 'production_planning',
    difficulty: 'Intermedio',
    partNumber: 'VERN-V310',
    productionLine: 'Impianto Verniciatura Automatizzato 2',
    shortDescription: 'Stockout polvere epossidica speciale RAL 7035 e riprogrammazione sequenza forni di polimerizzazione.',
    summary:
      'Stockout vernice speciale e rischio saturazione linea con ritardo di 13 giorni. Trade-off costo fermo impianto da 1.350 €/h vs fornitura rapida (lotto 200 pz).',
    primarySupplierName: 'ColorTech Vernici Industriali S.r.l.',
    standardLeadTime: 5,
    disruptedLeadTime: 13,
    standardUnitCost: 35,
    expeditedSupplierName: 'FastColors Express Benelux',
    expeditedLeadTime: 2,
    expeditedCosts: [60, 65, 70],
    batchSize: 200,
    consumptions: [60, 70, 80],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 1350,
    shiftHoursPerDay: 8,
    safetyStock: 120,
  },

  'imbottigliamento-b500': {
    id: 'imbottigliamento-b500',
    title: 'Slittamento Capsule Alluminio su Linea Imbottigliamento B-500',
    role: 'Production Planner & MRP Specialist',
    category: 'production_planning',
    difficulty: 'Avanzato',
    partNumber: 'CAP-B500',
    productionLine: 'Linea Imbottigliamento & Tappatura Alta Velocità 3',
    shortDescription: 'Riprogrammazione commesse GDO con penali di consegna per ritardo fornitura capsule alluminio prefilettate.',
    summary:
      'Ritardo capsule stampate di 14 giorni su linea da 35.000 bph. Evitare fermo da 2.000 €/h e penali GDO attivando fornitura aerea da capsulificio francese (lotto 400 pz).',
    primarySupplierName: 'Capsule Italia S.r.l.',
    standardLeadTime: 6,
    disruptedLeadTime: 14,
    standardUnitCost: 25,
    expeditedSupplierName: 'AeroPackaging France S.A.S.',
    expeditedLeadTime: 3,
    expeditedCosts: [45, 50, 55],
    batchSize: 400,
    consumptions: [100, 120, 140],
    stockMultipliers: [7, 8, 9],
    downtimeCostPerHour: 2000,
    shiftHoursPerDay: 8,
    safetyStock: 200,
  },

  'estrusione-e620': {
    id: 'estrusione-e620',
    title: 'Esaurimento Granulo Medicale per Estrusore Tubi E-620',
    role: 'Production Planner & MRP Specialist',
    category: 'production_planning',
    difficulty: 'Avanzato',
    partNumber: 'POL-E620',
    productionLine: 'Reparto Estrusione Cleanroom Medicale',
    shortDescription: 'Mancata fornitura polimero medicale ISO 10993 per estrusione cateteri e ricalcolo turnazione continua.',
    summary:
      'Mancata fornitura polimero certificato con 16 giorni di ritardo. Riprogrammazione turni h24, costo fermo cleanroom da 1.750 €/h e compounding rapido svizzero (lotto 150 pz).',
    primarySupplierName: 'BioPolymers Europe N.V.',
    standardLeadTime: 8,
    disruptedLeadTime: 16,
    standardUnitCost: 80,
    expeditedSupplierName: 'SwissMedPlast Compound AG',
    expeditedLeadTime: 3,
    expeditedCosts: [130, 140, 150],
    batchSize: 150,
    consumptions: [35, 45, 55],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 1750,
    shiftHoursPerDay: 8,
    safetyStock: 80,
  },

  // ==========================================================================
  // CATEGORIA 3: BUYER TECNICO & PROCUREMENT SPECIALIST (5 Scenari)
  // ==========================================================================
  'scheda-e501': {
    id: 'scheda-e501',
    title: 'Crisi Approvvigionamento Microcontrollore Automotive E-501',
    role: 'Buyer Tecnico & Procurement Specialist',
    category: 'procurement',
    difficulty: 'Avanzato',
    partNumber: 'MCU-E501',
    productionLine: 'Linea SMT & Montaggio Schede 3',
    shortDescription: 'Allocazione silicio globale: acquisto spot broker certificato per continuità linea SMT.',
    summary:
      'Allocazione globale silicio, reperimento spot broker da 100 pezzi per evitare il blocco totale della linea SMT da 1.800 €/h.',
    primarySupplierName: 'SiliconTech Electronics B.V.',
    standardLeadTime: 10,
    disruptedLeadTime: 22,
    standardUnitCost: 30,
    expeditedSupplierName: 'GlobalSpot Component Brokers',
    expeditedLeadTime: 4,
    expeditedCosts: [70, 75, 80],
    batchSize: 100,
    consumptions: [20, 25, 30],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 1800,
    shiftHoursPerDay: 8,
    safetyStock: 50,
  },

  'fusione-f350': {
    id: 'fusione-f350',
    title: 'Fallimento Fonderia Carter Trasmissione in Alluminio F-350',
    role: 'Buyer Tecnico & Procurement Specialist',
    category: 'procurement',
    difficulty: 'Avanzato',
    partNumber: 'ALL-F350',
    productionLine: 'Linea Centri di Lavoro CNC Automotive',
    shortDescription: 'Fallimento improvviso fonderia carter cambio in alluminio e qualifica d\'urgenza fonderia polacca.',
    summary:
      'Fallimento fonderia e ritardo di 22 giorni. Valutazione subfornitura estera rapida a prezzo maggiorato, collaudi Cpk e costo fermo linea CNC da 1.650 €/h (lotto 120 pz).',
    primarySupplierName: 'Fonderie Pressofusione Padana S.r.l.',
    standardLeadTime: 10,
    disruptedLeadTime: 22,
    standardUnitCost: 70,
    expeditedSupplierName: 'Silesia Die-Cast Sp. z o.o.',
    expeditedLeadTime: 4,
    expeditedCosts: [120, 130, 140],
    batchSize: 120,
    consumptions: [25, 30, 35],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 1650,
    shiftHoursPerDay: 8,
    safetyStock: 60,
  },

  'cablaggio-w110': {
    id: 'cablaggio-w110',
    title: 'Carenza Rame & Guaine Ignifughe per Cablaggi Ferroviari W-110',
    role: 'Buyer Tecnico & Procurement Specialist',
    category: 'procurement',
    difficulty: 'Avanzato',
    partNumber: 'CAB-W110',
    productionLine: 'Reparto Assemblaggio Convertitori di Trazione',
    shortDescription: 'Carenza internazionale rame, conformità fuoco EN 45545 e trattativa fornitore strategico rapido.',
    summary:
      'Allocazione mondiale materie prime con ritardo di 19 giorni su cablaggi treni alta velocità. Trattativa broker specializzato al +140% e fermo da 1.950 €/h (lotto 75 pz).',
    primarySupplierName: 'ElettroCablaggi Brianza S.p.A.',
    standardLeadTime: 9,
    disruptedLeadTime: 19,
    standardUnitCost: 95,
    expeditedSupplierName: 'FastWire International Transit',
    expeditedLeadTime: 3,
    expeditedCosts: [160, 170, 180],
    batchSize: 75,
    consumptions: [20, 25, 30],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 1950,
    shiftHoursPerDay: 8,
    safetyStock: 50,
  },

  'sensore-s820': {
    id: 'sensore-s820',
    title: 'Taglio Quota Fornitore Sensori di Pressione Criogenici S-820',
    role: 'Buyer Tecnico & Procurement Specialist',
    category: 'procurement',
    difficulty: 'Avanzato',
    partNumber: 'SNS-S820',
    productionLine: 'Linea Assemblaggio Valvole Idrogeno & GNL',
    shortDescription: 'Razionamento al 40% su trasduttori piezoelettrici per valvole criogeniche e acquisto da distributore aerospaziale.',
    summary:
      'Taglio fornitura al 40% con ritardo di 21 giorni. Negoziazione fornitura spot da distributore aerospaziale, calcolo extra-costo vs fermo linea da 2.300 €/h (lotto 50 pz).',
    primarySupplierName: 'PrecisionSensors GmbH',
    standardLeadTime: 10,
    disruptedLeadTime: 21,
    standardUnitCost: 130,
    expeditedSupplierName: 'Apex CryoComponents Global',
    expeditedLeadTime: 4,
    expeditedCosts: [220, 235, 250],
    batchSize: 50,
    consumptions: [15, 20, 25],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 2300,
    shiftHoursPerDay: 8,
    safetyStock: 40,
  },

  'titanio-t950': {
    id: 'titanio-t950',
    title: 'Embargo & Rischio Fornitura Barre in Titanio Grado 5 T-950',
    role: 'Buyer Tecnico & Procurement Specialist',
    category: 'procurement',
    difficulty: 'Avanzato',
    partNumber: 'BAR-T950',
    productionLine: 'Isola Lavorazioni Speciali CNC 5 Assi Aeronautica',
    shortDescription: 'Shock geopolitico su forniture barre di titanio Ti6Al4V certificate EN 9100 con controlli ultrasonici 3.1.',
    summary:
      'Shock forniture titanio con ritardo di 24 giorni. Negoziazione con trader con stock certificato aerospace a forte sovrapprezzo per evitare blocco da 2.600 €/h (lotto 40 pz).',
    primarySupplierName: 'AeroMetals S.p.A.',
    standardLeadTime: 12,
    disruptedLeadTime: 24,
    standardUnitCost: 210,
    expeditedSupplierName: 'GlobalTitanium Logistics BV',
    expeditedLeadTime: 5,
    expeditedCosts: [340, 360, 380],
    batchSize: 40,
    consumptions: [12, 16, 20],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 2600,
    shiftHoursPerDay: 8,
    safetyStock: 30,
  },

  // ==========================================================================
  // CATEGORIA 4: JUNIOR PROCESS & LEAN CONTINUOUS IMPROVEMENT (5 Scenari)
  // ==========================================================================
  'process-m300': {
    id: 'process-m300',
    title: 'Bilanciamento Linea & Collo di Bottiglia Motore Brushless M-300',
    role: 'Junior Process & Lean Continuous Improvement Engineer',
    category: 'lean_process',
    difficulty: 'Avanzato',
    partNumber: 'ROT-M300',
    productionLine: 'Isola Robotizzata Lavorazione & Collaudo 4',
    shortDescription: 'Collo di bottiglia e ritardo fornitura alberi rotore M-300 su isola robotizzata di assemblaggio e collaudo.',
    summary:
      'Guasto rettificatrice fornitore alberi rotore M-300, 18 giorni di lead time, lotto rapido CNC da 150 pezzi e trade-off fermo isola robotizzata da 2.100 €/h.',
    primarySupplierName: 'PrecisionMachining Meccanica S.r.l.',
    standardLeadTime: 8,
    disruptedLeadTime: 18,
    standardUnitCost: 75,
    expeditedSupplierName: 'RapidCNC Swiss Precision',
    expeditedLeadTime: 3,
    expeditedCosts: [120, 130, 140],
    batchSize: 150,
    consumptions: [60, 75, 90],
    stockMultipliers: [7, 8, 9],
    downtimeCostPerHour: 2100,
    shiftHoursPerDay: 8,
    safetyStock: 120,
  },

  'smed-k150': {
    id: 'smed-k150',
    title: 'Progetto SMED & Rottura Mandrino Corsa su Estrusione K-150',
    role: 'Junior Process & Lean Continuous Improvement Engineer',
    category: 'lean_process',
    difficulty: 'Intermedio',
    partNumber: 'MAN-K150',
    productionLine: 'Linea Estrusione Profili Alluminio 1',
    shortDescription: 'Rottura mandrino cambio rapido durante setup e riorganizzazione SMED per azzerare tempi morti pressa.',
    summary:
      'Rottura mandrino durante cambio formato e ritardo fornitore utensili di 16 giorni. Calcolo fermo da 1.700 €/h, fornitore rapido austriaco (lotto 100 pz) e piano SMED.',
    primarySupplierName: 'Estrusione Utensili Emiliana S.r.l.',
    standardLeadTime: 7,
    disruptedLeadTime: 16,
    standardUnitCost: 90,
    expeditedSupplierName: 'ToolingExpress Austria GmbH',
    expeditedLeadTime: 3,
    expeditedCosts: [150, 160, 170],
    batchSize: 100,
    consumptions: [30, 40, 50],
    stockMultipliers: [7, 8, 9],
    downtimeCostPerHour: 1700,
    shiftHoursPerDay: 8,
    safetyStock: 60,
  },

  'kanban-k800': {
    id: 'kanban-k800',
    title: 'Rottura Loop Kanban & Saturazione AGV Riduttori K-800',
    role: 'Junior Process & Lean Continuous Improvement Engineer',
    category: 'lean_process',
    difficulty: 'Intermedio',
    partNumber: 'PIN-K800',
    productionLine: 'Linea Montaggio & Trasporto AGV 2',
    shortDescription: 'Rottura loop cartellini Kanban per guasto navetta AGV e calcolo buffer supermarket per riduttori industriali.',
    summary:
      'Rottura carrelli Kanban e ritardo ingranaggi di 15 giorni. Calcolo buffer sicurezza supermarket, danno fermo da 1.450 €/h e lotto urgente da rettifica (lotto 120 pz).',
    primarySupplierName: 'Meccanica Ingranaggi Padana S.p.A.',
    standardLeadTime: 6,
    disruptedLeadTime: 15,
    standardUnitCost: 50,
    expeditedSupplierName: 'Rettifiche Bresciane Rapide',
    expeditedLeadTime: 2,
    expeditedCosts: [85, 90, 95],
    batchSize: 120,
    consumptions: [50, 65, 80],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 1450,
    shiftHoursPerDay: 8,
    safetyStock: 100,
  },

  'qualita-q420': {
    id: 'qualita-q420',
    title: 'Contenimento Scarti 8D & Deriva Cella Flessibile Bielle Q-420',
    role: 'Junior Process & Lean Continuous Improvement Engineer',
    category: 'lean_process',
    difficulty: 'Avanzato',
    partNumber: 'BIE-Q420',
    productionLine: 'Cella Flessibile FMS Lavorazione Meccanica Bielle',
    shortDescription: 'Deriva geometrica mandrini con scarti al 30%, piano di contenimento 8D e fornitura tampone rettificata.',
    summary:
      'Picco scarti per deriva termica mandrini e 14 giorni di ritardo bonifica. Calcolo fermo cella da 1.850 €/h, fornitura esterna bielle (lotto 140 pz) e piano 8D.',
    primarySupplierName: 'Forgiatura Meccanica Orobica S.p.A.',
    standardLeadTime: 6,
    disruptedLeadTime: 14,
    standardUnitCost: 60,
    expeditedSupplierName: 'PrecisionGrind Germany AG',
    expeditedLeadTime: 3,
    expeditedCosts: [105, 110, 115],
    batchSize: 140,
    consumptions: [55, 70, 85],
    stockMultipliers: [7, 8, 9],
    downtimeCostPerHour: 1850,
    shiftHoursPerDay: 8,
    safetyStock: 110,
  },

  'takt-t600': {
    id: 'takt-t600',
    title: 'Sbilanciamento Takt Time & Collo Bottiglia Saldatura Inverter T-600',
    role: 'Junior Process & Lean Continuous Improvement Engineer',
    category: 'lean_process',
    difficulty: 'Avanzato',
    partNumber: 'DISS-T600',
    productionLine: 'Isola Robotizzata Saldatura Laser Inverter Solari',
    shortDescription: 'Sbilanciamento postazione saldatura laser, ritardo fornitore dissipatori e ribilanciamento Takt Time/linea.',
    summary:
      'Sbilanciamento stazione laser con ritardo fornitore dissipatori di 17 giorni. Calcolo fermo da 2.250 €/h, fornitura laser terza d\'urgenza (lotto 80 pz) e bilanciamento linea.',
    primarySupplierName: 'SolarThermal Components S.r.l.',
    standardLeadTime: 7,
    disruptedLeadTime: 17,
    standardUnitCost: 120,
    expeditedSupplierName: 'LaserWeld Express EU',
    expeditedLeadTime: 3,
    expeditedCosts: [190, 205, 220],
    batchSize: 80,
    consumptions: [30, 40, 50],
    stockMultipliers: [8, 9, 10],
    downtimeCostPerHour: 2250,
    shiftHoursPerDay: 8,
    safetyStock: 60,
  },
};

/**
 * Full scenario catalog array containing all 20 industrial scenarios.
 */
export const SCENARIO_CATALOG: ScenarioCatalogItem[] = Object.values(SCENARIO_TEMPLATES).map((t) => ({
  id: t.id,
  title: t.title,
  role: t.role,
  category: t.category,
  difficulty: t.difficulty,
  partNumber: t.partNumber,
  productionLine: t.productionLine,
  summary: t.summary,
  primarySupplier: t.primarySupplierName,
  downtimeCostPerHour: t.downtimeCostPerHour,
}));

/**
 * Builds deterministic scenario parameters based on a template and an unsigned 32-bit hash.
 */
function buildScenarioFromTemplate(template: ScenarioTemplate, positiveHash: number): SupplyChainScenarioConfig {
  const dailyConsumption = template.consumptions[positiveHash % template.consumptions.length];
  const stockMultiplier = template.stockMultipliers[Math.floor(positiveHash / 10) % template.stockMultipliers.length];
  const initialStock = dailyConsumption * stockMultiplier;

  const unitCostExpedited = template.expeditedCosts[Math.floor(positiveHash / 100) % template.expeditedCosts.length];
  const shiftHoursPerDay = template.shiftHoursPerDay ?? 8;

  const expectedStockoutDay = initialStock / dailyConsumption;
  const expectedDowntimeDays = Math.max(0, template.disruptedLeadTime - expectedStockoutDay);
  const expectedDowntimeHours = expectedDowntimeDays * shiftHoursPerDay;
  const expectedDowntimeCost = expectedDowntimeHours * template.downtimeCostPerHour;

  const unitsNeeded = expectedDowntimeDays * dailyConsumption;
  const expectedReorderQty = Math.max(
    template.batchSize,
    Math.ceil(unitsNeeded / template.batchSize) * template.batchSize
  );
  const expectedExtraCost = (unitCostExpedited - template.standardUnitCost) * expectedReorderQty;

  return {
    id: template.id,
    title: template.title,
    role: template.role,
    shortDescription: template.shortDescription,
    partNumber: template.partNumber,
    productionLine: template.productionLine,
    initialStock,
    dailyConsumption,
    safetyStock: template.safetyStock,
    primarySupplier: {
      name: template.primarySupplierName,
      standardLeadTimeDays: template.standardLeadTime,
      disruptedLeadTimeDays: template.disruptedLeadTime,
      unitCost: template.standardUnitCost,
    },
    expeditedSupplier: {
      name: template.expeditedSupplierName,
      leadTimeDays: template.expeditedLeadTime,
      unitCost: unitCostExpedited,
      batchSize: template.batchSize,
    },
    downtimeCostPerHour: template.downtimeCostPerHour,
    shiftHoursPerDay,
    expectedStockoutDay,
    expectedDowntimeDays,
    expectedDowntimeHours,
    expectedDowntimeCost,
    expectedReorderQty,
    expectedExtraCost,
  };
}

/**
 * Generates deterministic scenario parameters based on a candidate's session token and scenario ID.
 * Defaults to 'valvola-v104' for backwards compatibility.
 */
export function generateScenarioFromToken(
  token: string,
  scenarioId: string = 'valvola-v104'
): SupplyChainScenarioConfig {
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = hash >>> 0;

  const template = SCENARIO_TEMPLATES[scenarioId] || SCENARIO_TEMPLATES['valvola-v104'];
  return buildScenarioFromTemplate(template, positiveHash);
}

/**
 * Strips confidential expected answers from scenario config for public candidate delivery.
 */
export function sanitizeScenarioForCandidate(config: SupplyChainScenarioConfig): PublicScenarioConfig {
  const {
    expectedStockoutDay,
    expectedDowntimeDays,
    expectedDowntimeHours,
    expectedDowntimeCost,
    expectedReorderQty,
    expectedExtraCost,
    ...publicConfig
  } = config;

  return publicConfig;
}
