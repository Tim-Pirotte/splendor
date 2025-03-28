//NOSONAR_BEGIN
const GEMS = [
  "Diamond",
  "Sapphire",
  "Emerald",
  "Ruby",
  "Onyx",
  "Gold"
];

const NOBLES = [
  {
    "name": "Mary Stuart",
    "neededBonuses": {
      "Ruby": 4,
      "Emerald": 4
    },
    "prestigePoints": 3
  },
  {
    "name": "Suleiman the Magnificent",
    "neededBonuses": {
      "Emerald": 4,
      "Sapphire": 4
    },
    "prestigePoints": 3
  },
  {
    "name": "Niccolo Machiavelli",
    "neededBonuses": {
      "Sapphire": 4,
      "Diamond": 4
    },
    "prestigePoints": 3
  },
  {
    "name": "Isabella of Castile",
    "neededBonuses": {
      "Onyx": 4,
      "Diamond": 4
    },
    "prestigePoints": 3
  },
  {
    "name": "Henry VIII",
    "neededBonuses": {
      "Ruby": 4,
      "Onyx": 4
    },
    "prestigePoints": 3
  },
  {
    "name": "Elizabeth of Austria",
    "neededBonuses": {
      "Onyx": 3,
      "Sapphire": 3,
      "Diamond": 3
    },
    "prestigePoints": 3
  },
  {
    "name": "Francois the 1st",
    "neededBonuses": {
      "Ruby": 3,
      "Onyx": 3,
      "Emerald": 3
    },
    "prestigePoints": 3
  },
  {
    "name": "Charles the Fifth",
    "neededBonuses": {
      "Ruby": 3,
      "Onyx": 3,
      "Diamond": 3
    },
    "prestigePoints": 3
  },
  {
    "name": "Catherine de Medici",
    "neededBonuses": {
      "Ruby": 3,
      "Emerald": 3,
      "Sapphire": 3
    },
    "prestigePoints": 3
  },
  {
    "name": "Anne of Brittany",
    "neededBonuses": {
      "Emerald": 3,
      "Sapphire": 3,
      "Diamond": 3
    },
    "prestigePoints": 3
  }
];

