document.addEventListener('DOMContentLoaded', function() {
    const transferForm = document.getElementById('transferForm');
    const transferTypeRadios = document.querySelectorAll('input[name="transferType"]');
    const ifscCodeGroup = document.getElementById('ifscCodeGroup');
    const ifscCode = document.getElementById('ifscCode');
    const purposeSelect = document.getElementById('purpose');
    const otherPurposeGroup = document.getElementById('otherPurposeGroup');
    const otherPurposeInput = document.getElementById('otherPurpose');

    // Toggle IFSC code field
    transferTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'other') {
                ifscCodeGroup.style.display = 'block';
                ifscCode.setAttribute('required', '');
            } else {
                ifscCodeGroup.style.display = 'none';
                ifscCode.removeAttribute('required');
            }
        });
    });

    // Handle purpose selection
    purposeSelect.addEventListener('change', function() {
        if (this.value === 'other') {
            otherPurposeGroup.style.display = 'block';
            otherPurposeInput.setAttribute('required', '');
        } else {
            otherPurposeGroup.style.display = 'none';
            otherPurposeInput.removeAttribute('required');
            otherPurposeInput.value = '';
        }
    });

    // Form submission
    transferForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const accountNumber = document.getElementById('accountNumber').value;
        const confirmAccountNumber = document.getElementById('confirmAccountNumber').value;

        if (accountNumber !== confirmAccountNumber) {
            alert('Account numbers do not match!');
            return;
        }

        alert('Transfer initiated successfully!');
        this.reset();
    });
});