// Persistent Team & HR Employees Store

export interface EmployeeDocument {
  id: string;
  docType: 'AADHAAR' | 'PAN' | 'CERTIFICATE' | 'CONTRACT' | 'BANK_PROOF';
  title: string;
  fileUrl: string;
  status: 'VERIFIED' | 'PENDING_REVIEW';
  uploadedAt: string;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  specialty: string;
  avatarUrl?: string;
  avatarBg: string;
  rating: number;
  completedThisMonth: number;
  avgTurnaround: string;
  workload: 'LOW' | 'MEDIUM' | 'HIGH';
  activeProjectName: string;
  activeProjectProgress: number;
  activeClient: string;
  deadline: string;
  isOnline: boolean;
  aadhaarNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  documents: EmployeeDocument[];
}

const INITIAL_EMPLOYEES: EmployeeProfile[] = [
  {
    id: 'emp-1',
    name: 'Rohith V',
    role: 'STUDIO_DIRECTOR',
    email: 'rohith@postprodpro.com',
    phone: '+91 98765 43210',
    specialty: 'Creative Operations & Executive Supervision',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    avatarBg: 'bg-gradient-to-tr from-amber-600 to-indigo-600 text-white',
    rating: 5.0,
    completedThisMonth: 140,
    avgTurnaround: '1.0 hr SLA',
    workload: 'MEDIUM',
    activeProjectName: 'Enterprise Post-Production Supervision',
    activeProjectProgress: 95,
    activeClient: 'HQ Studio Operations',
    deadline: 'Ongoing Executive SLA',
    isOnline: true,
    aadhaarNumber: 'XXXX-XXXX-8912',
    panNumber: 'ABCDE1234F',
    bankName: 'HDFC Bank',
    accountNumber: '50100098765432',
    ifscCode: 'HDFC0001234',
    emergencyContactName: 'Vijay Kumar',
    emergencyContactPhone: '+91 98765 00000',
    documents: [
      { id: 'd1', docType: 'AADHAAR', title: 'Aadhaar Card Copy (Verified)', fileUrl: '#', status: 'VERIFIED', uploadedAt: '2026-01-10' },
      { id: 'd2', docType: 'PAN', title: 'PAN Card Verification', fileUrl: '#', status: 'VERIFIED', uploadedAt: '2026-01-10' },
      { id: 'd3', docType: 'CERTIFICATE', title: 'Master Degree in Digital Media Production', fileUrl: '#', status: 'VERIFIED', uploadedAt: '2026-01-12' },
    ],
  },
  {
    id: 'emp-2',
    name: 'Mike Chen',
    role: 'EDITOR',
    email: 'mike@postprodpro.com',
    phone: '+1 (555) 019-2833',
    specialty: 'High-End Photo Retouching & Beauty Skin Pass',
    avatarBg: 'bg-indigo-600 text-white',
    rating: 4.95,
    completedThisMonth: 48,
    avgTurnaround: '11.4 hrs',
    workload: 'MEDIUM',
    activeProjectName: 'Summer Fashion Catalog 2024',
    activeProjectProgress: 65,
    activeClient: 'Bob Martinez (Martinez Media)',
    deadline: 'Tomorrow 5:00 PM',
    isOnline: true,
    aadhaarNumber: 'XXXX-XXXX-4532',
    panNumber: 'FGHIJ5678K',
    bankName: 'Chase Bank',
    accountNumber: '112233445566',
    ifscCode: 'CHAS00912',
    documents: [
      { id: 'd4', docType: 'AADHAAR', title: 'National Identity / Aadhaar Copy', fileUrl: '#', status: 'VERIFIED', uploadedAt: '2026-02-01' },
      { id: 'd5', docType: 'CERTIFICATE', title: 'Adobe Certified Expert (Photoshop & Lightroom)', fileUrl: '#', status: 'VERIFIED', uploadedAt: '2026-02-01' },
    ],
  },
  {
    id: 'emp-3',
    name: 'Lisa Wong',
    role: 'COLORIST',
    email: 'lisa@postprodpro.com',
    phone: '+1 (555) 019-2834',
    specialty: 'Cinematic Video Color Grading & DaVinci Resolve',
    avatarBg: 'bg-purple-600 text-white',
    rating: 4.88,
    completedThisMonth: 38,
    avgTurnaround: '14.2 hrs',
    workload: 'HIGH',
    activeProjectName: 'Smith Wedding Highlight Film',
    activeProjectProgress: 80,
    activeClient: 'Bob Martinez (Martinez Media)',
    deadline: 'Today 9:00 PM',
    isOnline: true,
    documents: [
      { id: 'd6', docType: 'CONTRACT', title: 'Employment NDA & Service Contract', fileUrl: '#', status: 'VERIFIED', uploadedAt: '2026-02-15' },
    ],
  },
  {
    id: 'emp-4',
    name: 'Priya Sharma',
    role: 'DIGITAL_MARKETER',
    email: 'priya@postprodpro.com',
    phone: '+91 99887 76655',
    specialty: 'Social Media Campaigns, SEO & Lead Gen',
    avatarBg: 'bg-pink-600 text-white',
    rating: 4.94,
    completedThisMonth: 75,
    avgTurnaround: 'Campaign SLA',
    workload: 'MEDIUM',
    activeProjectName: 'Global Video Retouching SEO Campaign',
    activeProjectProgress: 50,
    activeClient: 'Internal Marketing',
    deadline: 'Aug 10, 2026',
    isOnline: true,
    documents: [
      { id: 'd7', docType: 'CERTIFICATE', title: 'Google Certified Digital Marketing Expert', fileUrl: '#', status: 'VERIFIED', uploadedAt: '2026-03-01' },
    ],
  },
  {
    id: 'emp-5',
    name: 'Anand Kumar',
    role: 'BDM',
    email: 'anand@postprodpro.com',
    phone: '+91 98123 45678',
    specialty: 'Enterprise B2B Client Acquisition & Studio Deals',
    avatarBg: 'bg-blue-600 text-white',
    rating: 4.9,
    completedThisMonth: 90,
    avgTurnaround: 'Same-day Pitch',
    workload: 'LOW',
    activeProjectName: 'Closing Enterprise Agency Contract',
    activeProjectProgress: 85,
    activeClient: 'Apex Global Media',
    deadline: 'In 2 Days',
    isOnline: true,
    documents: [],
  },
];

const globalRef = global as unknown as { __sharedTeamStore?: EmployeeProfile[] };
if (!globalRef.__sharedTeamStore) {
  globalRef.__sharedTeamStore = [...INITIAL_EMPLOYEES];
}

export function getSharedTeam(): EmployeeProfile[] {
  return globalRef.__sharedTeamStore || INITIAL_EMPLOYEES;
}

export function addSharedTeamMember(newMember: EmployeeProfile): EmployeeProfile {
  if (!globalRef.__sharedTeamStore) {
    globalRef.__sharedTeamStore = [...INITIAL_EMPLOYEES];
  }
  globalRef.__sharedTeamStore.unshift(newMember);
  return newMember;
}
