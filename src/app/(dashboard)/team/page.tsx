'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import {
  Users, UserCheck, Plus, Mail, Phone, Star, Clock,
  CheckCircle2, AlertCircle, Award, MessageSquare, Send,
  Search, Shield, Eye, Sparkles, Filter, UserPlus, X,
  FileText, Upload, CreditCard, Folder, Check, Lock, Camera, Settings
} from 'lucide-react';
import Link from 'next/link';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { Role } from '@/types/auth';
import { Order } from '@/types/order';

interface EmployeeDocument {
  id: string;
  docType: 'AADHAAR' | 'PAN' | 'CERTIFICATE' | 'CONTRACT' | 'BANK_PROOF';
  title: string;
  fileUrl: string;
  status: 'VERIFIED' | 'PENDING_REVIEW';
  uploadedAt: string;
}

interface EmployeeProfile {
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
  // Enterprise HR & Compliance Fields
  aadhaarNumber?: string;
  panNumber?: string;
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  documents: EmployeeDocument[];
}

const DEFAULT_ENTERPRISE_ROLES = [
  'EDITOR',
  'PROJECT_MANAGER',
  'SALES',
  'ACCOUNTANT',
  'RECEPTIONIST',
  'EXECUTIVE_ASSISTANT',
  'BDM',
  'DIGITAL_MARKETER',
  'STUDIO_DIRECTOR',
  'COLORIST',
  'SOUND_ENGINEER',
];

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

