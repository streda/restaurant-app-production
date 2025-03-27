import {
  fetchMenuItems,
  renderMenuByType,
  fetchCartData,
  updateOrderSummary,
  updateQuantityIndicators,
  renderLandingPage,
  hideLoginForm,
  isLoggedIn,
  toggleOrderSummaryDisplay,
  removeAllItem,
  removeSingleItem,
  addSingleItem,
  toggleCompleteOrderButton,
} from "./utils.js";

export let orderArray = [];
export let menuArray = [];

document.addEventListener("DOMContentLoaded", async () => {
   const isAuthenticationPage = window.location.pathname === '/login.html' || 
                               window.location.pathname === '/signUp.html';

  if (isAuthenticationPage) {
    return;  
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("paymentSuccess") === "true") {
    const cartData = await fetchCartData();
    updateOrderSummary(cartData);
  }

  const cartItems = await fetchCartData();
  updateOrderSummary(cartItems);
  updateQuantityIndicators(cartItems);
  toggleCompleteOrderButton(cartItems.length > 0);
  
  const savedPage = localStorage.getItem("currentPage") || "home";
  if (isLoggedIn()) {
    if (savedPage === "home") {
      toggleCompleteOrderButton(false);
      toggleOrderSummaryDisplay(false);
    } else {
      await fetchMenuItems();
      renderMenuByType(savedPage, isLoggedIn()); 
    }

    updateOrderSummary(cartItems);
    updateQuantityIndicators(cartItems);
    toggleCompleteOrderButton(cartItems.length > 0);
    toggleOrderSummaryDisplay(cartItems.length > 0);
  } else {
    toggleCompleteOrderButton(false);
    toggleOrderSummaryDisplay(false);
  }

  const navbarLinks = document.querySelector(".navbar-links");
      if (navbarLinks) {
        navbarLinks.addEventListener("click", async function (event) {
          const linkType = event.target.getAttribute("data-type");
          if (linkType) {
            event.preventDefault();
            hideLoginForm(); 

            localStorage.setItem("currentPage", linkType); 

            if (linkType === "home") {
               renderLandingPage(); 
              toggleCompleteOrderButton(false);
              toggleOrderSummaryDisplay(false);
            } else {
                if (isLoggedIn()) {
                  await fetchMenuItems();
                  renderMenuByType(linkType, isLoggedIn());

                  const cartItems = await fetchCartData();
                  updateOrderSummary(cartItems);
                  updateQuantityIndicators(cartItems);
                  toggleCompleteOrderButton(cartItems.length > 0);
                  toggleOrderSummaryDisplay(cartItems.length > 0);
                } else {
                    alert("Please log in or sign up to view menu items.");
                    return; 
                }
              }
            }
          });
        }

  const sectionSummary = document.getElementById("order-summary-container");
  if (sectionSummary) {
    sectionSummary.addEventListener("click", async function (event) {
      const itemId = event.target.getAttribute("data-item-id");

      if (event.target.classList.contains("remove-single-item")) {
        await removeSingleItem(itemId);
      } else if (event.target.classList.contains("remove-all-item")) {
        await removeAllItem(itemId);
      } else if (event.target.classList.contains("add-single-item")) {
        await addSingleItem(itemId);
      }

      const updatedItems = await fetchCartData();
      toggleCompleteOrderButton(updatedItems.length > 0);
    });
  }

  const toggleButton = document.querySelector(".toggle-button");
  const closeBtn = document.getElementById("close-btn");

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      navbarLinks.classList.toggle("active");
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      navbarLinks.classList.remove("active");
    });
  }

  document.addEventListener("click", (event) => {
    if (!navbarLinks.contains(event.target) &&
        !toggleButton.contains(event.target) &&
        navbarLinks.classList.contains("active")) {
      navbarLinks.classList.remove("active");
    }
  });
});
