// Global store for CEO settings including official Payment QR Code & Bank UPI details

export interface SettingsState {
  upiId: string;
  payeeName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  qrCodeUrl: string;
  updatedAt: string;
  updatedBy: string;
}

const defaultSettings: SettingsState = {
  upiId: 'postprodpro@okicici',
  payeeName: 'Antigravity PostProd Pro Studio',
  bankName: 'HDFC Bank',
  accountNumber: '50200088991122',
  ifscCode: 'HDFC0001234',
  // Default clean payment QR SVG Data URI
  qrCodeUrl: '',
  updatedAt: new Date().toISOString(),
  updatedBy: 'CEO Admin',
};

const globalRef = global as unknown as { __ceoSettingsStore?: SettingsState };
if (!globalRef.__ceoSettingsStore) {
  globalRef.__ceoSettingsStore = { ...defaultSettings };
}

export function getCeoSettings(): SettingsState {
  return globalRef.__ceoSettingsStore || defaultSettings;
}

export function updateCeoSettings(newSettings: Partial<SettingsState>): SettingsState {
  if (!globalRef.__ceoSettingsStore) {
    globalRef.__ceoSettingsStore = { ...defaultSettings };
  }
  globalRef.__ceoSettingsStore = {
    ...globalRef.__ceoSettingsStore,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  };
  return globalRef.__ceoSettingsStore;
}
