// Mock weapon data for development/testing
export const MOCK_WEAPONS = [
  {
    uuid: '1',
    displayName: 'Vandal',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%23FF4655" width="200" height="100"/%3E%3Ctext x="100" y="60" text-anchor="middle" fill="white" font-size="24" font-weight="bold"%3EVandal%3C/text%3E%3C/svg%3E',
    category: 'EEquippableCategory::Rifle',
    description: 'A reliable, fully automatic assault rifle that excels at mid-range combat.',
    weaponStats: {
      damage: 39,
      range: 50,
      fireRate: 9.75,
      magazineSize: 25,
    },
    shopData: {
      cost: 2900,
    },
  },
  {
    uuid: '2',
    displayName: 'Phantom',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%23FFF500" width="200" height="100"/%3E%3Ctext x="100" y="60" text-anchor="middle" fill="%230F1419" font-size="24" font-weight="bold"%3EPhantom%3C/text%3E%3C/svg%3E',
    category: 'EEquippableCategory::Rifle',
    description: 'A silenced rifle with improved accuracy and fire rate.',
    weaponStats: {
      damage: 39,
      range: 50,
      fireRate: 11,
      magazineSize: 30,
    },
    shopData: {
      cost: 2900,
    },
  },
  {
    uuid: '3',
    displayName: 'Operator',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%239D84B7" width="200" height="100"/%3E%3Ctext x="100" y="60" text-anchor="middle" fill="white" font-size="20" font-weight="bold"%3EOperator%3C/text%3E%3C/svg%3E',
    category: 'EEquippableCategory::Sniper',
    description: 'The ultimate long-range weapon with one-shot potential.',
    weaponStats: {
      damage: 150,
      range: 100,
      fireRate: 0.6,
      magazineSize: 5,
    },
    shopData: {
      cost: 4700,
    },
  },
  {
    uuid: '4',
    displayName: 'Spectre',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%2344AF69" width="200" height="100"/%3E%3Ctext x="100" y="60" text-anchor="middle" fill="white" font-size="20" font-weight="bold"%3ESpectre%3C/text%3E%3C/svg%3E',
    category: 'EEquippableCategory::SMG',
    description: 'A rapid-fire submachine gun perfect for close quarters.',
    weaponStats: {
      damage: 22,
      range: 30,
      fireRate: 13.33,
      magazineSize: 30,
    },
    shopData: {
      cost: 1600,
    },
  },
  {
    uuid: '5',
    displayName: 'Classic',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%23C1121F" width="200" height="100"/%3E%3Ctext x="100" y="60" text-anchor="middle" fill="white" font-size="20" font-weight="bold"%3EClassic%3C/text%3E%3C/svg%3E',
    category: 'EEquippableCategory::Pistol',
    description: 'A semi-automatic pistol that starts every round.',
    weaponStats: {
      damage: 40,
      range: 50,
      fireRate: 6.75,
      magazineSize: 12,
    },
    shopData: {
      cost: 0,
    },
  },
  {
    uuid: '6',
    displayName: 'Judge',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100"%3E%3Crect fill="%23FF8C00" width="200" height="100"/%3E%3Ctext x="100" y="60" text-anchor="middle" fill="white" font-size="24" font-weight="bold"%3EJudge%3C/text%3E%3C/svg%3E',
    category: 'EEquippableCategory::Shotgun',
    description: 'A powerful close-range shotgun.',
    weaponStats: {
      damage: 18,
      range: 12,
      fireRate: 3.3,
      magazineSize: 7,
    },
    shopData: {
      cost: 1850,
    },
  },
];

export const MOCK_SKINS = [
  {
    uuid: 's1',
    displayName: 'Vandal | Valorant',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"%3E%3Crect fill="%231A1F2E" width="200" height="150"/%3E%3Ccircle cx="100" cy="75" r="40" fill="%23FF4655"/%3E%3Ctext x="100" y="85" text-anchor="middle" fill="white" font-size="12"%3ESkin 1%3C/text%3E%3C/svg%3E',
    contentTierUuid: 'standard',
    chromas: [{ fullRender: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"%3E%3Crect fill="%231A1F2E" width="200" height="150"/%3E%3C/svg%3E' }],
  },
  {
    uuid: 's2',
    displayName: 'Phantom | Elderflame',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"%3E%3Crect fill="%231A1F2E" width="200" height="150"/%3E%3Ccircle cx="100" cy="75" r="40" fill="%23FF8C00"/%3E%3Ctext x="100" y="85" text-anchor="middle" fill="white" font-size="12"%3ESkin 2%3C/text%3E%3C/svg%3E',
    contentTierUuid: 'premium',
    chromas: [{ fullRender: 'data:image/svg+xml' }, { fullRender: 'data:image/svg+xml' }],
  },
  {
    uuid: 's3',
    displayName: 'Operator | Dragon',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"%3E%3Crect fill="%231A1F2E" width="200" height="150"/%3E%3Ccircle cx="100" cy="75" r="40" fill="%239D84B7"/%3E%3Ctext x="100" y="85" text-anchor="middle" fill="white" font-size="12"%3ESkin 3%3C/text%3E%3C/svg%3E',
    contentTierUuid: 'premium',
    chromas: [{ fullRender: 'data:image/svg+xml' }],
  },
  {
    uuid: 's4',
    displayName: 'Vandal | Reaver',
    displayIcon: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 150"%3E%3Crect fill="%231A1F2E" width="200" height="150"/%3E%3Ccircle cx="100" cy="75" r="40" fill="%23C1121F"/%3E%3Ctext x="100" y="85" text-anchor="middle" fill="white" font-size="12"%3ESkin 4%3C/text%3E%3C/svg%3E',
    contentTierUuid: 'premium',
    chromas: [{ fullRender: 'data:image/svg+xml' }],
  },
];