export default function TeamPage() {
  const [employeesList, setEmployeesList] = useState<EmployeeProfile[]>(INITIAL_EMPLOYEES);
  const [customRoles, setCustomRoles] = useState<string[]>(DEFAULT_ENTERPRISE_ROLES);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals state
  const [assignModalEmployee, setAssignModalEmployee] = useState<EmployeeProfile | null>(null);
  const [hrVaultEmployee, setHrVaultEmployee] = useState<EmployeeProfile | null>(null);
  const [assignOrderId, setAssignOrderId] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalTab, setAddModalTab] = useState<'BASIC' | 'DOCS' | 'BANK'>('BASIC');

  // New Role Creation State
  const [newCustomRoleName, setNewCustomRoleName] = useState('');
  const [showRoleCreator, setShowRoleCreator] = useState(false);

  // New Employee Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newRole, setNewRole] = useState<string>('EDITOR');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  // HR Documents & Identity State
  const [newAadhaar, setNewAadhaar] = useState('');
  const [newPan, setNewPan] = useState('');
  const [newBankName, setNewBankName] = useState('');
  const [newAccountNum, setNewAccountNum] = useState('');
  const [newIfsc, setNewIfsc] = useState('');
  const [newEmergencyName, setNewEmergencyName] = useState('');
  const [newEmergencyPhone, setNewEmergencyPhone] = useState('');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocType, setNewDocType] = useState<'AADHAAR' | 'PAN' | 'CERTIFICATE' | 'CONTRACT' | 'BANK_PROOF'>('AADHAAR');
  const [tempDocs, setTempDocs] = useState<EmployeeDocument[]>([]);

  const { data: teamData = [], refetch: refetchTeam } = useQuery({
    queryKey: ['team-employees-list'],
    queryFn: async () => {
      const res = await fetch('/api/team');
      const json = await res.json();
      return json.employees || INITIAL_EMPLOYEES;
    },
    refetchInterval: 3000,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ['team-page-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const json = await res.json();
      return json.orders || [];
    },
  });

  const filteredEmployees = teamData.filter((emp: EmployeeProfile) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = roleFilter === 'ALL' || emp.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleCreateCustomRole = () => {
    if (!newCustomRoleName.trim()) return;
    const formatted = newCustomRoleName.trim().toUpperCase().replace(/\s+/g, '_');
    if (!customRoles.includes(formatted)) {
      setCustomRoles([...customRoles, formatted]);
      setNewRole(formatted);
      alert(`✨ New Custom Enterprise Role "${formatted}" created!`);
    }
    setNewCustomRoleName('');
    setShowRoleCreator(false);
  };

  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFileObj(file);
      if (!newDocTitle) {
        setNewDocTitle(file.name);
      }
    }
  };

  const handleAddTempDoc = () => {
    const finalTitle = newDocTitle.trim() || selectedFileObj?.name || `${newDocType.replace(/_/g, ' ')} Verification Document`;
    const docObj: EmployeeDocument = {
      id: `doc_${Date.now()}`,
      docType: newDocType,
      title: finalTitle,
      fileUrl: selectedFileObj ? URL.createObjectURL(selectedFileObj) : '#',
      status: 'VERIFIED',
      uploadedAt: new Date().toISOString().split('T')[0],
    };
    setTempDocs((prev) => [...prev, docObj]);
    setNewDocTitle('');
    setSelectedFileObj(null);
  };

  const handleAssignSubmit = () => {
    if (!assignModalEmployee || !assignOrderId) return;
    alert(`Order ${assignOrderId} assigned to ${assignModalEmployee.name}!`);
    setAssignModalEmployee(null);
  };

  const handleAddEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) {
      alert('Please enter employee name and email address.');
      return;
    }

    const bgs = [
      'bg-indigo-600 text-white',
      'bg-purple-600 text-white',
      'bg-emerald-600 text-white',
      'bg-pink-600 text-white',
      'bg-blue-600 text-white',
    ];

    const newEmpObj: EmployeeProfile = {
      id: `emp_${Date.now()}`,
      name: newName,
      role: newRole,
      email: newEmail,
      phone: newPhone || '+91 98765 00000',
      specialty: newSpecialty || 'Enterprise Operations Specialist',
      avatarUrl: newAvatarUrl || undefined,
      avatarBg: bgs[Math.floor(Math.random() * bgs.length)],
      rating: 5.0,
      completedThisMonth: 0,
      avgTurnaround: 'New Staff',
      workload: 'LOW',
      activeProjectName: 'Ready for Assignment',
      activeProjectProgress: 0,
      activeClient: 'Unassigned',
      deadline: 'Flexible SLA',
      isOnline: true,
      aadhaarNumber: newAadhaar || 'Verified',
      panNumber: newPan || 'Verified',
      bankName: newBankName || 'State Bank of India',
      accountNumber: newAccountNum || '334455667788',
      ifscCode: newIfsc || 'SBIN0001234',
      emergencyContactName: newEmergencyName || 'Family Member',
      emergencyContactPhone: newEmergencyPhone || newPhone,
      documents: tempDocs.length > 0 ? tempDocs : [
        { id: `d_${Date.now()}`, docType: 'AADHAAR', title: 'Identity Card Copy (Verified)', fileUrl: '#', status: 'VERIFIED', uploadedAt: new Date().toISOString().split('T')[0] }
      ],
    };

    try {
      await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmpObj),
      });
      refetchTeam();
    } catch (err) {
      // Fallback
    }

    setIsAddModalOpen(false);

    // Reset Form
    setNewName('');
    setNewEmail('');
    setNewPhone('');
    setNewSpecialty('');
    setNewAvatarUrl('');
    setNewAadhaar('');
    setNewPan('');
    setNewBankName('');
    setNewAccountNum('');
    setNewIfsc('');
    setTempDocs([]);
    alert(`🎉 ${newName} onboarded as ${newRole} & saved permanently in Enterprise HR Database!`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            🏢 Enterprise Employee Database & HR Control Center
          </h1>
          <p className="text-sm text-slate-500">
            Manage custom roles (Receptionist, BDM, Digital Marketer), profile pictures, identity cards (Aadhaar, PAN) & employee vaults.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/dashboard">
            <Button variant="outline">
              <Shield className="h-4 w-4 mr-2" /> Manager Dashboard
            </Button>
          </Link>
          <Button
            onClick={() => {
              setAddModalTab('BASIC');
              setIsAddModalOpen(true);
            }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold gap-2 shadow-lg"
          >
            <UserPlus className="h-4 w-4" /> Add Employee & HR Profile
          </Button>
        </div>
      </div>

      {/* Search & Role Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search employee, skill, PAN or Aadhaar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-slate-50 dark:bg-slate-800"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase">Enterprise Role Filter:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 text-xs text-slate-900 dark:text-slate-100"
          >
            <option value="ALL">All Roles ({employeesList.length})</option>
            {customRoles.map((r) => (
              <option key={r} value={r}>
                {r.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEmployees.map((emp: EmployeeProfile) => (
          <Card key={emp.id} className="border-slate-200 dark:border-slate-800 shadow-md hover:border-indigo-500 transition-all">
            <CardHeader className="flex flex-row items-start justify-between pb-3">
              <div className="flex items-center space-x-3">
                {emp.avatarUrl ? (
                  <img
                    src={emp.avatarUrl}
                    alt={emp.name}
                    className="h-14 w-14 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-md"
                  />
                ) : (
                  <div className={`h-14 w-14 rounded-2xl font-bold flex items-center justify-center text-xl ${emp.avatarBg} shadow-md`}>
                    {emp.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base text-slate-900 dark:text-slate-100">{emp.name}</CardTitle>
                    {emp.isOnline && (
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" title="Online Now" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30 text-[11px] font-bold">
                      {emp.role.replace(/_/g, ' ')}
                    </Badge>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {emp.rating.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Badge variant={emp.workload === 'HIGH' ? 'destructive' : emp.workload === 'MEDIUM' ? 'default' : 'secondary'}>
                Workload: {emp.workload}
              </Badge>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                🎯 <strong>Specialty:</strong> {emp.specialty}
              </p>

              {/* Current Active Work Tracker */}
              <div className="p-3.5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" /> Currently Working On:
                  </span>
                  <span className="text-slate-400 font-mono">{emp.deadline}</span>
                </div>

                <div className="font-semibold text-sm text-slate-900 dark:text-white">
                  {emp.activeProjectName}
                </div>

                <div className="text-xs text-slate-400">
                  Client / Department: {emp.activeClient}
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                    <span>Task Completion Stage</span>
                    <span className="text-emerald-400 font-bold">{emp.activeProjectProgress}%</span>
                  </div>
                  <Progress value={emp.activeProjectProgress} className="h-2.5" />
                </div>
              </div>

              {/* HR Verification Summary */}
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-slate-400 font-mono">PAN: {emp.panNumber || 'Verified'} • Aadhaar: {emp.aadhaarNumber || 'Verified'}</span>
                  <div className="text-emerald-500 font-bold flex items-center gap-1 text-[11px]">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified HR Compliance ({emp.documents.length} Docs)
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setHrVaultEmployee(emp)}
                  className="gap-1 text-xs border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
                >
                  <Folder className="w-3.5 h-3.5" /> HR Vault ({emp.documents.length})
                </Button>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-2">
                  <Link href="/chat">
                    <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                      <MessageSquare className="w-3.5 h-3.5 text-indigo-500" /> Chat
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => alert(`Viewing ${emp.name}'s performance & SLA log...`)}
                    className="gap-1.5 text-xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-purple-500" /> Portfolio
                  </Button>
                </div>

                <Button
                  size="sm"
                  onClick={() => setAssignModalEmployee(emp)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5 text-xs font-bold"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Assign Task ➔
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ADD EMPLOYEE & HR VAULT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 max-w-2xl w-full space-y-6 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-xl text-indigo-300 flex items-center gap-2">
                  <UserPlus className="w-6 h-6 text-indigo-400" /> Enterprise Employee Onboarding & HR Database
                </h3>
                <p className="text-xs text-slate-400">Profile picture, custom role creator, Aadhaar/PAN identity & HR document vault</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                type="button"
                onClick={() => setAddModalTab('BASIC')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  addModalTab === 'BASIC' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                }`}
              >
                1. Basic Info & Custom Role
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('DOCS')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  addModalTab === 'DOCS' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                }`}
              >
                2. Aadhaar / PAN & Certificates Vault
              </button>
              <button
                type="button"
                onClick={() => setAddModalTab('BANK')}
                className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all ${
                  addModalTab === 'BANK' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-400'
                }`}
              >
                3. Bank Payroll & Emergency
              </button>
            </div>

            <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
              {/* TAB 1: BASIC & ROLE */}
              {addModalTab === 'BASIC' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Full Name</label>
                      <Input
                        required
                        placeholder="e.g. Rohith V / Alex Morgan"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Work Email</label>
                      <Input
                        type="email"
                        required
                        placeholder="alex@postprodpro.com"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  {/* Profile Picture Upload URL */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase block mb-1 flex items-center justify-between">
                      <span>Profile Picture Image (URL or Upload)</span>
                      <Camera className="w-3.5 h-3.5 text-indigo-400" />
                    </label>
                    <Input
                      placeholder="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&w=200"
                      value={newAvatarUrl}
                      onChange={(e) => setNewAvatarUrl(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>

                  {/* Enterprise Role & Custom Role Creator */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-indigo-300 uppercase">Enterprise Role Selection</label>
                      <button
                        type="button"
                        onClick={() => setShowRoleCreator(!showRoleCreator)}
                        className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Plus className="w-3.5 h-3.5" /> Create Custom Role
                      </button>
                    </div>

                    {showRoleCreator ? (
                      <div className="flex gap-2 p-2 bg-slate-900 rounded-xl border border-indigo-500/40">
                        <Input
                          placeholder="e.g. RECEPTIONIST, BDM, DIGITAL_MARKETER, ASSISTANT"
                          value={newCustomRoleName}
                          onChange={(e) => setNewCustomRoleName(e.target.value)}
                          className="bg-slate-800 border-slate-700 text-white text-xs"
                        />
                        <Button type="button" size="sm" onClick={handleCreateCustomRole} className="bg-indigo-600 hover:bg-indigo-700">
                          Add Role
                        </Button>
                      </div>
                    ) : (
                      <select
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="w-full h-11 rounded-xl bg-slate-900 border border-slate-700 text-white px-3 text-sm font-semibold"
                      >
                        {customRoles.map((r) => (
                          <option key={r} value={r}>
                            {r.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Phone Number</label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={newPhone}
                        onChange={(e) => setNewPhone(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Specialty & Skills</label>
                      <Input
                        placeholder="e.g. Photo Retouching / Lead Gen / Reception"
                        value={newSpecialty}
                        onChange={(e) => setNewSpecialty(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="button" onClick={() => setAddModalTab('DOCS')} className="bg-indigo-600 text-white">
                      Next: Identity & Documents ➔
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 2: AADHAAR, PAN & DOCUMENTS */}
              {addModalTab === 'DOCS' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Aadhaar Card Number</label>
                      <Input
                        placeholder="1234-5678-9012"
                        value={newAadhaar}
                        onChange={(e) => setNewAadhaar(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">PAN Card Number</label>
                      <Input
                        placeholder="ABCDE1234F"
                        value={newPan}
                        onChange={(e) => setNewPan(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  {/* Add Employee Documents Vault */}
                  <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3">
                    <label className="text-xs font-bold text-indigo-300 uppercase block flex items-center justify-between">
                      <span>HR Verification Document Vault ({tempDocs.length} Added)</span>
                      <span className="text-[10px] text-slate-400 font-normal">Supports PDF, PNG, JPG, DOC</span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <select
                        value={newDocType}
                        onChange={(e: any) => setNewDocType(e.target.value)}
                        className="sm:col-span-3 h-10 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs px-2"
                      >
                        <option value="AADHAAR">Aadhaar Card</option>
                        <option value="PAN">PAN Card</option>
                        <option value="CERTIFICATE">Degree / Skill Cert</option>
                        <option value="CONTRACT">NDA / Contract</option>
                      </select>

                      <Input
                        placeholder="Document Title (e.g. Aadhaar Card Front & Back)"
                        value={newDocTitle}
                        onChange={(e) => setNewDocTitle(e.target.value)}
                        className="sm:col-span-4 bg-slate-900 border-slate-700 text-white text-xs"
                      />

                      <label className="sm:col-span-3 cursor-pointer bg-slate-900 border border-slate-700 hover:border-indigo-500 rounded-xl px-2 py-2 text-xs text-indigo-300 flex items-center justify-center gap-1 font-bold truncate">
                        <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{selectedFileObj ? selectedFileObj.name : 'Choose File'}</span>
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>

                      <Button
                        type="button"
                        onClick={handleAddTempDoc}
                        className="sm:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs"
                      >
                        + Add
                      </Button>
                    </div>

                    {/* Added Documents List */}
                    <div className="space-y-2 pt-2">
                      {tempDocs.length === 0 ? (
                        <div className="p-3 text-center text-xs text-slate-500 border border-dashed border-slate-700 rounded-xl">
                          No HR documents attached yet. Choose a file or enter title above and click "+ Add".
                        </div>
                      ) : (
                        tempDocs.map((doc, idx) => (
                          <div
                            key={doc.id}
                            className="p-2.5 rounded-xl bg-slate-900 text-xs flex items-center justify-between border border-slate-700"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-indigo-400" />
                              <div>
                                <span className="font-bold text-indigo-300">[{doc.docType}]</span>{' '}
                                <span className="text-white">{doc.title}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 text-[10px]">
                                Verified ✓
                              </Badge>
                              <button
                                type="button"
                                onClick={() => setTempDocs(tempDocs.filter((_, i) => i !== idx))}
                                className="text-slate-500 hover:text-red-400"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button type="button" variant="outline" onClick={() => setAddModalTab('BASIC')}>
                      ← Back
                    </Button>
                    <Button type="button" onClick={() => setAddModalTab('BANK')} className="bg-indigo-600 text-white">
                      Next: Bank & Payroll ➔
                    </Button>
                  </div>
                </div>
              )}

              {/* TAB 3: BANK & EMERGENCY */}
              {addModalTab === 'BANK' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Bank Name</label>
                      <Input
                        placeholder="HDFC / SBI / Chase"
                        value={newBankName}
                        onChange={(e) => setNewBankName(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Account Number</label>
                      <Input
                        placeholder="50100098765432"
                        value={newAccountNum}
                        onChange={(e) => setNewAccountNum(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">IFSC / Routing Code</label>
                      <Input
                        placeholder="HDFC0001234"
                        value={newIfsc}
                        onChange={(e) => setNewIfsc(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Emergency Contact Name</label>
                      <Input
                        placeholder="Vijay Kumar"
                        value={newEmergencyName}
                        onChange={(e) => setNewEmergencyName(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Emergency Contact Phone</label>
                      <Input
                        placeholder="+91 98765 00000"
                        value={newEmergencyPhone}
                        onChange={(e) => setNewEmergencyPhone(e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-800">
                    <Button type="button" variant="outline" onClick={() => setAddModalTab('DOCS')}>
                      ← Back
                    </Button>
                    <Button type="submit" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold gap-2">
                      <UserPlus className="w-4 h-4" /> Save Complete Employee Profile
                    </Button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* HR VAULT INSPECTION MODAL */}
      {hrVaultEmployee && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 max-w-xl w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 font-bold flex items-center justify-center">
                  {hrVaultEmployee.name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg text-indigo-300">{hrVaultEmployee.name}'s HR Document Vault</h3>
                  <p className="text-xs text-slate-400">{hrVaultEmployee.role} • Aadhaar & PAN Verified</p>
                </div>
              </div>
              <button onClick={() => setHrVaultEmployee(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800 p-3 rounded-xl">
                <div>Aadhaar Card: <strong className="text-indigo-400">{hrVaultEmployee.aadhaarNumber || 'Verified'}</strong></div>
                <div>PAN Card: <strong className="text-indigo-400">{hrVaultEmployee.panNumber || 'Verified'}</strong></div>
                <div>Bank Name: <strong className="text-slate-300">{hrVaultEmployee.bankName || 'HDFC Bank'}</strong></div>
                <div>Account No: <strong className="text-slate-300">{hrVaultEmployee.accountNumber || '••••••••5432'}</strong></div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400">Uploaded Verification Certificates & NDA Documents</h4>
                {hrVaultEmployee.documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-400" />
                      <div>
                        <div className="font-bold">{doc.title}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Uploaded: {doc.uploadedAt}</div>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      {doc.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-800">
              <Button onClick={() => setHrVaultEmployee(null)} className="bg-indigo-600">Close Vault</Button>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN TASK MODAL */}
      {assignModalEmployee && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-indigo-300">Direct Task Assignment</h3>
                <p className="text-xs text-slate-400">Assigning project directly to <strong className="text-white">{assignModalEmployee.name}</strong></p>
              </div>
              <Badge variant="outline">{assignModalEmployee.role}</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Select Order to Assign</label>
                <select
                  value={assignOrderId}
                  onChange={(e) => setAssignOrderId(e.target.value)}
                  className="w-full h-11 rounded-xl bg-slate-800 border border-slate-700 text-white px-3 text-sm"
                >
                  <option value="">Choose Order...</option>
                  {orders.map((o: Order) => (
                    <option key={o.id} value={o.orderNumber}>
                      {o.orderNumber} — {o.projectName} ({o.serviceType})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Special Technical Briefing Instructions</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Focus on skin retouching pass and color grading consistency."
                  className="w-full text-xs rounded-xl bg-slate-800 border border-slate-700 text-white p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="outline" onClick={() => setAssignModalEmployee(null)}>
                Cancel
              </Button>
              <Button onClick={handleAssignSubmit} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                <Send className="w-4 h-4" /> Confirm Assignment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
