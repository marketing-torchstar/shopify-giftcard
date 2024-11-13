// giftcard.js

document.addEventListener('DOMContentLoaded', function() {
  if (typeof window.customerId !== 'undefined' && window.customerId !== null) {
    const apiUrl = `https://您的部署域名/api/giftcards?customer_id=${window.customerId}`;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        const giftCardContainer = document.getElementById('gift-card-container');
        if (giftCardContainer) {
          if (data.length > 0) {
            data.forEach(card => {
              const cardElement = document.createElement('div');
              cardElement.innerHTML = `
                <h3>Gift Card Code: ${card.displayCode}</h3>
                <p>Initial Value: ${card.initialValue} ${card.currencyCode}</p>
                <p>Balance: ${card.balance} ${card.currencyCode}</p>
                <p>Status: ${card.disabledAt ? 'Disabled' : 'Active'}</p>
              `;
              giftCardContainer.appendChild(cardElement);
            });
          } else {
            giftCardContainer.innerHTML = '<p>You have no gift card.</p>';
          }
        }
      })
      .catch(error => {
        console.error('Failed to fetch gift card information:', error);
      });
  } else {
    const giftCardContainer = document.getElementById('gift-card-container');
    if (giftCardContainer) {
      giftCardContainer.innerHTML = '<p>Please log in to view your gift cards.</p>';
    }
  }
});
