type CourtLocation = {
  code: string;
  name: string;
  coordinates: [number, number];
};

export const StaticCourtLocation = [
  'KELOWNA',
  'WESTMINSTER',
  'RICHMOND',
  'ROBSON SQUARE',
  'VANCOUVER',
];

// Exported from https://wsgw.dev.jag.gov.bc.ca/courts/Lookup/locations
export const courtLocations: Array<CourtLocation> = [
  {
    code: '5871',
    name: '100 Mile House Law Courts',
    coordinates: [-121.297, 51.6407],
  },
  {
    code: '3561',
    name: 'Abbotsford Provincial Court',
    coordinates: [-122.330638, 49.052153],
  },
  {
    code: 'ADJU',
    name: 'Adjudicator Listing',
    coordinates: [-84.539239, 39.161013],
  },
  {
    code: '5681',
    name: 'Anahim Lake Provincial Court',
    coordinates: [-81.407983, 28.288342],
  },
  {
    code: '4671',
    name: 'Ashcroft Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5691',
    name: 'Atlin Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: 'COA',
    name: 'B.C. Court of Appeal',
    coordinates: [-77.017614, 38.895738],
  },
  {
    code: '2007',
    name: 'Bella Bella Law Courts',
    coordinates: [-82.5767174, 28.1842551],
  },
  {
    code: '2008',
    name: 'Bella Coola Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '3511',
    name: 'Burnaby Court',
    coordinates: [-79.6227404, 43.6182518],
  },
  {
    code: '5701',
    name: 'Burns Lake Court',
    coordinates: [-81.407983, 28.288342],
  },
  {
    code: '1031',
    name: 'Campbell River Court',
    coordinates: [-78.4561147, 38.0431279],
  },
  {
    code: '5711',
    name: 'Cassiar Court',
    coordinates: [-119.42375, 49.9035771],
  },
  {
    code: '4681',
    name: 'Castlegar Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '4691',
    name: 'Chase Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5721',
    name: 'Chetwynd Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '3521',
    name: 'Chilliwack Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '4701',
    name: 'Clearwater Provincial Court',
    coordinates: [-82.676036, 27.895439],
  },
  {
    code: 'CAKA',
    name: 'Court of Appeal of BC - Kamloops',
    coordinates: [-120.287843, 50.676985],
  },
  {
    code: 'CAKE',
    name: 'Court of Appeal of BC - Kelowna',
    coordinates: [-119.42388, 49.887378],
  },
  {
    code: 'CAVA',
    name: 'Court of Appeal of BC - Vancouver',
    coordinates: [-123.109016, 49.262092],
  },
  {
    code: 'CAVI',
    name: 'Court of Appeal of BC - Victoria',
    coordinates: [-123.3649, 48.4283],
  },
  {
    code: '1041',
    name: 'Courtenay Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '4711',
    name: 'Cranbrook Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '4721',
    name: 'Creston Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '5731',
    name: 'Dawson Creek Law Courts',
    coordinates: [-120.224535, 55.754221],
  },
  {
    code: '5741',
    name: 'Dease Lake Provincial Court',
    coordinates: [-81.407983, 28.288342],
  },
  {
    code: '2010',
    name: 'Delta Provincial Court',
    coordinates: [-112.57187, 39.352371],
  },
  {
    code: '1051',
    name: 'Duncan Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '4731',
    name: 'Fernie Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '5751',
    name: 'Fort Nelson Law Courts',
    coordinates: [-80.6833409, 28.1668511],
  },
  {
    code: '5761',
    name: 'Fort St. James Provincial Court',
    coordinates: [-124.2627, 54.456],
  },
  {
    code: '5771',
    name: 'Fort St. John Law Courts',
    coordinates: [-120.849327, 56.247434],
  },
  {
    code: '5775',
    name: 'Fort Ware Provincial Court',
    coordinates: [-77.1022215, 38.830651],
  },
  {
    code: '5781',
    name: 'Fraser Lake Provincial Court',
    coordinates: [-81.407983, 28.288342],
  },
  {
    code: '1061',
    name: 'Ganges Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '1071',
    name: 'Gold River Provincial Court',
    coordinates: [-121.290142, 38.587692],
  },
  {
    code: '4741',
    name: 'Golden Law Court',
    coordinates: [2.622284, 48.539747],
  },
  {
    code: '4751',
    name: 'Grand Forks Law Courts',
    coordinates: [-97.032281, 47.925208],
  },
  {
    code: '3541',
    name: 'Hope Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5791',
    name: 'Houston Provincial Court',
    coordinates: [-95.366758, 29.755485],
  },
  {
    code: '5801',
    name: "Hudson's Hope Provincial Court",
    coordinates: [-81.480109, 41.177566],
  },
  {
    code: '4771',
    name: 'Invermere Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '2041',
    name: 'Justice Centre (Judicial)',
    coordinates: [1.17251, 48.546929],
  },
  {
    code: '4781',
    name: 'Kamloops Court',
    coordinates: [-122.6728038, 38.4271595],
  },
  {
    code: '4801',
    name: 'Kelowna Law Courts',
    coordinates: [-119.496192, 49.890358],
  },
  {
    code: '4811',
    name: 'Kimberley Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5811',
    name: 'Kitimat Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: 'KSS',
    name: 'Kitsilano Secondary School',
    coordinates: [-123.163993, 49.2621855],
  },
  {
    code: '2009',
    name: 'Klemtu Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: 'KPU',
    name: 'Kwantlen Polytechnic University',
    coordinates: [-122.872493, 49.125101],
  },
  {
    code: '3545',
    name: 'Langley Provincial Court',
    coordinates: [-122.46193, 49.057048],
  },
  {
    code: '7999',
    name: 'Leech Town Court House',
    coordinates: [-0.21896, 51.506347],
  },
  {
    code: 'LECR',
    name: 'Leech Town Court Registry',
    coordinates: [153.0177879, -27.6940518],
  },
  {
    code: '4821',
    name: 'Lillooet Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '5821',
    name: 'Lower Post Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '4831',
    name: 'Lytton Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5831',
    name: 'MacKenzie Provincial Court',
    coordinates: [-125.003242, 49.6831506],
  },
  {
    code: '3551',
    name: 'Maple Ridge Provincial Court',
    coordinates: [-124.988711, 49.7092281],
  },
  {
    code: '5841',
    name: 'Masset Provincial Court',
    coordinates: [-90.674198, 42.496982],
  },
  {
    code: '5845',
    name: 'McBride Provincial Court',
    coordinates: [-84.771795, 33.392185],
  },
  {
    code: '4851',
    name: 'Merritt Law Court',
    coordinates: [2.622284, 48.539747],
  },
  {
    code: '3571',
    name: 'Mission Provincial Court',
    coordinates: [-124.9707754, 49.7153156],
  },
  {
    code: '4861',
    name: 'Nakusp Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '1091',
    name: 'Nanaimo Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: 'NA10',
    name: 'Nanaimo Law Courts NA10',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA01',
    name: 'Nanaimo Law Courts NAO1',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA02',
    name: 'Nanaimo Law Courts NAO2',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA03',
    name: 'Nanaimo Law Courts NAO3',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA04',
    name: 'Nanaimo Law Courts NAO4',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA05',
    name: 'Nanaimo Law Courts NAO5',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA06',
    name: 'Nanaimo Law Courts NAO6',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA07',
    name: 'Nanaimo Law Courts NAO7',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA08',
    name: 'Nanaimo Law Courts NAO8',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: 'NA09',
    name: 'Nanaimo Law Courts NAO9',
    coordinates: [-123.946123, 49.166363],
  },
  {
    code: '4871',
    name: 'Nelson Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '5851',
    name: 'New Aiyansh Provincial Court',
    coordinates: [-80.536195, 36.113283],
  },
  {
    code: '5861',
    name: 'New Hazelton Provincial Court',
    coordinates: [-80.5463347, 36.1165132],
  },
  {
    code: '3581',
    name: 'New Westminster Law Courts',
    coordinates: [-122.911265, 49.20342],
  },
  {
    code: '2011',
    name: 'North Vancouver Court',
    coordinates: [-123.068873, 49.330768],
  },
  {
    code: '4881',
    name: 'Oliver Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '1111',
    name: 'Parksville Provincial Court',
    coordinates: [-75.9092239044873, 41.280872559601],
  },
  {
    code: '2021',
    name: 'Pemberton Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '4891',
    name: 'Penticton Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '1121',
    name: 'Port Alberni Law Courts',
    coordinates: [-124.795857, 49.244833],
  },
  {
    code: '3531',
    name: 'Port Coquitlam Court',
    coordinates: [-122.848141, 49.255585],
  },
  {
    code: '1141',
    name: 'Port Hardy Law Courts',
    coordinates: [115.81789, -32.05794],
  },
  {
    code: '1145',
    name: 'Powell River Law Courts',
    coordinates: [-124.528003, 49.839551],
  },
  {
    code: '5891',
    name: 'Prince George Law Courts',
    coordinates: [-122.745934, 53.916795],
  },
  {
    code: '5895',
    name: 'Prince George Supreme Court',
    coordinates: [-122.751167, 53.912445],
  },
  {
    code: '5901',
    name: 'Prince Rupert Law Courts',
    coordinates: [-113.488021, 53.545521],
  },
  {
    code: '4901',
    name: 'Princeton Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '5911',
    name: 'Queen Charlotte City Provincial Crt',
    coordinates: [-80.83262400000001, 35.188528500000004],
  },
  {
    code: '5921',
    name: 'Quesnel Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '4911',
    name: 'Revelstoke Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '2027',
    name: 'Richmond Court Small Claims and Family Court',
    coordinates: [-77.4303, 37.541],
  },
  {
    code: '2025',
    name: 'Richmond Provincial Court',
    coordinates: [-123.140962, 49.171916],
  },
  {
    code: '2045',
    name: 'Robson Square Provincial Court',
    coordinates: [-87.364767, 41.41794],
  },
  {
    code: '4921',
    name: 'Rossland Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '4941',
    name: 'Salmon Arm Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '2031',
    name: 'Sechelt Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: 'SRES',
    name: 'Shared Resource',
    coordinates: [-95.157927, 29.701936],
  },
  {
    code: 'SHER',
    name: 'Sherbrooke Courthouse',
    coordinates: [-76.700162, 37.271401],
  },
  {
    code: '1151',
    name: 'Sidney Provincial Court',
    coordinates: [151.212818, -33.867982],
  },
  {
    code: '5931',
    name: 'Smithers Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '4951',
    name: 'Sparwood Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '2035',
    name: 'Squamish Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5941',
    name: 'Stewart Provincial Court',
    coordinates: [-124.9936502, 49.6729154000001],
  },
  {
    code: '3587',
    name: 'Surrey Family Court',
    coordinates: [-80.5927424, 36.1292023],
  },
  {
    code: '3585',
    name: 'Surrey Provincial Court',
    coordinates: [-122.825406, 49.105909],
  },
  {
    code: '1171',
    name: 'Tahsis Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5951',
    name: 'Terrace Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '1181',
    name: 'Tofino Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5805',
    name: 'Tsay Keh Dene Court',
    coordinates: [-123.767347963011, 56.7822085411335],
  },
  {
    code: '5955',
    name: 'Tumbler Ridge Provincial Court',
    coordinates: [-77.576624, 37.645113],
  },
  {
    code: '1191',
    name: 'Ucluelet Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '5959',
    name: 'Valemount Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '6011',
    name: 'Vancouver Law Courts',
    coordinates: [-123.123087, 49.281349],
  },
  {
    code: '2040',
    name: 'Vancouver Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '2048',
    name: 'Vancouver Traffic Court',
    coordinates: [-123.200257, 49.26211],
  },
  {
    code: '5961',
    name: 'Vanderhoof Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '4971',
    name: 'Vernon Law Courts',
    coordinates: [-120.808909, 38.695618],
  },
  {
    code: '1207',
    name: 'Victoria Family and Youth Court',
    coordinates: [145.268912, -37.750371],
  },
  {
    code: '1201',
    name: 'Victoria Law Courts',
    coordinates: [-1.8923995, 52.4838375],
  },
  {
    code: '2049',
    name: 'Violation Ticket Centre',
    coordinates: [-48.634519, -26.995659],
  },
  {
    code: '2051',
    name: 'West Vancouver Provincial Court',
    coordinates: [-123.123085, 49.281307],
  },
  {
    code: '1211',
    name: 'Western Communities Provincial Court',
    coordinates: [-124.9847681, 49.7074652000001],
  },
  {
    code: '5971',
    name: 'Williams Lake Law Courts',
    coordinates: [-122.14516, 52.129812],
  },
];
