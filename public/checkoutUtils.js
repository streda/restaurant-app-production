export default async function handleCheckout(orderArray) {
    const items = orderArray.map(({menuItem, quantity})=> ({
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: quantity,
    }));
  
    const API_BASE_URL = window.location.origin;
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ items }), // Send the items to the backend
  });
    if(!response.ok){
      throw new Error('Network response was not ok.');
    }
  
    let session;
    try {
      session = await response.json();
    } catch (error) {
      throw new Error('Failed to parse JSON response.');
    }
    window.location.href = session.url; // Redirect to Stripe Checkout
  }
  
export function initializeCheckoutButton() {
    const checkoutButton = document.getElementById("complete-order-button");
    
    if (checkoutButton) {
      checkoutButton.addEventListener("click", handleCompleteOrderButtonClick);
    } else {
      console.error("Checkout button not found");
    }
  }

  export function toggleCompleteOrderButton(isRequired) {
    let completeOrderButton = document.getElementById("complete-order-button");
    if (!completeOrderButton) {
      completeOrderButton = createCompleteOrderButton();
    }
    completeOrderButton.style.display = isRequired ? "block" : "none";
  }
  
  export function createCompleteOrderButton() {
    const btn = document.createElement("button");
    btn.id = "complete-order-button";
    btn.textContent = "Complete Order";
    btn.addEventListener("click", handleCompleteOrderButtonClick);
  
    const displayCompleteOrderButton =
      document.getElementById("section-complete");
    if (displayCompleteOrderButton) {
      displayCompleteOrderButton.appendChild(btn);
    } else {
      console.error("section-complete element is not available on this page.");
    }
    return btn;
  }
  
  export function handleCompleteOrderButtonClick() {
    if (orderArray.length > 0) {
      handleCheckout(orderArray).catch((error) =>
        console.error("Checkout failed", error)
      );
    } else {
      alert("Please add items to your order before proceeding to payment.");
    }
  }