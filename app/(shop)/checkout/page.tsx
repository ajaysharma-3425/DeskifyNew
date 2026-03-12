"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiChevronLeft, FiMapPin, FiTruck, FiCreditCard, FiCheckCircle } from "react-icons/fi";

// --- INTERFACE FOR PAYMENT MODAL PROPS ---
interface PaymentModalProps {
  total: number;
  onConfirm: (txnId: string) => void;
  onClose: () => void;
  placing: boolean;
}

// --- DUMMY QR MODAL COMPONENT ---
function PaymentModal({ total, onConfirm, onClose, placing }: PaymentModalProps) {
  const [txnId, setTxnId] = useState("");
  const [txnError, setTxnError] = useState("");

  // Validate transaction ID: exactly 12 digits
  const validateTxnId = (id: string) => {
    const digitsOnly = id.replace(/\D/g, '');
    if (digitsOnly.length !== 12) return "Transaction ID must be 12 digits";
    return "";
  };

  const handleTxnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTxnId(value);
    setTxnError(validateTxnId(value));
  };

  const handleConfirm = () => {
    const error = validateTxnId(txnId);
    if (error) {
      setTxnError(error);
      return;
    }
    onConfirm(txnId);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative">
        <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 mb-2 italic">DESKIFY <span className="text-emerald-500 dark:text-emerald-300">PAY</span></h2>
        <p className="text-slate-500 dark:text-slate-300 text-sm mb-6 font-medium">Scan QR to pay securely via any UPI App.</p>

        <div className="bg-slate-50 dark:bg-slate-50 border-2 border-dashed border-slate-200 dark:border-slate-200 rounded-3xl p-6 flex flex-col items-center mb-6">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=deskify@upi&pn=DeskifyStore&am=${total}`} alt="QR" className="size-40 mb-4" />
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-200 tracking-widest uppercase">UPI ID: deskify@store</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-50 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-100">
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">Total Amount</span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">₹{total.toLocaleString()}</span>
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter 12-digit Transaction ID"
              value={txnId}
              onChange={handleTxnChange}
              className="w-full p-4 bg-slate-100 dark:bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-900 dark:text-slate-100"
            />
            {txnError && <p className="text-rose-500 dark:text-rose-300 text-xs mt-1 font-medium">{txnError}</p>}
          </div>

          <button
            disabled={!txnId || txnError !== "" || placing}
            onClick={handleConfirm}
            className="w-full py-4 bg-[#0F172A] text-white dark:text-white rounded-2xl font-black hover:bg-emerald-600 transition-all disabled:opacity-50"
          >
            {placing ? "VERIFYING..." : "I HAVE PAID"}
          </button>

          {!placing && <button onClick={onClose} className="w-full text-slate-400 dark:text-slate-200 text-xs font-bold uppercase tracking-widest mt-2">Cancel</button>}
        </div>
      </motion.div>
    </div>
  );
}

// --- MAIN PAGE ---
export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine: "",
    city: "",
    pincode: ""
  });

  // Error State
  const [errors, setErrors] = useState<any>({});

  const fetchCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const res = await fetch("/api/cart", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setCart(data?.items || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCart(); }, []);

  const subtotal = cart.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
  const shipping = subtotal > 1000 ? 0 : 99;
  const total = subtotal + shipping;

  // --- VALIDATION LOGIC ---
  const validate = () => {
    let newErrors: any = {};

    if (!address.fullName.trim()) newErrors.fullName = "Please enter your full name";

    if (!address.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(address.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!address.addressLine.trim()) newErrors.addressLine = "Flat/House/Street is required";
    if (!address.city.trim()) newErrors.city = "City name is required";

    if (!address.pincode) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(address.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Agar field 'phone' ya 'pincode' hai, to sirf digits allow karo
    if (name === "phone" || name === "pincode") {
      const onlyNums = value.replace(/\D/g, ""); // Yeh line numbers ke alaawa sab remove kar degi
      setAddress({ ...address, [name]: onlyNums });
    } else {
      setAddress({ ...address, [name]: value });
    }

    // Error clear karna
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };
  const handlePlaceOrder = async (transactionId = "") => {
    if (!validate()) {
      document.getElementById("shipping-section")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setPlacing(true);
    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({
          shippingAddress: address,
          paymentMethod: paymentMethod,
          transactionId: transactionId,
          paymentStatus: paymentMethod === "ONLINE" ? "Paid" : "Pending"
        }),
      });

      if (res.ok) { router.push("/my-orders?success=true"); }
      else { alert("Order failed"); }
    } catch (err) { alert("Error"); }
    finally { setPlacing(false); setShowModal(false); }
  };

  if (loading) return <div className="p-20 text-center font-black text-slate-900 dark:text-slate-100">LOADING DESKIFY...</div>;

  return (
    <div className="min-h-screen bg-[#FBFBFB] pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16">

        {/* LEFT: SHIPPING & PAYMENT */}
        <div className="lg:col-span-7 space-y-12">
          <section id="shipping-section">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-black text-white dark:text-white rounded-full flex items-center justify-center text-sm">1</span>
              <span className="text-slate-900 dark:text-slate-100">SHIPPING DETAILS</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-1">
                <input
                  name="fullName"
                  placeholder="Full Name"
                  className={`p-4 border rounded-2xl w-full transition-all outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 ${
                    errors.fullName ? 'border-rose-500 bg-rose-50 dark:bg-rose-50' : 'border-emerald-400 dark:border-emerald-400'
                  }`}
                  value={address.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && <p className="text-rose-500 dark:text-rose-300 text-xs mt-1 font-bold italic">{errors.fullName}</p>}
              </div>

              <div className="md:col-span-1">
                <input
                  name="phone"
                  placeholder="10-Digit Phone Number"
                  className={`p-4 border rounded-2xl w-full transition-all outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 ${
                    errors.phone ? 'border-rose-500 bg-rose-50 dark:bg-rose-50' : 'border-emerald-400 dark:border-emerald-400'
                  }`}
                  value={address.phone}
                  onChange={handleInputChange}
                  maxLength={10}
                />
                {errors.phone && <p className="text-rose-500 dark:text-rose-300 text-xs mt-1 font-bold italic">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  name="addressLine"
                  placeholder="Street Address / House No."
                  className={`p-4 border rounded-2xl w-full transition-all outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 ${
                    errors.addressLine ? 'border-rose-500 bg-rose-50 dark:bg-rose-50' : 'border-emerald-400 dark:border-emerald-400'
                  }`}
                  value={address.addressLine}
                  onChange={handleInputChange}
                />
                {errors.addressLine && <p className="text-rose-500 dark:text-rose-300 text-xs mt-1 font-bold italic">{errors.addressLine}</p>}
              </div>

              <div>
                <input
                  name="city"
                  placeholder="City"
                  className={`p-4 border rounded-2xl w-full transition-all outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 ${
                    errors.city ? 'border-rose-500 bg-rose-50 dark:bg-rose-50' : 'border-emerald-400 dark:border-emerald-400'
                  }`}
                  value={address.city}
                  onChange={handleInputChange}
                />
                {errors.city && <p className="text-rose-500 dark:text-rose-300 text-xs mt-1 font-bold italic">{errors.city}</p>}
              </div>

              <div>
                <input
                  name="pincode"
                  placeholder="6-Digit Pincode"
                  className={`p-4 border rounded-2xl w-full transition-all outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-slate-100 ${
                    errors.pincode ? 'border-rose-500 bg-rose-50 dark:bg-rose-50' : 'border-emerald-400 dark:border-emerald-400'
                  }`}
                  value={address.pincode}
                  onChange={handleInputChange}
                  maxLength={6}
                />
                {errors.pincode && <p className="text-rose-500 dark:text-rose-300 text-xs mt-1 font-bold italic">{errors.pincode}</p>}
              </div>
            </div>
          </section>

          {/* PAYMENT SECTION (Same as yours) */}
          <section>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
              <span className="w-8 h-8 bg-black text-white dark:text-white rounded-full flex items-center justify-center text-sm">2</span>
              <span className="text-slate-900 dark:text-slate-100">PAYMENT METHOD</span>
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-2 text-left ${
                  paymentMethod === 'COD'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-50'
                    : 'border-slate-100 dark:border-slate-100 bg-white dark:bg-white'
                }`}
              >
                <FiTruck size={24} className={paymentMethod === 'COD' ? 'text-emerald-500 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-200'} />
                <span className={`font-black text-xs uppercase tracking-widest ${paymentMethod === 'COD' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-300'}`}>
                  Cash on Delivery
                </span>
              </button>
              <button
                onClick={() => setPaymentMethod("ONLINE")}
                className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-2 text-left ${
                  paymentMethod === 'ONLINE'
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-50'
                    : 'border-slate-100 dark:border-slate-100 bg-white dark:bg-white'
                }`}
              >
                <FiCreditCard size={24} className={paymentMethod === 'ONLINE' ? 'text-emerald-500 dark:text-emerald-300' : 'text-slate-400 dark:text-slate-200'} />
                <span className={`font-black text-xs uppercase tracking-widest ${paymentMethod === 'ONLINE' ? 'text-emerald-700 dark:text-emerald-300' : 'text-slate-500 dark:text-slate-300'}`}>
                  Online / QR Scan
                </span>
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-white p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-100 shadow-xl sticky top-28">
            <h3 className="font-black mb-6 tracking-tight text-slate-900 dark:text-slate-100">ORDER SUMMARY</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-slate-500 dark:text-slate-300 font-bold text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-300 font-bold text-sm">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-slate-200 dark:border-slate-200 text-2xl font-black text-slate-900 dark:text-slate-100">
                <span>Total</span>
                <span>₹{total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (validate()) {
                  paymentMethod === "ONLINE" ? setShowModal(true) : handlePlaceOrder();
                } else {
                  document.getElementById("shipping-section")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              disabled={placing}
              className="w-full py-5 bg-slate-900 text-white dark:text-white rounded-2xl font-black hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {placing ? "PROCESSING..." : (paymentMethod === "ONLINE" ? "PAY & FINISH" : "PLACE ORDER")}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <PaymentModal
            total={total}
            onClose={() => setShowModal(false)}
            onConfirm={handlePlaceOrder}
            placing={placing}
          />
        )}
      </AnimatePresence>
    </div>
  );
} 