// ═══════════════════════════════════════════════════════════════
// FLEXIORDER MANAGEMENT FEATURES
// Stock Management, Venue/Menu Editing, Monthly Payment Limitations
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// STOCK MANAGEMENT
// ═══════════════════════════════════════════════════════════════

// Initialize stock management
function initStockManagement() {
  const stockCard = document.getElementById('stockManagementCard');
  if (!stockCard) return;

  // Load menu items into selector
  loadMenuItemsForStock();

  // Show stock card for management role
  if (currentUserRole === 'management') {
    stockCard.style.display = 'block';
  }
}

// Load menu items for stock management
function loadMenuItemsForStock() {
  const select = document.getElementById('stockItemSelect');
  if (!select) return;

  // Clear existing options
  select.innerHTML = '<option value="">-- Select Item --</option>';

  // Get menu items from config
  const APP_CONFIG = window.FLEXIORDER_CONFIG || {};
  const menuItems = APP_CONFIG.MENU_ITEMS || [];

  // Add menu items to selector
  menuItems.forEach(item => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = `${item.name} (${item.category})`;
    select.appendChild(option);
  });

  // Load existing stock levels
  loadStockLevels();
}

// Load stock levels for selected item
function loadStockLevels() {
  const select = document.getElementById('stockItemSelect');
  const currentStockInput = document.getElementById('currentStock');
  const newStockInput = document.getElementById('newStock');
  const reorderLevelInput = document.getElementById('reorderLevel');

  if (!select || !currentStockInput) return;

  const itemId = select.value;
  if (!itemId) {
    currentStockInput.value = '';
    newStockInput.value = '';
    reorderLevelInput.value = '';
    return;
  }

  // Load stock data from localStorage
  const stockData = JSON.parse(localStorage.getItem('flexiorder_stock') || '{}');
  const itemStock = stockData[itemId] || { stock: 0, reorderLevel: 5 };

  currentStockInput.value = itemStock.stock;
  newStockInput.value = itemStock.stock; // Default to current
  reorderLevelInput.value = itemStock.reorderLevel;
}

// Update stock for selected item
function updateStock() {
  const select = document.getElementById('stockItemSelect');
  const currentStockInput = document.getElementById('currentStock');
  const newStockInput = document.getElementById('newStock');
  const reorderLevelInput = document.getElementById('reorderLevel');
  const stockMsg = document.getElementById('stockMsg');

  if (!select || !stockMsg) return;

  const itemId = select.value;
  if (!itemId) {
    showStockMessage('Please select a menu item', 'error');
    return;
  }

  const newStock = parseInt(newStockInput.value);
  const reorderLevel = parseInt(reorderLevelInput.value);

  if (isNaN(newStock) || newStock < 0) {
    showStockMessage('Please enter a valid stock quantity', 'error');
    return;
  }

  if (isNaN(reorderLevel) || reorderLevel < 0) {
    showStockMessage('Please enter a valid reorder level', 'error');
    return;
  }

  // Load existing stock data
  const stockData = JSON.parse(localStorage.getItem('flexiorder_stock') || '{}');

  // Update stock for item
  stockData[itemId] = {
    stock: newStock,
    reorderLevel: reorderLevel,
    lastUpdated: new Date().toISOString()
  };

  // Save to localStorage
  localStorage.setItem('flexiorder_stock', JSON.stringify(stockData));

  // Update display
  currentStockInput.value = newStock;

  // Check if below reorder level
  if (newStock <= reorderLevel) {
    showStockMessage(`Stock updated! ⚠️ Low stock alert: ${newStock} items (reorder at ${reorderLevel})`, 'warning');
  } else {
    showStockMessage('Stock updated successfully!', 'success');
  }
}

// Show stock management message
function showStockMessage(message, type) {
  const stockMsg = document.getElementById('stockMsg');
  if (!stockMsg) return;

  stockMsg.textContent = message;
  stockMsg.className = 'sf-msg ' + type;

  // Clear message after 3 seconds
  setTimeout(() => {
    stockMsg.textContent = '';
    stockMsg.className = 'sf-msg';
  }, 3000);
}

// Get stock level for an item
function getStockLevel(itemId) {
  const stockData = JSON.parse(localStorage.getItem('flexiorder_stock') || '{}');
  const itemStock = stockData[itemId] || { stock: 999 }; // Default to unlimited if not set
  return itemStock.stock;
}

