export interface RailwayStation {
  code: string
  name: string
  latitude: number
  longitude: number
  state: string
  division: string
  blockSectionStart: string
  blockSectionEnd: string
  route: string
  km: number
}

export const KERALA_STATIONS: RailwayStation[] = [
  // -------------------------
  // ERNAKULAM REGION
  // -------------------------
  {
    code: "ERS",
    name: "Ernakulam Junction (South)",
    latitude: 9.9791,
    longitude: 76.2855,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Ernakulam Town",
    blockSectionEnd: "Thrippunithura",
    route: "Shoranur – Ernakulam Main Line",
    km: 586,
  },
  {
    code: "ERN",
    name: "Ernakulam Town (North)",
    latitude: 9.9986,
    longitude: 76.2893,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Aluva",
    blockSectionEnd: "Ernakulam Jn",
    route: "Shoranur – Ernakulam Main Line",
    km: 583,
  },
  {
    code: "AWY",
    name: "Aluva",
    latitude: 10.1076,
    longitude: 76.3521,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Angamaly",
    blockSectionEnd: "Ernakulam Town",
    route: "Shoranur – Ernakulam Main Line",
    km: 570,
  },
  {
    code: "AFK",
    name: "Angamaly",
    latitude: 10.1963,
    longitude: 76.3867,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Chalakudy",
    blockSectionEnd: "Aluva",
    route: "Shoranur – Ernakulam Main Line",
    km: 558,
  },

  // -------------------------
  // PALAKKAD REGION
  // -------------------------
  {
    code: "PGT",
    name: "Palakkad Junction",
    latitude: 10.774,
    longitude: 76.651,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Kollengode",
    blockSectionEnd: "Palakkad Town",
    route: "Palakkad – Coimbatore Line",
    km: 510,
  },
  {
    code: "PGTN",
    name: "Palakkad Town",
    latitude: 10.7749,
    longitude: 76.6599,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Palakkad Jn",
    blockSectionEnd: "Kanjikode",
    route: "Palakkad – Coimbatore Line",
    km: 511,
  },
  {
    code: "KJKD",
    name: "Kanjikode",
    latitude: 10.8075,
    longitude: 76.74,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Palakkad Town",
    blockSectionEnd: "Walayar",
    route: "Palakkad – Coimbatore Line",
    km: 518,
  },
  {
    code: "WRA",
    name: "Walayar",
    latitude: 10.8395,
    longitude: 76.852,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Kanjikode",
    blockSectionEnd: "Ettimadai",
    route: "Palakkad – Coimbatore Line",
    km: 528,
  },

  // -------------------------
  // TRIVANDRUM REGION
  // -------------------------
  {
    code: "TVC",
    name: "Trivandrum Central",
    latitude: 8.4871,
    longitude: 76.9523,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Kochuveli",
    blockSectionEnd: "Neyyattinkara",
    route: "Trivandrum – Nagercoil Main Line",
    km: 676,
  },
  {
    code: "KCVL",
    name: "Kochuveli",
    latitude: 8.5243,
    longitude: 76.9174,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Veli",
    blockSectionEnd: "Trivandrum Central",
    route: "Trivandrum Suburban",
    km: 670,
  },
  {
    code: "NYN",
    name: "Neyyattinkara",
    latitude: 8.3997,
    longitude: 77.0851,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Dhanuvachapuram",
    blockSectionEnd: "Trivandrum Central",
    route: "Trivandrum – Nagercoil",
    km: 683,
  },

  // -------------------------
  // KOZHIKODE REGION
  // -------------------------
  {
    code: "CLT",
    name: "Kozhikode (Calicut)",
    latitude: 11.2588,
    longitude: 75.7804,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "West Hill",
    blockSectionEnd: "Feroke",
    route: "Shoranur – Mangalore Line",
    km: 438,
  },
  {
    code: "FK",
    name: "Feroke",
    latitude: 11.184,
    longitude: 75.8416,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Kadalundi",
    blockSectionEnd: "Kozhikode",
    route: "Shoranur – Mangalore Line",
    km: 431,
  },
  {
    code: "TIR",
    name: "Tirur",
    latitude: 10.9167,
    longitude: 75.9193,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Parappanangadi",
    blockSectionEnd: "Tanur",
    route: "Shoranur – Mangalore Line",
    km: 403,
  },

  // -------------------------
  // THRISSUR REGION
  // -------------------------
  {
    code: "TCR",
    name: "Thrissur",
    latitude: 10.5206,
    longitude: 76.2144,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Poonkunnam",
    blockSectionEnd: "Mulankunnathukavu",
    route: "Shoranur – Ernakulam",
    km: 539,
  },
  {
    code: "WKI",
    name: "Wadakkanchery",
    latitude: 10.6168,
    longitude: 76.2422,
    state: "Kerala",
    division: "Trivandrum",
    blockSectionStart: "Mulankunnathukavu",
    blockSectionEnd: "Ollur",
    route: "Shoranur – Ernakulam",
    km: 546,
  },

  // -------------------------
  // SHORANUR – MAJOR JUNCTION
  // -------------------------
  {
    code: "SRR",
    name: "Shoranur Junction",
    latitude: 10.7614,
    longitude: 76.2745,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Vallathole Nagar",
    blockSectionEnd: "Karakkad",
    route: "Kerala Central Junction",
    km: 515,
  },

  // -------------------------
  // KANNUR & NORTHERN KERALA
  // -------------------------
  {
    code: "CAN",
    name: "Kannur",
    latitude: 11.8745,
    longitude: 75.3739,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Kannur South",
    blockSectionEnd: "Kannapuram",
    route: "Shoranur – Mangalore Line",
    km: 350,
  },
  {
    code: "KGQ",
    name: "Kasaragod",
    latitude: 12.4984,
    longitude: 74.9898,
    state: "Kerala",
    division: "Palakkad",
    blockSectionStart: "Kumbala",
    blockSectionEnd: "Uppala",
    route: "Shoranur – Mangalore Line",
    km: 305,
  },
]
