// Payment Service - Escrow account details for UPI / Bank Transfer payments
// Update these values with your real escrow/business account details

export function getEscrowDetails() {
    return {
        upiId: process.env.ESCROW_UPI_ID || '8867855362@ybl',
        accountName: process.env.ESCROW_ACCOUNT_NAME || 'Sarosh Aasim Shaikh',
        bankName: process.env.ESCROW_BANK_NAME || 'HSBC Bank',
        accountNumber: process.env.ESCROW_ACCOUNT_NUMBER || '106246788006',
        ifscCode: process.env.ESCROW_IFSC_CODE || 'HSBC0411002',
        branchName: process.env.ESCROW_BRANCH_NAME || 'Main Branch',
        platformFeePercent: 3,
        note: 'Please use your Order ID as the payment reference/narration.'
    };
}

export function calculatePlatformFee(totalAmount) {
    const feePercent = 3;
    const platformFee = Math.round(totalAmount * (feePercent / 100));
    const vendorPayout = totalAmount - platformFee;
    return { platformFee, vendorPayout, feePercent };
}
