const BASE_UNIT_PRICE = 300;
        let activeCouponRate = 0; 
        let activeCouponCode = "";

        const cartQtyInput = document.getElementById('cart-qty');
        const itemTotalPriceEl = document.getElementById('item-total-price');
        const cartCountBadge = document.getElementById('cart-count-badge');
        const billSubtotalEl = document.getElementById('bill-subtotal');
        const billDiscountEl = document.getElementById('bill-discount');
        const discountRow = document.getElementById('discount-row');
        const billDeliveryEl = document.getElementById('bill-delivery');
        const billTotalEl = document.getElementById('bill-total');
        const shippingAlert = document.getElementById('shipping-alert');
        const shippingNeededEl = document.getElementById('shipping-needed');
        const couponInput = document.getElementById('coupon-input');
        const couponMessage = document.getElementById('coupon-message');
        const appliedCouponName = document.getElementById('applied-coupon-name');

        function recalculateBill() {
            const qty = parseInt(cartQtyInput.value) || 0;
            if(qty <= 0) { removeProduct(); return; }

            // 1. Base item math computations
            const subtotal = BASE_UNIT_PRICE * qty;
            itemTotalPriceEl.innerText = `₹ ${subtotal}`;
            billSubtotalEl.innerText = `₹ ${subtotal}`;
            cartCountBadge.innerText = `${qty} ${qty === 1 ? 'Item' : 'Items'}`;

            // 2. Promotional Discount evaluations
            let discount = 0;
            if (activeCouponRate > 0) {
                discount = Math.round(subtotal * activeCouponRate);
                billDiscountEl.innerText = discount;
                appliedCouponName.innerText = activeCouponCode;
                discountRow.classList.remove('hidden');
            } else {
                discountRow.classList.add('hidden');
            }

            // 3. Shipping thresholds (Free Shipping trigger over ₹499)
            let deliveryFee = 40;
            if (subtotal >= 499) {
                deliveryFee = 0;
                billDeliveryEl.innerHTML = `<span class="text-emerald-600 font-semibold">FREE</span> <span class="line-through text-gray-400 text-xs">₹ 40</span>`;
                shippingAlert.classList.add('hidden');
            } else {
                deliveryFee = 40;
                billDeliveryEl.innerText = `₹ ${deliveryFee}`;
                shippingAlert.classList.remove('hidden');
                shippingNeededEl.innerText = `₹ ${499 - subtotal}`;
            }

            // 4. Final Aggregations Calculation
            billTotalEl.innerText = `₹ ${subtotal - discount + deliveryFee}`;
        }

        function changeQty(amount) {
            let val = parseInt(cartQtyInput.value) || 1;
            val += amount;
            if (val < 1) val = 1;
            cartQtyInput.value = val;
            recalculateBill();
        }

        function autoFillCoupon(code) {
            couponInput.value = code;
            applyCoupon();
        }

        function applyCoupon() {
            const typedCode = couponInput.value.trim().toUpperCase();
            couponMessage.classList.remove('hidden', 'text-emerald-600', 'text-red-600');

            if (typedCode === "GLOW20") {
                activeCouponRate = 0.20;
                activeCouponCode = "GLOW20";
                couponMessage.innerText = "Coupon 'GLOW20' applied successfully! (20% Off)";
                couponMessage.classList.add('text-emerald-600');
            } else {
                activeCouponRate = 0; activeCouponCode = "";
                couponMessage.innerText = typedCode === "" ? "Please enter a code." : "Invalid coupon. Try 'GLOW20'.";
                couponMessage.classList.add('text-red-600');
            }
            recalculateBill();
        }

        function removeProduct() {
            document.getElementById('cart-item-1').remove();
            cartCountBadge.innerText = "0 Items";
            document.getElementById('empty-cart-state').classList.remove('hidden');
            document.getElementById('summary-panel').remove();
        }

        // Run calculations on initial load
        recalculateBill();





        