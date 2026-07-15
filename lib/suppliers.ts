export interface Supplier {
  id: string;
  Company_Name: string;
  Category: string; // Tier 1, Bio-based, Low-carbon startups, etc.
  Material_Class: string;
  Region: string;
  Country: string;
  Website: string;
  Scale: 'Global' | 'Regional' | 'Startup';
  Specialty: string;
  Contact_Email?: string;
  Phone?: string;
  Certifications: string[];
  Carbon_Rating: 'A' | 'B' | 'C' | 'D' | 'Unknown';
  Pricing_Index: number; // 1 to 5
}

export const SUPPLIER_DATABASE: Supplier[] = [
  // 1. GLOBAL TIER 1
  {
    id: 'S001',
    Company_Name: 'Holcim',
    Category: 'Tier 1 Global',
    Material_Class: 'Low-Carbon Concrete & Cement',
    Region: 'Global',
    Country: 'Switzerland',
    Website: 'www.holcim.com',
    Scale: 'Global',
    Specialty: 'Green cement, ECOPact concrete, recycled aggregates',
    Phone: '+41 58 858 58 58',
    Certifications: ['LEED Verified', 'ISO 14001', 'EPD Certified'],
    Carbon_Rating: 'A',
    Pricing_Index: 3
  },
  {
    id: 'S002',
    Company_Name: 'CEMEX',
    Category: 'Tier 1 Global',
    Material_Class: 'Low-Carbon Concrete & Cement',
    Region: 'Global',
    Country: 'Mexico',
    Website: 'www.cemex.com',
    Scale: 'Global',
    Specialty: 'Low-carbon concrete (Vertua), cement, aggregates',
    Contact_Email: 'sales@cemex.co.za',
    Phone: '+27 21 518 0861',
    Certifications: ['EPD Certified', 'ISO 14001'],
    Carbon_Rating: 'B',
    Pricing_Index: 3
  },
  {
    id: 'S003',
    Company_Name: 'CRH plc',
    Category: 'Tier 1 Global',
    Material_Class: 'Low-Carbon Concrete & Cement',
    Region: 'Global',
    Country: 'Ireland',
    Website: 'www.crh.com',
    Scale: 'Global',
    Specialty: 'Sustainable cement, recycled aggregates',
    Phone: '+353 1 634 4340',
    Certifications: ['ISO 14001', 'LEED'],
    Carbon_Rating: 'B',
    Pricing_Index: 3
  },
  {
    id: 'S004',
    Company_Name: 'Sika AG',
    Category: 'Tier 1 Global',
    Material_Class: 'Chemicals / Advanced Materials',
    Region: 'Global',
    Country: 'Switzerland',
    Website: 'www.sika.com',
    Scale: 'Global',
    Specialty: 'Concrete additives, sealants, low-carbon systems',
    Phone: '+41 58 436 40 40',
    Certifications: ['ISO 9001', 'ISO 14001'],
    Carbon_Rating: 'B',
    Pricing_Index: 4
  },
  
  // 2. MASS TIMBER & BIO-BASED
  {
    id: 'S010',
    Company_Name: 'Stora Enso',
    Category: 'Bio-based',
    Material_Class: 'Timber & Bio-Based',
    Region: 'Global',
    Country: 'Finland',
    Website: 'www.storaenso.com',
    Scale: 'Global',
    Specialty: 'CLT, mass timber',
    Phone: '+358 2046 131',
    Certifications: ['FSC', 'PEFC'],
    Carbon_Rating: 'A',
    Pricing_Index: 4
  },
  {
    id: 'S011',
    Company_Name: 'Binderholz',
    Category: 'Bio-based',
    Material_Class: 'Timber & Bio-Based',
    Region: 'Europe',
    Country: 'Austria',
    Website: 'www.binderholz.com',
    Scale: 'Regional',
    Specialty: 'CLT, glulam',
    Phone: '+43 5244 601',
    Certifications: ['PEFC'],
    Carbon_Rating: 'A',
    Pricing_Index: 4
  },
  {
    id: 'S012',
    Company_Name: 'KLH Massivholz',
    Category: 'Bio-based',
    Material_Class: 'Timber & Bio-Based',
    Region: 'Europe',
    Country: 'Austria',
    Website: 'www.klh.at',
    Scale: 'Regional',
    Specialty: 'Cross-laminated timber',
    Phone: '+43 3633 21000',
    Certifications: ['FSC', 'EPD'],
    Carbon_Rating: 'A',
    Pricing_Index: 4
  },
  {
    id: 'S013',
    Company_Name: 'Hempitecture',
    Category: 'Bio-based',
    Material_Class: 'Timber & Bio-Based',
    Region: 'North America',
    Country: 'USA',
    Website: 'www.hempitecture.com',
    Scale: 'Startup',
    Specialty: 'Hemp insulation, hempcrete',
    Contact_Email: 'info@hempitecture.com',
    Certifications: ['USDA BioPreferred'],
    Carbon_Rating: 'A',
    Pricing_Index: 3
  },
  {
    id: 'S014',
    Company_Name: 'Mykor',
    Category: 'Bio-based',
    Material_Class: 'Timber & Bio-Based',
    Region: 'Europe',
    Country: 'UK',
    Website: 'www.mykor.com',
    Scale: 'Startup',
    Specialty: 'Mycelium insulation panels',
    Certifications: ['BREEAM Compatible'],
    Carbon_Rating: 'A',
    Pricing_Index: 4
  },

  // 4. RECYCLED MATERIAL & CIRCULAR ECONOMY
  {
    id: 'S020',
    Company_Name: 'The Good Plastic Company',
    Category: 'Circular Economy',
    Material_Class: 'Recycled & Circular',
    Region: 'Europe',
    Country: 'Netherlands',
    Website: 'www.thegoodplasticcompany.com',
    Scale: 'Regional',
    Specialty: '100% recycled panels',
    Contact_Email: 'info@thegoodplasticcompany.com',
    Certifications: ['Cradle to Cradle'],
    Carbon_Rating: 'A',
    Pricing_Index: 4
  },
  {
    id: 'S021',
    Company_Name: 'UBQ Materials',
    Category: 'Circular Economy',
    Material_Class: 'Recycled & Circular',
    Region: 'Global',
    Country: 'Israel',
    Website: 'www.ubqmaterials.com',
    Scale: 'Global',
    Specialty: 'Thermoplastic from mixed waste',
    Contact_Email: 'info@ubqmaterials.com',
    Certifications: ['B-Corp', 'EPD'],
    Carbon_Rating: 'A',
    Pricing_Index: 3
  },
  {
    id: 'S022',
    Company_Name: 'Trex Company',
    Category: 'Circular Economy',
    Material_Class: 'Recycled & Circular',
    Region: 'Global',
    Country: 'USA',
    Website: 'www.trex.com',
    Scale: 'Global',
    Specialty: 'Composite decking (recycled plastic + wood)',
    Phone: '+1 800 289 8739',
    Certifications: ['LEED Compatible'],
    Carbon_Rating: 'B',
    Pricing_Index: 3
  },
  {
    id: 'S023',
    Company_Name: 'GreenMantra Technologies',
    Category: 'Circular Economy',
    Material_Class: 'Recycled & Circular',
    Region: 'North America',
    Country: 'Canada',
    Website: 'www.greenmantra.com',
    Scale: 'Regional',
    Specialty: 'Recycled plastic additives',
    Contact_Email: 'info@greenmantra.com',
    Certifications: ['ISO 9001'],
    Carbon_Rating: 'A',
    Pricing_Index: 3
  },
  {
    id: 'S024',
    Company_Name: 'ECOR Global',
    Category: 'Circular Economy',
    Material_Class: 'Recycled & Circular',
    Region: 'Global',
    Country: 'USA',
    Website: 'www.ecorglobal.com',
    Scale: 'Global',
    Specialty: 'Panels from waste fibers',
    Certifications: ['Cradle to Cradle'],
    Carbon_Rating: 'A',
    Pricing_Index: 3
  },

  // 5. INSULATION & LIGHTWEIGHT MATERIALS
  {
    id: 'S030',
    Company_Name: 'Xella Group',
    Category: 'Insulation',
    Material_Class: 'Insulation & Energy',
    Region: 'Global',
    Country: 'Germany',
    Website: 'www.xella.com',
    Scale: 'Global',
    Specialty: 'AAC blocks, insulation systems',
    Phone: '+49 800 5235665',
    Certifications: ['EPD', 'ISO 14001'],
    Carbon_Rating: 'B',
    Pricing_Index: 2
  },
  {
    id: 'S031',
    Company_Name: 'Rockwool',
    Category: 'Insulation',
    Material_Class: 'Insulation & Energy',
    Region: 'Global',
    Country: 'Denmark',
    Website: 'www.rockwool.com',
    Scale: 'Global',
    Specialty: 'Mineral wool insulation',
    Phone: '+45 46 56 03 00',
    Certifications: ['EPD', 'ISO 14001'],
    Carbon_Rating: 'B',
    Pricing_Index: 3
  },
  {
    id: 'S032',
    Company_Name: 'Kingspan Group',
    Category: 'Insulation',
    Material_Class: 'Insulation & Energy',
    Region: 'Global',
    Country: 'Ireland',
    Website: 'www.kingspan.com',
    Scale: 'Global',
    Specialty: 'High-performance insulation panels',
    Phone: '+353 42 969 8000',
    Certifications: ['EPD', 'Planet Passionate'],
    Carbon_Rating: 'B',
    Pricing_Index: 4
  },
  {
    id: 'S033',
    Company_Name: 'Glavel',
    Category: 'Insulation',
    Material_Class: 'Insulation & Energy',
    Region: 'North America',
    Country: 'USA',
    Website: 'www.glavel.com',
    Scale: 'Startup',
    Specialty: 'Foam glass insulation',
    Certifications: ['EPD'],
    Carbon_Rating: 'A',
    Pricing_Index: 4
  },

  // Recycling & Resource Recovery (as per user list)
  {
    id: 'S040',
    Company_Name: 'Veolia',
    Category: 'Circular Economy',
    Material_Class: 'Recycling & Resource Recovery',
    Region: 'Global',
    Country: 'France',
    Website: 'www.veolia.com',
    Scale: 'Global',
    Specialty: 'Construction waste recycling',
    Phone: '+33 1 85 57 70 00',
    Certifications: ['ISO 14001', 'ISO 9001'],
    Carbon_Rating: 'B',
    Pricing_Index: 2
  },
  {
    id: 'S041',
    Company_Name: 'SUEZ',
    Category: 'Circular Economy',
    Material_Class: 'Recycling & Resource Recovery',
    Region: 'Global',
    Country: 'France',
    Website: 'www.suez.com',
    Scale: 'Global',
    Specialty: 'Recycling + circular materials',
    Phone: '+33 1 58 81 20 00',
    Certifications: ['ISO 14001', 'EPD'],
    Carbon_Rating: 'B',
    Pricing_Index: 2
  },
  {
    id: 'S042',
    Company_Name: 'Radius Recycling',
    Category: 'Circular Economy',
    Material_Class: 'Recycling & Resource Recovery',
    Region: 'North America',
    Country: 'USA',
    Website: 'www.radiusrecycling.com',
    Scale: 'Regional',
    Specialty: 'Recycled steel & metals',
    Phone: '+1 503 224 9900',
    Certifications: ['ISO 14001'],
    Carbon_Rating: 'A',
    Pricing_Index: 2
  }
];
