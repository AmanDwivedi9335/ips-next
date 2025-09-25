"use client";

import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";
import { toast } from "react-hot-toast";
import { toNumber } from "@/lib/pricing.js";

// Payment API functions
const paymentAPI = {
        async createRazorpayOrder(orderData) {
                const response = await fetch("/api/razorpay", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify(orderData),
                });
                const data = await response.json().catch(() => null);

                if (!response.ok || !data?.success) {
                        const message = data?.error || data?.message || "Failed to create payment order";
                        throw new Error(message);
                }

                return data;
        },

        async verifyPayment(paymentData) {
                const response = await fetch("/api/paymentverify", {
                        method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(paymentData),
		});
                const data = await response.json().catch(() => null);

                if (!response.ok || !data?.success) {
                        const message = data?.error || data?.message || "Payment verification failed";
                        throw new Error(message);
                }

                return data;
        },

	async createOrder(orderData) {
		const response = await fetch("/api/orders", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(orderData),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to create order");
		}
		return response.json();
	},

	async validateCoupon(couponCode, orderAmount) {
		const response = await fetch("/api/coupons/validate", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ code: couponCode, orderAmount }),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to validate coupon");
		}
		return response.json();
	},

	async getUserAddresses() {
		const response = await fetch("/api/user/addresses", {
			method: "GET", // Changed from POST to GET
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to fetch addresses");
		}
		return response.json();
	},

	async addUserAddress(addressData) {
		const response = await fetch("/api/user/addresses", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify(addressData),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.message || "Failed to add address");
		}
		return response.json();
	},
};

