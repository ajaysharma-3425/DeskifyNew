"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiTruck, FiCreditCard, FiActivity } from "react-icons/fi";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-white dark:bg-[#1A1A1A] rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative border border-slate-100 dark:border-white/10"
      >
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 italic">
          DESKIFY <span className="text-emerald-500">PAY</span>
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 font-medium">Scan QR to pay securely via any UPI App.</p>

        <div className="bg-slate-50 dark:bg-white/5 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-3xl p-6 flex flex-col items-center mb-6">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=deskify@upi&pn=DeskifyStore&am=${total}`} 
            alt="QR" 
            className="size-40 mb-4 rounded-xl" 
          />
          <p className="text-[10px] font-black text-slate-400 dark:text-white/40 tracking-widest uppercase text-center">UPI ID: deskify@store</p>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-500/20">
            <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">Total Amount</span>
            <span className="text-xl font-black text-emerald-700 dark:text-emerald-400">₹{total.toLocaleString()}</span>
          </div>

          <div>
            <input
              type="text"
              placeholder="Enter 12-digit Transaction ID"
              value={txnId}
              onChange={handleTxnChange}
              className="w-full p-4 bg-slate-100 dark:bg-white/5 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20"
            />
            {txnError && <p className="text-rose-500 text-xs mt-1 font-medium">{txnError}</p>}
          </div>

          <button
            disabled={!txnId || txnError !== "" || placing}
            onClick={handleConfirm}
            className="w-full py-4 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all disabled:opacity-50 active:scale-95"
          >
            {placing ? "VERIFYING..." : "I HAVE PAID"}
          </button>

          {!placing && <button onClick={onClose} className="w-full text-slate-400 dark:text-white/40 text-xs font-bold uppercase tracking-widest mt-2">Cancel</button>}
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

  const [address, setAddress] = useState({ fullName: "", phone: "", addressLine: "", city: "", pincode: "" });
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

  const validate = () => {
    let newErrors: any = {};
    if (!address.fullName.trim()) newErrors.fullName = "Name is required";
    if (!address.phone || !/^\d{10}$/.test(address.phone)) newErrors.phone = "Valid 10-digit phone required";
    if (!address.addressLine.trim()) newErrors.addressLine = "Address is required";
    if (!address.city.trim()) newErrors.city = "City is required";
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) newErrors.pincode = "Valid 6-digit pincode required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanValue = (name === "phone" || name === "pincode") ? value.replace(/\D/g, "") : value;
    setAddress({ ...address, [name]: cleanValue });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
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
        body: JSON.stringify({ shippingAddress: address, paymentMethod, transactionId, paymentStatus: paymentMethod === "ONLINE" ? "Paid" : "Pending" }),
      });
      if (res.ok) router.push("/my-orders?success=true");
      else alert("Order failed");
    } catch (err) { alert("Error"); }
    finally { setPlacing(false); setShowModal(false); }
  };

  if (loading) return <div className="p-20 text-center font-black dark:text-white transition-colors">LOADING DESKIFY...</div>;

  return (
    <div className="min-h-screen bg-transparent pt-24 pb-20 px-6 transition-colors">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-16">

        {/* LEFT: SHIPPING & PAYMENT */}
        <div className="lg:col-span-7 space-y-12">
          <section id="shipping-section">
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
              <span className="w-8 h-8 bg-black dark:bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">1</span>
              SHIPPING DETAILS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input name="fullName" placeholder="Full Name" value={address.fullName} onChange={handleInputChange} error={errors.fullName} />
              <Input name="phone" placeholder="10-Digit Phone" value={address.phone} onChange={handleInputChange} error={errors.phone} maxLength={10} />
              <div className="md:col-span-2">
                <Input name="addressLine" placeholder="Street Address / House No." value={address.addressLine} onChange={handleInputChange} error={errors.addressLine} />
              </div>
              <Input name="city" placeholder="City" value={address.city} onChange={handleInputChange} error={errors.city} />
              <Input name="pincode" placeholder="6-Digit Pincode" value={address.pincode} onChange={handleInputChange} error={errors.pincode} maxLength={6} />
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900 dark:text-white">
              <span className="w-8 h-8 bg-black dark:bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm">2</span>
              PAYMENT METHOD
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <PaymentOption 
                active={paymentMethod === "COD"} 
                onClick={() => setPaymentMethod("COD")} 
                icon={<FiTruck size={24} />} 
                label="Cash on Delivery" 
              />
              <PaymentOption 
                active={paymentMethod === "ONLINE"} 
                onClick={() => setPaymentMethod("ONLINE")} 
                icon={<FiCreditCard size={24} />} 
                label="Online / QR Scan" 
              />
            </div>
          </section>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-slate-100 dark:border-white/10 shadow-xl sticky top-28 backdrop-blur-sm">
            <h3 className="font-black mb-6 tracking-tight text-slate-900 dark:text-white uppercase">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <SummaryRow label="Subtotal" value={`₹${subtotal.toLocaleString()}`} />
              <SummaryRow label="Shipping" value={shipping === 0 ? 'FREE' : `₹${shipping}`} />
              <div className="flex justify-between items-end pt-4 border-t border-slate-100 dark:border-white/10 text-2xl font-black text-slate-900 dark:text-white">
                <span>Total</span><span>₹{total.toLocaleString()}</span>
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
              className="w-full py-5 bg-slate-900 dark:bg-emerald-600 text-white rounded-2xl font-black hover:bg-black dark:hover:bg-emerald-500 transition-all active:scale-95 disabled:opacity-50"
            >
              {placing ? "PROCESSING..." : (paymentMethod === "ONLINE" ? "PAY & FINISH" : "PLACE ORDER")}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showModal && (
          <PaymentModal total={total} onClose={() => setShowModal(false)} onConfirm={handlePlaceOrder} placing={placing} />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- REUSABLE COMPONENTS WITH SYNCED TEXT COLORS ---

function Input({ name, placeholder, value, onChange, error, maxLength }: any) {
  return (
    <div className="w-full">
      <input
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`p-4 border rounded-2xl w-full transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 ${
          error ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10' : 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5'
        } focus:ring-2 focus:ring-black/5 dark:focus:ring-emerald-500/20`}
        value={value}
        onChange={onChange}
      />
      {error && <p className="text-rose-500 text-xs mt-1 font-bold italic">{error}</p>}
    </div>
  );
}

function PaymentOption({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col gap-2 text-left ${
        active 
        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' 
        : 'border-slate-100 dark:border-white/10 bg-white dark:bg-white/5'
      }`}
    >
      <div className={active ? 'text-emerald-500' : 'text-slate-400 dark:text-white/30'}>{icon}</div>
      <span className={`font-black text-[10px] md:text-xs uppercase tracking-widest ${active ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500 dark:text-white/40'}`}>{label}</span>
    </button>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <div className="flex justify-between font-bold text-sm">
      <span className="text-slate-500 dark:text-white/40">{label}</span>
      <span className="text-slate-900 dark:text-white">{value}</span>
    </div>
  );
}