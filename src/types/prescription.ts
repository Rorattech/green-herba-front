export type PrescriptionStatus = 'pending' | 'approved' | 'rejected';

export interface Prescription {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string; // mock: data URL or placeholder
  status: PrescriptionStatus;
  submittedAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}
