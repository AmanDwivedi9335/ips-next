import Razorpay from "razorpay";

let instance;

export function getRazorpayInstance() {
        if (instance) return instance;

        const keyId = process.env.RAZORPAY_KEY_ID;
        const keySecret = process.env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
                throw new Error("RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set");
        }

        instance = new Razorpay({ key_id: keyId, key_secret: keySecret });
        return instance;
}