// Check if item is in stock
function isInStock(itemId) {
  const stockLevel = getStockLevel(itemId);
  return stockLevel > 0;
}

// ═══════════════════════════════════════════════════════════════
// VENUE & MENU EDITING
// ═══════════════════════════════════════════════════════════════

// Initialize venue editing
function initVenueEditing() {
  const venueCard = document.getElementById('venueManagementCard');
  if (!venueCard) return;

  // Load current venue data
  loadVenueData();

  // Show venue card for management role
  if (currentUserRole === 'management') {
    venueCard.style.display = 'block';
  }
}

// Load venue data
function loadVenueData() {
  const venueNameInput = document.getElementById('venueNameInput');
  const venueLocationInput = document.getElementById('venueLocationInput');

  if (!venueNameInput || !venueLocationInput) return;

  // Load from localStorage
  const venueData = JSON.parse(localStorage.getItem('flexiorder_venue') || '{}');

  venueNameInput.value = venueData.name || 'FlexiOrder Lounge';
  venueLocationInput.value = venueData.location || 'Makindye, Kampala';
}

// Save venue data
function saveVenueData() {
  const venueNameInput = document.getElementById('venueNameInput');
  const venueLocationInput = document.getElementById('venueLocationInput');
  const venueMsg = document.getElementById('venueMsg');

  if (!venueNameInput || !venueLocationInput || !venueMsg) return;

  const venueData = {
    name: venueNameInput.value.trim(),
    location: venueLocationInput.value.trim(),
    lastUpdated: new Date().toISOString()
  };

  if (!venueData.name || !venueData.location) {
    showVenueMessage('Please fill in all fields', 'error');
    return;
  }

  // Save to localStorage
  localStorage.setItem('flexiorder_venue', JSON.stringify(venueData));

  showVenueMessage('Venue information saved successfully!', 'success');
}

// Show venue editing message
function showVenueMessage(message, type) {
  const venueMsg = document.getElementById('venueMsg');
  if (!venueMsg) return;

  venueMsg.textContent = message;
  venueMsg.className = 'sf-msg ' + type;

  setTimeout(() => {
    venueMsg.textContent = '';
    venueMsg.className = 'sf-msg';
  }, 3000);
}

// Get venue name
function getVenueName() {
  const venueData = JSON.parse(localStorage.getItem('flexiorder_venue') || '{}');
  return venueData.name || 'FlexiOrder Lounge';
}

// ═══════════════════════════════════════════════════════════════
// MENU ITEM EDITING
// ═══════════════════════════════════════════════════════════════

// Initialize menu editing
function initMenuEditing() {
  const menuCard = document.getElementById('menuManagementCard');
  if (!menuCard) return;

  // Load menu items
  loadMenuItemsForEditing();

  // Show menu card for management role
  if (currentUserRole === 'management') {
    menuCard.style.display = 'block';
  }
}

// Load menu items for editing
function loadMenuItemsForEditing() {
  const menuList = document.getElementById('menuItemsList');
  if (!menuList) return;

  const APP_CONFIG = window.FLEXIORDER_CONFIG || {};
  const menuItems = APP_CONFIG.MENU_ITEMS || [];

  // Clear list
  menuList.innerHTML = '';

  // Add each menu item
  menuItems.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'menu-item-row';
    itemDiv.innerHTML = `
      <div class="menu-item-info">
        <span class="menu-item-name">${item.name}</span>
        <span class="menu-item-category">${item.category}</span>
      </div>
      <div class="menu-item-price">UGX ${item.price.toLocaleString()}</div>
      <button class="menu-edit-btn" onclick="editMenuItem('${item.id}')">Edit</button>
    `;
    menuList.appendChild(itemDiv);
  });
}

// Edit menu item (placeholder for full implementation)
function editMenuItem(itemId) {
  alert('Menu item editing coming soon! Item ID: ' + itemId);
  // Full implementation would open a modal with item details for editing
}

// ═══════════════════════════════════════════════════════════════
// MONTHLY PAYMENT LIMITATIONS
// ═══════════════════════════════════════════════════════════════

// Initialize payment limitations
function initPaymentLimitations() {
  const paymentLimitCard = document.getElementById('paymentLimitationCard');
  if (!paymentLimitCard) return;

  // Load current settings
  loadPaymentLimitSettings();

  // Show payment limit card for management role
  if (currentUserRole === 'management') {
    paymentLimitCard.style.display = 'block';
  }

  // Check monthly limits for users
  checkMonthlyLimits();
}

