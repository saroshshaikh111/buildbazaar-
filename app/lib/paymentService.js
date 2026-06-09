// Payment Service - Escrow account details for UPI / Bank Transfer payments
// Update these values with your real escrow/business account details

export function getEscrowDetails() {
    return {
        upiId: 'buildbazaar@ybl',
        accountName: 'BuildBazaar Escrow Account',
        bankName: 'State Bank of India',
        accountNumber: '39201234567890',
        ifscCode: 'SBIN0001234',
        branchName: 'Hubli Main Branch',
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
