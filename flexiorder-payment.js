// ═══════════════════════════════════════
// PAYMENT FUNCTIONALITY FOR FLEXIORDER
// ═══════════════════════════════════════

// Payment Method Toggle
function togglePaymentFields(){
  const method = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'cash';
  const mmFields = document.getElementById('mobileMoneyFields');
  const visaFields = document.getElementById('visaFields');
  
  if(mmFields) mmFields.style.display = method === 'mobile_money' ? 'block' : 'none';
  if(visaFields) visaFields.style.display = method === 'visa' ? 'block' : 'none';
}

// Process Payment
async function processPayment(total, method, paymentDetails){
  // Placeholder for Relworx API integration
  // When you provide the Relworx API credentials, this function will be updated
  // to integrate with their payment gateway
  
  if(method === 'cash'){
    return { success: true, transaction_id: 'CASH-' + Date.now() };
  }
  
  if(method === 'mobile_money'){
    // Simulate mobile money payment processing
    // Replace with actual Relworx API call when credentials are provided
    return { 
      success: true, 
      transaction_id: 'MM-' + Date.now(),
      phone: paymentDetails.mmNumber 
    };
  }
  
  if(method === 'visa'){
    // Simulate Visa card payment processing
    // Replace with actual Relworx API call when credentials are provided
    return { 
      success: true, 
      transaction_id: 'VISA-' + Date.now(),
      card_last4: paymentDetails.cardNumber ? paymentDetails.cardNumber.slice(-4) : '****'
    };
  }
  
  return { success: false, error: 'Invalid payment method' };
}

// Validate Payment Details
function validatePaymentDetails(method){
  if(method === 'mobile_money'){
    const mmNumber = document.getElementById('mmNumber').value.trim();
    if(!mmNumber || mmNumber.length < 10){
      return { valid: false, message: 'Please enter a valid mobile money number' };
    }
    return { valid: true };
  }
  
  if(method === 'visa'){
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const cardExpiry = document.getElementById('cardExpiry').value.trim();
    const cardCvv = document.getElementById('cardCvv').value.trim();
    
    if(!cardNumber || cardNumber.length < 16){
      return { valid: false, message: 'Please enter a valid card number' };
    }
    if(!cardExpiry || cardExpiry.length < 5){
      return { valid: false, message: 'Please enter a valid expiry date' };
    }
    if(!cardCvv || cardCvv.length < 3){
      return { valid: false, message: 'Please enter a valid CVV' };
    }
    return { valid: true };
  }
  
  return { valid: true }; // Cash doesn't require validation
}