// Load payment limit settings
function loadPaymentLimitSettings() {
  const limitEnabledInput = document.getElementById('limitEnabled');
  const monthlyLimitInput = document.getElementById('monthlyLimit');
  const limitResetDayInput = document.getElementById('limitResetDay');

  if (!limitEnabledInput || !monthlyLimitInput || !limitResetDayInput) return;

  const settings = JSON.parse(localStorage.getItem('flexiorder_payment_limits') || '{}');

  limitEnabledInput.checked = settings.enabled || false;
  monthlyLimitInput.value = settings.monthlyLimit || 5000000; // Default 5M UGX
  limitResetDayInput.value = settings.resetDay || 1; // Reset on 1st of month
}

// Save payment limit settings
function savePaymentLimitSettings() {
  const limitEnabledInput = document.getElementById('limitEnabled');
  const monthlyLimitInput = document.getElementById('monthlyLimit');
  const limitResetDayInput = document.getElementById('limitResetDay');
  const paymentMsg = document.getElementById('paymentLimitMsg');

  if (!limitEnabledInput || !monthlyLimitInput || !limitResetDayInput || !paymentMsg) return;

  const settings = {
    enabled: limitEnabledInput.checked,
    monthlyLimit: parseInt(monthlyLimitInput.value) || 5000000,
    resetDay: parseInt(limitResetDayInput.value) || 1,
    lastUpdated: new Date().toISOString()
  };

  // Save to localStorage
  localStorage.setItem('flexiorder_payment_limits', JSON.stringify(settings));

  showPaymentLimitMessage('Payment limit settings saved successfully!', 'success');
}

// Check if payment limitations apply
function checkPaymentLimitations() {
  const settings = JSON.parse(localStorage.getItem('flexiorder_payment_limits') || '{}');

  // Only for stock management features (not regular orders)
  return settings.enabled || false;
}

// Check monthly limits for stock management
function checkMonthlyLimits() {
  const settings = JSON.parse(localStorage.getItem('flexiorder_payment_limits') || '{}');

  if (!settings.enabled) {
    return true; // No limits
  }

  // Check if current month limit reached (simplified)
  const monthlyUsage = JSON.parse(localStorage.getItem('flexiorder_monthly_usage') || '{}');
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const key = `${currentYear}-${currentMonth}`;

  const usage = monthlyUsage[key] || 0;

  if (usage >= settings.monthlyLimit) {
    console.warn('Monthly payment limit reached');
    return false;
  }

  return true;
}

// Record payment usage
function recordPaymentUsage(amount) {
  const settings = JSON.parse(localStorage.getItem('flexiorder_payment_limits') || '{}');

  if (!settings.enabled) {
    return;
  }

  const monthlyUsage = JSON.parse(localStorage.getItem('flexiorder_monthly_usage') || '{}');
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const key = `${currentYear}-${currentMonth}`;

  monthlyUsage[key] = (monthlyUsage[key] || 0) + amount;
  localStorage.setItem('flexiorder_monthly_usage', JSON.stringify(monthlyUsage));
}

// Show payment limit message
function showPaymentLimitMessage(message, type) {
  const paymentMsg = document.getElementById('paymentLimitMsg');
  if (!paymentMsg) return;

  paymentMsg.textContent = message;
  paymentMsg.className = 'sf-msg ' + type;

  setTimeout(() => {
    paymentMsg.textContent = '';
    paymentMsg.className = 'sf-msg';
  }, 3000);
}

// ═══════════════════════════════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════════════════════════════

// Initialize all management features when page loads
document.addEventListener('DOMContentLoaded', function() {
  // Wait for currentUserRole to be set
  setTimeout(() => {
    initStockManagement();
    initVenueEditing();
    initMenuEditing();
    initPaymentLimitations();
  }, 500);
});

// Also initialize when role changes
if (typeof updateUIForRole !== 'undefined') {
  const originalUpdateUIForRole = updateUIForRole;
  updateUIForRole = function(role) {
    originalUpdateUIForRole(role);
    // Re-initialize management features after role change
    setTimeout(() => {
      initStockManagement();
      initVenueEditing();
      initMenuEditing();
      initPaymentLimitations();
    }, 100);
  };
}

console.log('FlexiOrder Management Features Loaded');