const DEVELOPMENT_CARDS = [
  {
    "name": "Diamond Mine",
    "level": 1,
    "cost": {
      "Onyx": 1,
      "Sapphire": 1,
      "Diamond": 3
    },
    "bonus": "Diamond",
    "prestigePoints": 0
  },
  {
    "name": "Diamond Vein",
    "level": 1,
    "cost": {
      "Onyx": 2,
      "Sapphire": 2
    },
    "bonus": "Diamond",
    "prestigePoints": 0
  },
  {
    "name": "Shimmering Quarry",
    "level": 1,
    "cost": {
      "Sapphire": 3
    },
    "bonus": "Diamond",
    "prestigePoints": 0
  },
  {
    "name": "Brilliant Mine",
    "level": 1,
    "cost": {
      "Ruby": 2,
      "Onyx": 1
    },
    "bonus": "Diamond",
    "prestigePoints": 0
  },
  {
    "name": "Radiant Crystal Cave",
    "level": 1,
    "cost": {
      "Onyx": 1,
      "Emerald": 2,
      "Sapphire": 2
    },
    "bonus": "Diamond",
    "prestigePoints": 0
  },
  {
    "name": "Facet Workshop",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Onyx": 1,
      "Emerald": 2,
      "Sapphire": 1
    },
    "bonus": "Diamond",
    "prestigePoints": 0
  },
  {
    "name": "Glistening Vault",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Onyx": 1,
      "Emerald": 1,
      "Sapphire": 1
    },
    "bonus": "Diamond",
    "prestigePoints": 0
  },
  {
    "name": "Sparkling Chamber",
    "level": 1,
    "cost": {
      "Emerald": 4
    },
    "bonus": "Diamond",
    "prestigePoints": 1
  },
  {
    "name": "Polished Vault",
    "level": 2,
    "cost": {
      "Ruby": 2,
      "Onyx": 2,
      "Emerald": 3
    },
    "bonus": "Diamond",
    "prestigePoints": 1
  },
  {
    "name": "Diamond Refinery",
    "level": 2,
    "cost": {
      "Ruby": 3,
      "Sapphire": 3,
      "Diamond": 2
    },
    "bonus": "Diamond",
    "prestigePoints": 1
  },
  {
    "name": "Radiant Workshop",
    "level": 2,
    "cost": {
      "Ruby": 4,
      "Onyx": 2,
      "Emerald": 1
    },
    "bonus": "Diamond",
    "prestigePoints": 2
  },
  {
    "name": "Gleaming Estate",
    "level": 2,
    "cost": {
      "Ruby": 5
    },
    "bonus": "Diamond",
    "prestigePoints": 2
  },
  {
    "name": "Sparkling Guild",
    "level": 2,
    "cost": {
      "Ruby": 5,
      "Onyx": 3
    },
    "bonus": "Diamond",
    "prestigePoints": 2
  },
  {
    "name": "Brilliant Collection",
    "level": 2,
    "cost": {
      "Diamond": 6
    },
    "bonus": "Diamond",
    "prestigePoints": 3
  },
  {
    "name": "Grand Diamond Vault",
    "level": 3,
    "cost": {
      "Ruby": 5,
      "Onyx": 3,
      "Emerald": 3,
      "Sapphire": 3
    },
    "bonus": "Diamond",
    "prestigePoints": 3
  },
  {
    "name": "Exquisite Diamond Vault",
    "level": 3,
    "cost": {
      "Onyx": 7
    },
    "bonus": "Diamond",
    "prestigePoints": 4
  },
  {
    "name": "Royal Diamond Chamber",
    "level": 3,
    "cost": {
      "Ruby": 3,
      "Onyx": 6,
      "Diamond": 3
    },
    "bonus": "Diamond",
    "prestigePoints": 4
  },
  {
    "name": "Master Diamond Atelier",
    "level": 3,
    "cost": {
      "Onyx": 7,
      "Diamond": 3
    },
    "bonus": "Diamond",
    "prestigePoints": 5
  },
  {
    "name": "Emerald Mine",
    "level": 1,
    "cost": {
      "Ruby": 2,
      "Sapphire": 2
    },
    "bonus": "Emerald",
    "prestigePoints": 0
  },
  {
    "name": "Emerald Vein",
    "level": 1,
    "cost": {
      "Ruby": 3
    },
    "bonus": "Emerald",
    "prestigePoints": 0
  },
  {
    "name": "Verdant Quarry",
    "level": 1,
    "cost": {
      "Emerald": 1,
      "Sapphire": 3,
      "Diamond": 1
    },
    "bonus": "Emerald",
    "prestigePoints": 0
  },
  {
    "name": "Lush Gem Mine",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Onyx": 2,
      "Sapphire": 1,
      "Diamond": 1
    },
    "bonus": "Emerald",
    "prestigePoints": 0
  },
  {
    "name": "Green Crystal Cave",
    "level": 1,
    "cost": {
      "Sapphire": 1,
      "Diamond": 2
    },
    "bonus": "Emerald",
    "prestigePoints": 0
  },
  {
    "name": "Forest Workshop",
    "level": 1,
    "cost": {
      "Ruby": 2,
      "Onyx": 2,
      "Sapphire": 1
    },
    "bonus": "Emerald",
    "prestigePoints": 0
  },
  {
    "name": "Emerald Vault",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Onyx": 1,
      "Sapphire": 1,
      "Diamond": 1
    },
    "bonus": "Emerald",
    "prestigePoints": 0
  },
  {
    "name": "Verdant Chamber",
    "level": 1,
    "cost": {
      "Onyx": 4
    },
    "bonus": "Emerald",
    "prestigePoints": 1
  },
  {
    "name": "Refined Gem Vault",
    "level": 2,
    "cost": {
      "Ruby": 3,
      "Emerald": 2,
      "Diamond": 3
    },
    "bonus": "Emerald",
    "prestigePoints": 1
  },
  {
    "name": "Emerald Refinery",
    "level": 2,
    "cost": {
      "Onyx": 2,
      "Sapphire": 3,
      "Diamond": 2
    },
    "bonus": "Emerald",
    "prestigePoints": 1
  },
  {
    "name": "Lush Workshop",
    "level": 2,
    "cost": {
      "Emerald": 5
    },
    "bonus": "Emerald",
    "prestigePoints": 2
  },
  {
    "name": "Green Estate",
    "level": 2,
    "cost": {
      "Emerald": 3,
      "Sapphire": 5
    },
    "bonus": "Emerald",
    "prestigePoints": 2
  },
  {
    "name": "Verdant Guild",
    "level": 2,
    "cost": {
      "Onyx": 1,
      "Sapphire": 2,
      "Diamond": 4
    },
    "bonus": "Emerald",
    "prestigePoints": 2
  },
  {
    "name": "Emerald Collection",
    "level": 2,
    "cost": {
      "Emerald": 6
    },
    "bonus": "Emerald",
    "prestigePoints": 3
  },
  {
    "name": "Grand Emerald Vault",
    "level": 3,
    "cost": {
      "Ruby": 3,
      "Onyx": 3,
      "Sapphire": 3,
      "Diamond": 5
    },
    "bonus": "Emerald",
    "prestigePoints": 3
  },
  {
    "name": "Exquisite Emerald Vault",
    "level": 3,
    "cost": {
      "Sapphire": 7
    },
    "bonus": "Emerald",
    "prestigePoints": 4
  },
  {
    "name": "Royal Emerald Chamber",
    "level": 3,
    "cost": {
      "Emerald": 3,
      "Sapphire": 6,
      "Diamond": 3
    },
    "bonus": "Emerald",
    "prestigePoints": 4
  },
  {
    "name": "Master Emerald Atelier",
    "level": 3,
    "cost": {
      "Emerald": 3,
      "Sapphire": 7
    },
    "bonus": "Emerald",
    "prestigePoints": 5
  },
  {
    "name": "Onyx Mine",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Sapphire": 2,
      "Diamond": 2
    },
    "bonus": "Onyx",
    "prestigePoints": 0
  },
  {
    "name": "Onyx Vein",
    "level": 1,
    "cost": {
      "Ruby": 3,
      "Onyx": 1,
      "Emerald": 1
    },
    "bonus": "Onyx",
    "prestigePoints": 0
  },
  {
    "name": "Shadowed Quarry",
    "level": 1,
    "cost": {
      "Emerald": 3
    },
    "bonus": "Onyx",
    "prestigePoints": 0
  },
  {
    "name": "Noir Crystal Mine",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Emerald": 1,
      "Sapphire": 2,
      "Diamond": 1
    },
    "bonus": "Onyx",
    "prestigePoints": 0
  },
  {
    "name": "Dark Gem Cave",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Emerald": 1,
      "Sapphire": 1,
      "Diamond": 1
    },
    "bonus": "Onyx",
    "prestigePoints": 0
  },
  {
    "name": "Obsidian Workshop",
    "level": 1,
    "cost": {
      "Emerald": 2,
      "Diamond": 2
    },
    "bonus": "Onyx",
    "prestigePoints": 0
  },
  {
    "name": "Midnight Vault",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Emerald": 2
    },
    "bonus": "Onyx",
    "prestigePoints": 0
  },
  {
    "name": "Gloomy Chamber",
    "level": 1,
    "cost": {
      "Sapphire": 4
    },
    "bonus": "Onyx",
    "prestigePoints": 1
  },
  {
    "name": "Obsidian Vault",
    "level": 2,
    "cost": {
      "Emerald": 2,
      "Sapphire": 2,
      "Diamond": 3
    },
    "bonus": "Onyx",
    "prestigePoints": 1
  },
  {
    "name": "Onyx Refinery",
    "level": 2,
    "cost": {
      "Onyx": 2,
      "Emerald": 3,
      "Diamond": 3
    },
    "bonus": "Onyx",
    "prestigePoints": 1
  },
  {
    "name": "Dark Refinery",
    "level": 2,
    "cost": {
      "Ruby": 2,
      "Emerald": 4,
      "Sapphire": 1
    },
    "bonus": "Onyx",
    "prestigePoints": 2
  },
  {
    "name": "Noir Estate",
    "level": 2,
    "cost": {
      "Diamond": 5
    },
    "bonus": "Onyx",
    "prestigePoints": 2
  },
  {
    "name": "Obsidian Guild",
    "level": 2,
    "cost": {
      "Ruby": 3,
      "Emerald": 5
    },
    "bonus": "Onyx",
    "prestigePoints": 2
  },
  {
    "name": "Onyx Collection",
    "level": 2,
    "cost": {
      "Onyx": 6
    },
    "bonus": "Onyx",
    "prestigePoints": 3
  },
  {
    "name": "Grand Onyx Vault",
    "level": 3,
    "cost": {
      "Ruby": 3,
      "Emerald": 5,
      "Sapphire": 3,
      "Diamond": 3
    },
    "bonus": "Onyx",
    "prestigePoints": 3
  },
  {
    "name": "Exquisite Onyx Vault",
    "level": 3,
    "cost": {
      "Ruby": 7
    },
    "bonus": "Onyx",
    "prestigePoints": 4
  },
  {
    "name": "Royal Onyx Chamber",
    "level": 3,
    "cost": {
      "Ruby": 6,
      "Onyx": 3,
      "Emerald": 3
    },
    "bonus": "Onyx",
    "prestigePoints": 4
  },
  {
    "name": "Master Onyx Atelier",
    "level": 3,
    "cost": {
      "Ruby": 7,
      "Onyx": 3
    },
    "bonus": "Onyx",
    "prestigePoints": 5
  },
  {
    "name": "Ruby Mine",
    "level": 1,
    "cost": {
      "Onyx": 2,
      "Emerald": 1,
      "Diamond": 2
    },
    "bonus": "Ruby",
    "prestigePoints": 0
  },
  {
    "name": "Ruby Vein",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Onyx": 3,
      "Diamond": 1
    },
    "bonus": "Ruby",
    "prestigePoints": 0
  },
  {
    "name": "Crimson Quarry",
    "level": 1,
    "cost": {
      "Emerald": 1,
      "Sapphire": 2
    },
    "bonus": "Ruby",
    "prestigePoints": 0
  },
  {
    "name": "Scarlet Gem Mine",
    "level": 1,
    "cost": {
      "Ruby": 2,
      "Diamond": 2
    },
    "bonus": "Ruby",
    "prestigePoints": 0
  },
  {
    "name": "Red Crystal Cave",
    "level": 1,
    "cost": {
      "Onyx": 1,
      "Emerald": 1,
      "Sapphire": 1,
      "Diamond": 2
    },
    "bonus": "Ruby",
    "prestigePoints": 0
  },
  {
    "name": "Blazing Workshop",
    "level": 1,
    "cost": {
      "Onyx": 1,
      "Emerald": 1,
      "Sapphire": 1,
      "Diamond": 1
    },
    "bonus": "Ruby",
    "prestigePoints": 0
  },
  {
    "name": "Inferno Vault",
    "level": 1,
    "cost": {
      "Diamond": 3
    },
    "bonus": "Ruby",
    "prestigePoints": 0
  },
  {
    "name": "Fiery Chamber",
    "level": 1,
    "cost": {
      "Diamond": 4
    },
    "bonus": "Ruby",
    "prestigePoints": 1
  },
  {
    "name": "Radiant Vault",
    "level": 2,
    "cost": {
      "Ruby": 2,
      "Onyx": 3,
      "Sapphire": 3
    },
    "bonus": "Ruby",
    "prestigePoints": 1
  },
  {
    "name": "Ruby Refinery",
    "level": 2,
    "cost": {
      "Ruby": 2,
      "Onyx": 3,
      "Diamond": 2
    },
    "bonus": "Ruby",
    "prestigePoints": 1
  },
  {
    "name": "Blazing Refinery",
    "level": 2,
    "cost": {
      "Emerald": 2,
      "Sapphire": 4,
      "Diamond": 1
    },
    "bonus": "Ruby",
    "prestigePoints": 2
  },
  {
    "name": "Crimson Estate",
    "level": 2,
    "cost": {
      "Onyx": 5,
      "Diamond": 3
    },
    "bonus": "Ruby",
    "prestigePoints": 2
  },
  {
    "name": "Ruby Guild",
    "level": 2,
    "cost": {
      "Onyx": 5
    },
    "bonus": "Ruby",
    "prestigePoints": 2
  },
  {
    "name": "Ruby Collection",
    "level": 2,
    "cost": {
      "Ruby": 6
    },
    "bonus": "Ruby",
    "prestigePoints": 3
  },
  {
    "name": "Grand Ruby Vault",
    "level": 3,
    "cost": {
      "Onyx": 3,
      "Emerald": 3,
      "Sapphire": 5,
      "Diamond": 3
    },
    "bonus": "Ruby",
    "prestigePoints": 3
  },
  {
    "name": "Exquisite Ruby Vault",
    "level": 3,
    "cost": {
      "Ruby": 3,
      "Emerald": 6,
      "Sapphire": 3
    },
    "bonus": "Ruby",
    "prestigePoints": 4
  },
  {
    "name": "Royal Ruby Chamber",
    "level": 3,
    "cost": {
      "Emerald": 7
    },
    "bonus": "Ruby",
    "prestigePoints": 4
  },
  {
    "name": "Master Ruby Atelier",
    "level": 3,
    "cost": {
      "Ruby": 3,
      "Emerald": 7
    },
    "bonus": "Ruby",
    "prestigePoints": 5
  },
  {
    "name": "Sapphire Mine",
    "level": 1,
    "cost": {
      "Onyx": 2,
      "Diamond": 1
    },
    "bonus": "Sapphire",
    "prestigePoints": 0
  },
  {
    "name": "Sapphire Vein",
    "level": 1,
    "cost": {
      "Ruby": 2,
      "Onyx": 1,
      "Emerald": 1,
      "Diamond": 1
    },
    "bonus": "Sapphire",
    "prestigePoints": 0
  },
  {
    "name": "Azure Quarry",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Onyx": 1,
      "Emerald": 1,
      "Diamond": 1
    },
    "bonus": "Sapphire",
    "prestigePoints": 0
  },
  {
    "name": "Blue Gem Mine",
    "level": 1,
    "cost": {
      "Ruby": 2,
      "Emerald": 2,
      "Diamond": 1
    },
    "bonus": "Sapphire",
    "prestigePoints": 0
  },
  {
    "name": "Blue Crystal Cave",
    "level": 1,
    "cost": {
      "Ruby": 1,
      "Emerald": 3,
      "Sapphire": 1
    },
    "bonus": "Sapphire",
    "prestigePoints": 0
  },
  {
    "name": "Azure Workshop",
    "level": 1,
    "cost": {
      "Onyx": 2,
      "Emerald": 2
    },
    "bonus": "Sapphire",
    "prestigePoints": 0
  },
  {
    "name": "Luminous Vault",
    "level": 1,
    "cost": {
      "Onyx": 3
    },
    "bonus": "Sapphire",
    "prestigePoints": 0
  },
  {
    "name": "Celestial Chamber",
    "level": 1,
    "cost": {
      "Ruby": 4
    },
    "bonus": "Sapphire",
    "prestigePoints": 1
  },
  {
    "name": "Sapphire Vault",
    "level": 2,
    "cost": {
      "Onyx": 3,
      "Emerald": 3,
      "Sapphire": 2
    },
    "bonus": "Sapphire",
    "prestigePoints": 1
  },
  {
    "name": "Sapphire Refinery",
    "level": 2,
    "cost": {
      "Ruby": 3,
      "Emerald": 2,
      "Sapphire": 2
    },
    "bonus": "Sapphire",
    "prestigePoints": 1
  },
  {
    "name": "Azure Refinery",
    "level": 2,
    "cost": {
      "Sapphire": 3,
      "Diamond": 5
    },
    "bonus": "Sapphire",
    "prestigePoints": 2
  },
  {
    "name": "Blue Estate",
    "level": 2,
    "cost": {
      "Ruby": 1,
      "Onyx": 4,
      "Diamond": 2
    },
    "bonus": "Sapphire",
    "prestigePoints": 2
  },
  {
    "name": "Sapphire Guild",
    "level": 2,
    "cost": {
      "Sapphire": 5
    },
    "bonus": "Sapphire",
    "prestigePoints": 2
  },
  {
    "name": "Sapphire Collection",
    "level": 2,
    "cost": {
      "Sapphire": 6
    },
    "bonus": "Sapphire",
    "prestigePoints": 3
  },
  {
    "name": "Grand Sapphire Vault",
    "level": 3,
    "cost": {
      "Ruby": 3,
      "Onyx": 5,
      "Emerald": 3,
      "Diamond": 3
    },
    "bonus": "Sapphire",
    "prestigePoints": 3
  },
  {
    "name": "Exquisite Sapphire Vault",
    "level": 3,
    "cost": {
      "Onyx": 3,
      "Sapphire": 3,
      "Diamond": 6
    },
    "bonus": "Sapphire",
    "prestigePoints": 4
  },
  {
    "name": "Royal Sapphire Chamber",
    "level": 3,
    "cost": {
      "Diamond": 7
    },
    "bonus": "Sapphire",
    "prestigePoints": 4
  },
  {
    "name": "Master Sapphire Atelier",
    "level": 3,
    "cost": {
      "Sapphire": 3,
      "Diamond": 7
    },
    "bonus": "Sapphire",
    "prestigePoints": 5
  }
];
//NOSONAR_END

export { GEMS, NOBLES, DEVELOPMENT_CARDS };