export const useCheckoutStore = create(
	devtools(
		persist(
			(set, get) => ({
				// State
				checkoutType: "cart", // 'cart' or 'buyNow'
				buyNowProduct: null,
				buyNowQuantity: 1,

				// Customer Information (auto-filled from user)
				customerInfo: {
					name: "",
					email: "",
					mobile: "",
				},

				// Delivery Address Management
                                savedAddresses: [],
                                selectedBillingAddressId: null,
                                selectedShippingAddressId: null,
                                newAddress: {
                                        tag: "shipping",
                                        name: "",
                                        street: "",
                                        city: "",
                                        state: "",
                                        zipCode: "",
                                        country: "India",
                                        isDefault: false,
                                },
				isAddingNewAddress: false,

				// Order Summary
				orderSummary: {
					items: [],
					subtotal: 0,
					shippingCost: 0,
					discount: 0,
					total: 0,
				},

				// Applied Coupon (only for buyNow flow)
				appliedCoupon: null,
				cartAppliedCoupon: null, // For cart flow

				// UI State
				isLoading: false,
				paymentLoading: false,
				currentStep: 1, // 1: Address, 2: Payment
				paymentMethod: "razorpay", // "razorpay", "cod", "credit_card","debit_card", "net_banking", "upi", "wallet"

				// Actions
                                setCheckoutType: (type, product = null, quantity = 1) => {
                                        set({
                                                checkoutType: type,
                                                buyNowProduct: product,
                                                buyNowQuantity: quantity,
                                                currentStep: 1,
                                        });
                                },

                                // Preserve selected buy now product details before redirecting to checkout
                                setBuyNowContext: (product, quantity = 1) => {
                                        if (!product) {
                                                return;
                                        }

                                        set({
                                                buyNowProduct: product,
                                                buyNowQuantity: quantity,
                                        });
                                },

				setCustomerInfo: (info) => {
					set((state) => ({
						customerInfo: { ...state.customerInfo, ...info },
					}));
				},

				setCurrentStep: (step) => {
					set({ currentStep: step });
				},

				setPaymentMethod: (method) => {
					set({ paymentMethod: method });
				},

				// Initialize checkout data
				initializeCheckout: (
					cartItems = [],
					product = null,
					quantity = 1,
					cartCoupon = null
				) => {
					const { checkoutType } = get();

					let items = [];

                                        if (checkoutType === "buyNow" && product) {
                                                const baseMrp =
                                                        toNumber(product.originalPrice) ??
                                                        toNumber(product.mrp) ??
                                                        toNumber(product.price);
                                                const normalizedMrp =
                                                        baseMrp !== null && baseMrp > 0
                                                                ? baseMrp
                                                                : toNumber(product.price) ?? 0;
                                                const finalPrice = toNumber(product.price) ?? 0;
                                                const discountAmount = Math.max(
                                                        (normalizedMrp || 0) - finalPrice,
                                                        0
                                                );

                                                items = [
                                                        {
                                                                productId: product.id,
                                                                productName: product.name || product.title,
                                                                productImage: product.image,
                                                                quantity: quantity,
                                                                price: finalPrice,
                                                                mrp: normalizedMrp,
                                                                discountAmount,
                                                                selectedOptions: product.selectedOptions || null,
                                                                totalPrice: finalPrice * quantity,
                                                        },
                                                ];
                                        } else {
                                                items = cartItems.map((item) => {
                                                        const baseMrp =
                                                                toNumber(item.originalPrice) ??
                                                                toNumber(item.mrp) ??
                                                                toNumber(item.price);
                                                        const normalizedMrp =
                                                                baseMrp !== null && baseMrp > 0
                                                                        ? baseMrp
                                                                        : toNumber(item.price) ?? 0;
                                                        const finalPrice = toNumber(item.price) ?? 0;
                                                        const discountAmount = Math.max(
                                                                (normalizedMrp || 0) - finalPrice,
                                                                0
                                                        );

                                                        return {
                                                                productId: item.id,
                                                                productName: item.name,
                                                                productImage: item.image,
                                                                quantity: item.quantity,
                                                                price: finalPrice,
                                                                mrp: normalizedMrp,
                                                                discountAmount,
                                                                totalPrice: finalPrice * item.quantity,
                                                        };
                                                });
                                        }

					const subtotal = items.reduce(
						(sum, item) => sum + item.totalPrice,
						0
					);

					// Calculate shipping cost: free if subtotal >= 500, else 50
					const shippingCost = subtotal >= 500 ? 0 : 50;

					// Set coupon based on checkout type
					let discount = 0;
					if (checkoutType === "cart" && cartCoupon) {
						set({ cartAppliedCoupon: cartCoupon });
						discount =
							cartCoupon.discountAmount ||
							(subtotal * cartCoupon.discount) / 100;
					} else if (checkoutType === "buyNow") {
						const appliedCoupon = get().appliedCoupon;
						discount = appliedCoupon?.discountAmount || 0;
					}

					const total = subtotal + shippingCost - discount;

					set({
						orderSummary: {
							items,
							subtotal,
							shippingCost,
							discount,
							total,
						},
					});
				},

				// Load user addresses
				loadUserAddresses: async () => {
					set({ isLoading: true });
					try {
                                                const data = await paymentAPI.getUserAddresses();
                                                if (data.success) {
                                                        const addresses = data.addresses || [];
                                                        const billingAddress = addresses.find(
                                                                (addr) => addr.tag === "billing"
                                                        );
                                                        const shippingAddresses = addresses.filter(
                                                                (addr) => addr.tag === "shipping"
                                                        );
                                                        const defaultShipping =
                                                                shippingAddresses.find((addr) => addr.isDefault) ||
                                                                shippingAddresses[0] ||
                                                                null;

                                                        const {
                                                                selectedBillingAddressId,
                                                                selectedShippingAddressId,
                                                        } = get();

                                                        const nextState = {
                                                                savedAddresses: addresses,
                                                                selectedBillingAddressId: billingAddress
                                                                        ? billingAddress._id
                                                                        : null,
                                                                selectedShippingAddressId: null,
                                                        };

                                                        if (
                                                                selectedShippingAddressId &&
                                                                shippingAddresses.some(
                                                                        (addr) => addr._id === selectedShippingAddressId
                                                                )
                                                        ) {
                                                                nextState.selectedShippingAddressId =
                                                                        selectedShippingAddressId;
                                                        } else if (defaultShipping) {
                                                                nextState.selectedShippingAddressId =
                                                                        defaultShipping._id;
                                                        }

                                                        // Preserve billing selection if still valid
                                                        if (
                                                                selectedBillingAddressId &&
                                                                billingAddress &&
                                                                billingAddress._id === selectedBillingAddressId
                                                        ) {
                                                                nextState.selectedBillingAddressId =
                                                                        selectedBillingAddressId;
                                                        }

                                                        set(nextState);
                                                }
                                        } catch (error) {
                                                console.error("Failed to load addresses:", error);
                                                toast.error("Failed to load saved addresses");
                                        } finally {
						set({ isLoading: false });
					}
				},

				// Add new address
				addNewAddress: async () => {
					const { newAddress } = get();

					if (
						!newAddress.name ||
						!newAddress.street ||
						!newAddress.city ||
						!newAddress.state ||
						!newAddress.zipCode
					) {
						toast.error("Please fill all address fields");
						return false;
					}

					set({ isLoading: true });
					try {
                                                const data = await paymentAPI.addUserAddress(newAddress);
                                                if (data.success) {
                                                        // Reload addresses
                                                        await get().loadUserAddresses();

                                                        // Reset new address form
                                                        set({
                                                                newAddress: {
                                                                        tag: "shipping",
                                                                        name: "",
                                                                        street: "",
                                                                        city: "",
                                                                        state: "",
                                                                        zipCode: "",
									country: "India",
									isDefault: false,
								},
								isAddingNewAddress: false,
							});

							toast.success("Address added successfully");
							return true;
						}
					} catch (error) {
						console.error("Failed to add address:", error);
						toast.error(error.message || "Failed to add address");
					} finally {
						set({ isLoading: false });
					}
					return false;
				},

				// Update new address form
				updateNewAddress: (field, value) => {
					set((state) => ({
						newAddress: { ...state.newAddress, [field]: value },
					}));
				},

				// Select address
                                selectShippingAddress: (addressId) => {
                                        set({ selectedShippingAddressId: addressId });
                                },

				// Toggle add new address form
				toggleAddNewAddress: () => {
					set((state) => ({ isAddingNewAddress: !state.isAddingNewAddress }));
				},

				// Apply coupon (only for buyNow flow)
				applyCoupon: async (couponCode) => {
					const { checkoutType } = get();

					if (checkoutType === "cart") {
						toast.error("Coupon is already applied from cart");
						return false;
					}

					set({ isLoading: true });

					try {
						const data = await paymentAPI.validateCoupon(
							couponCode,
							get().orderSummary.subtotal
						);

						if (data.success) {
							set({ appliedCoupon: data.coupon });
							get().recalculateTotal();
							toast.success("Coupon applied successfully!");
							return true;
						} else {
							toast.error(data.message || "Invalid coupon code");
							return false;
						}
					} catch (error) {
						toast.error(error.message || "Failed to apply coupon");
						return false;
					} finally {
						set({ isLoading: false });
					}
				},

				// Remove coupon (only for buyNow flow)
				removeCoupon: () => {
					const { checkoutType } = get();

					if (checkoutType === "cart") {
						toast.error("Cannot remove coupon applied from cart");
						return;
					}

					set({ appliedCoupon: null });
					get().recalculateTotal();
					toast.success("Coupon removed");
				},

				// Recalculate total
				recalculateTotal: () => {
					const {
						orderSummary,
						appliedCoupon,
						cartAppliedCoupon,
						checkoutType,
					} = get();

					// Calculate shipping cost
					const shippingCost = orderSummary.subtotal >= 500 ? 0 : 50;

					// Calculate discount based on checkout type
					let discount = 0;
					if (checkoutType === "cart" && cartAppliedCoupon) {
						discount =
							cartAppliedCoupon.discountAmount ||
							(orderSummary.subtotal * cartAppliedCoupon.discount) / 100;
					} else if (checkoutType === "buyNow" && appliedCoupon) {
						discount =
							appliedCoupon.discountAmount ||
							(orderSummary.subtotal * appliedCoupon.discount) / 100;
					}

					const total = orderSummary.subtotal + shippingCost - discount;

					set({
						orderSummary: {
							...orderSummary,
							shippingCost,
							discount,
							total,
						},
					});
				},

				// Get selected address
                                getSelectedShippingAddress: () => {
                                        const { savedAddresses, selectedShippingAddressId } = get();
                                        return savedAddresses.find(
                                                (addr) => addr._id === selectedShippingAddressId
                                        );
                                },

                                getSelectedBillingAddress: () => {
                                        const { savedAddresses, selectedBillingAddressId } = get();
                                        return savedAddresses.find(
                                                (addr) => addr._id === selectedBillingAddressId
                                        );
                                },

				// Process payment
				processPayment: async (userId, clearCartCallback = null) => {
					const {
						customerInfo,
						orderSummary,
						appliedCoupon,
						cartAppliedCoupon,
						checkoutType,
						paymentMethod,
					} = get();

                                        const selectedShippingAddress =
                                                get().getSelectedShippingAddress();
                                        const selectedBillingAddress = get().getSelectedBillingAddress();

                                        if (!selectedBillingAddress) {
                                                toast.error("Please add a billing address in your profile");
                                                return { success: false, error: "No billing address" };
                                        }

                                        if (!selectedShippingAddress) {
                                                toast.error("Please select a shipping address");
                                                return { success: false, error: "No shipping address selected" };
                                        }

					if (orderSummary.items.length === 0) {
						toast.error("No items to checkout");
						return { success: false, error: "No items to checkout" };
					}

					set({ paymentLoading: true });

					let shouldResetLoading = true;

					try {
						const couponToUse =
							checkoutType === "cart" ? cartAppliedCoupon : appliedCoupon;

						const orderData = {
							userId: userId,
							customerName: customerInfo.name,
							customerEmail: customerInfo.email,
							customerMobile: customerInfo.mobile,
							products: orderSummary.items,
							subtotal: orderSummary.subtotal,
							shippingCost: orderSummary.shippingCost,
							discount: orderSummary.discount,
							totalAmount: orderSummary.total,
							paymentMethod: paymentMethod,
                                                        billingAddress: {
                                                                tag: selectedBillingAddress.tag,
                                                                name: selectedBillingAddress.name,
                                                                street: selectedBillingAddress.street,
                                                                city: selectedBillingAddress.city,
                                                                state: selectedBillingAddress.state,
                                                                zipCode: selectedBillingAddress.zipCode,
                                                                country: selectedBillingAddress.country,
                                                                fullAddress: `${selectedBillingAddress.street}, ${selectedBillingAddress.city}, ${selectedBillingAddress.state} - ${selectedBillingAddress.zipCode}`,
                                                        },
                                                        shippingAddress: {
                                                                tag: selectedShippingAddress.tag,
                                                                name: selectedShippingAddress.name,
                                                                street: selectedShippingAddress.street,
                                                                city: selectedShippingAddress.city,
                                                                state: selectedShippingAddress.state,
                                                                zipCode: selectedShippingAddress.zipCode,
                                                                country: selectedShippingAddress.country,
                                                                fullAddress: `${selectedShippingAddress.street}, ${selectedShippingAddress.city}, ${selectedShippingAddress.state} - ${selectedShippingAddress.zipCode}`,
                                                        },
                                                        deliveryAddress: {
                                                                tag: selectedShippingAddress.tag,
                                                                name: selectedShippingAddress.name,
                                                                street: selectedShippingAddress.street,
                                                                city: selectedShippingAddress.city,
                                                                state: selectedShippingAddress.state,
                                                                zipCode: selectedShippingAddress.zipCode,
                                                                country: selectedShippingAddress.country,
                                                                fullAddress: `${selectedShippingAddress.street}, ${selectedShippingAddress.city}, ${selectedShippingAddress.state} - ${selectedShippingAddress.zipCode}`,
                                                        },
							couponApplied: couponToUse
								? {
									couponCode: couponToUse.code,
									discountAmount:
										couponToUse.discountAmount || orderSummary.discount,
									discountType: "percentage",
								}
								: null,
						};

						if (paymentMethod === "razorpay") {
							if (typeof window === "undefined" || !window.Razorpay) {
								toast.error("Payment gateway is not available. Please refresh the page and try again.");
								return { success: false, error: "Razorpay not available" };
							}

							const orderNotes = {};
							if (userId) {
								orderNotes.userId = String(userId);
							}
							if (customerInfo.email) {
								orderNotes.customerEmail = customerInfo.email;
							}
							if (customerInfo.name) {
								orderNotes.customerName = customerInfo.name;
							}

							const payload = {
								amount: orderSummary.total,
								currency: "INR",
								receipt: `order_${Date.now()}`,
							};

                                                        if (Object.keys(orderNotes).length > 0) {
                                                                payload.notes = orderNotes;
                                                        }

							const {
								order: razorpayOrder,
								key: razorpayKey,
							} = await paymentAPI.createRazorpayOrder(payload);

							if (!razorpayOrder?.id) {
								throw new Error("Failed to initialize Razorpay order");
							}

							const publicKey =
								razorpayKey || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

							if (!publicKey) {
								throw new Error("Razorpay key is not configured");
							}

							const RazorpayCheckout = window.Razorpay;

							const orderPayload = {
								...orderData,
								paymentDetails: {
									gateway: "razorpay",
									razorpayOrderId: razorpayOrder.id,
								},
							};

							const options = {
								key: publicKey,
								amount: razorpayOrder.amount,
								currency: razorpayOrder.currency,
								name: "IPS Store",
								description: "Secure payment via Razorpay",
								order_id: razorpayOrder.id,
								handler: async function (response) {
									try {
										const verificationResult =
											await paymentAPI.verifyPayment({
												razorpay_order_id: response.razorpay_order_id,
												razorpay_payment_id: response.razorpay_payment_id,
												razorpay_signature: response.razorpay_signature,
												orderData: orderPayload,
												userId: userId,
												clearCart: checkoutType === "cart",
											});

										if (verificationResult.success) {
											if (checkoutType === "cart" && clearCartCallback) {
												clearCartCallback();
											}

											get().resetCheckout();

											toast.success("Payment successful! Order placed.");

											window.location.href = `/order-success?orderId=${verificationResult.orderId}&orderNumber=${verificationResult.orderNumber}`;
										}
									} catch (error) {
										console.error("Payment verification error:", error);
										toast.error(error.message || "Payment verification failed");
									} finally {
										set({ paymentLoading: false });
									}
								},
								prefill: {
									name: customerInfo.name,
									email: customerInfo.email,
									contact: customerInfo.mobile,
								},
								theme: {
									color: "#000000",
								},
                                                                modal: {
                                                                        ondismiss: function () {
                                                                                set({ paymentLoading: false });
                                                                                toast.error("Payment cancelled");
                                                                        },
                                                                },
                                                        };

                                                        if (Object.keys(orderNotes).length > 0) {
                                                                options.notes = orderNotes;
                                                        }

                                                        const razorpay = new RazorpayCheckout(options);

                                                        razorpay.on("payment.failed", function (response) {
                                                                console.error("Razorpay payment failed:", response.error);
                                                                set({ paymentLoading: false });
                                                                toast.error(
                                                                        response?.error?.description ||
                                                                                "Payment failed. Please try again."
                                                                );
                                                        });

                                                        razorpay.open();

                                                        shouldResetLoading = false;

                                                        return { success: true, paymentMethod: "razorpay" };
					} else if (paymentMethod === "cod") {
						const codOrderData = {
							orderData: {
								...orderData,
								paymentStatus: "pending",
								status: "confirmed",
							},
							userId: userId,
							clearCart: checkoutType === "cart",
						};

						const result = await paymentAPI.createOrder(codOrderData);

						if (result.success) {
							if (checkoutType === "cart" && clearCartCallback) {
								clearCartCallback();
							}

							get().resetCheckout();

							toast.success("Order placed successfully!");

							window.location.href = `/order-success?orderId=${result.orderId}&orderNumber=${result.orderNumber}`;

							return { success: true, paymentMethod: "cod" };
						}

						toast.error(result.error || "Failed to place order");
						return { success: false, error: result.error };
					}

					toast.error("Unsupported payment method");
					return { success: false, error: "Unsupported payment method" };
				} catch (error) {
					console.error("Payment processing error:", error);
					toast.error(error.message || "Payment processing failed");
					return { success: false, error: error.message };
				} finally {
					if (shouldResetLoading) {
						set({ paymentLoading: false });
					}
				}
                                },

				// Reset checkout
				resetCheckout: () => {
					set({
						checkoutType: "cart",
						buyNowProduct: null,
						buyNowQuantity: 1,
						customerInfo: { name: "", email: "", mobile: "" },
                                                savedAddresses: [],
                                                selectedBillingAddressId: null,
                                                selectedShippingAddressId: null,
                                                newAddress: {
                                                        tag: "shipping",
                                                        name: "",
                                                        street: "",
                                                        city: "",
                                                        state: "",
                                                        zipCode: "",
							country: "India",
							isDefault: false,
						},
						isAddingNewAddress: false,
						orderSummary: {
							items: [],
							subtotal: 0,
							shippingCost: 0,
							discount: 0,
							total: 0,
						},
						appliedCoupon: null,
						cartAppliedCoupon: null,
						currentStep: 1,
						paymentMethod: "razorpay",
						paymentLoading: false,
					});
				},

				// Validate checkout data
				validateCheckoutData: () => {
                                        const {
                                                customerInfo,
                                                selectedBillingAddressId,
                                                selectedShippingAddressId,
                                                orderSummary,
                                        } = get();
                                        const errors = [];

                                        // Validate customer info
                                        if (!customerInfo.name.trim())
                                                errors.push("Customer name is required");
					if (!customerInfo.email.trim()) errors.push("Email is required");
					if (!customerInfo.mobile.trim())
						errors.push("Mobile number is required");

					// Validate delivery address
                                        if (!selectedBillingAddressId)
                                                errors.push("Please add a billing address");
                                        if (!selectedShippingAddressId)
                                                errors.push("Please select a shipping address");

					// Validate order items
					if (orderSummary.items.length === 0) errors.push("No items in order");

					return {
						isValid: errors.length === 0,
						errors,
					};
				},

				// Get checkout summary
				getCheckoutSummary: () => {
					const {
						orderSummary,
						appliedCoupon,
						cartAppliedCoupon,
						paymentMethod,
						checkoutType,
					} = get();
					const couponToUse =
						checkoutType === "cart" ? cartAppliedCoupon : appliedCoupon;

					return {
						itemCount: orderSummary.items.reduce(
							(sum, item) => sum + item.quantity,
							0
						),
						uniqueItems: orderSummary.items.length,
						...orderSummary,
						hasPromo: !!couponToUse,
						promoCode: couponToUse?.code,
						paymentMethod,
						checkoutType,
					};
				},
			}),
			{
				name: "checkout-storage",
				partialize: (state) => ({
					paymentMethod: state.paymentMethod,
				}),
			}
		)
	)
);
