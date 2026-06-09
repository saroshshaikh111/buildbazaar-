// GET endpoint that returns escrow account details for UPI / Bank Transfer payments.
import { NextResponse } from 'next/server';
import { getEscrowDetails } from '@/app/lib/paymentService';

export async function GET() {
    const details = getEscrowDetails();
    return NextResponse.json(details);
}
