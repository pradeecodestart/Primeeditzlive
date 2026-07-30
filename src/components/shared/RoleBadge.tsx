import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Role } from '@/types/auth';

export const RoleBadge: React.FC<{ role: Role }> = ({ role }) => {
  const getVariant = () => {
    switch (role) {
      case 'CEO':
        return 'destructive';
      case 'PROJECT_MANAGER':
        return 'secondary';
      case 'EDITOR':
        return 'default';
      case 'ACCOUNTANT':
        return 'warning';
      case 'SALES':
        return 'success';
      case 'CLIENT':
      default:
        return 'outline';
    }
  };

  return <Badge variant={getVariant()}>{role.replace('_', ' ')}</Badge>;
};
