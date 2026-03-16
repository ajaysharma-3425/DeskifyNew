"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiLock, FiChevronLeft, FiMapPin, FiTruck, FiCreditCard, FiCheckCircle, FiZap, FiUser, FiPhone } from "react-icons/fi";

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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#002A27]/90 backdrop-blur-xl p-4 md:p-6">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#003F3A] border border-white/10 rounded-[2.5rem] p-6 md:p-8 max-w-md w-full shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#A4F000]/10 blur-3xl rounded-full" />
        
        <h2 className="text-2xl font-black text-white mb-2 italic uppercase tracking-tighter">DESKIFY <span className="text-[#A4F000]">PAY</span></h2>
        <p className="text-white/40 text-xs mb-8 font-medium uppercase tracking-widest">Secure encrypted UPI gateway</p>

        <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-3xl p-6 flex flex-col items-center mb-8">
          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=deskify@upi&pn=DeskifyStore&am=${total}`} alt="QR" className="size-44 mb-4 rounded-xl shadow-2xl bg-white p-2" />
          <p className="text-[10px] font-black text-[#A4F000] tracking-[0.3em] uppercase">UPI ID: deskify@store</p>
        </div>

        <div className="space-y-4 relative z-10">
          <div className="flex justify-between items-center bg-[#A4F000]/10 p-5 rounded-2xl border border-[#A4F000]/20">
            <span className="text-xs font-black text-[#A4F000] uppercase tracking-widest">Payable Amount</span>
            <span className="text-2xl font-black text-white italic">₹{total.toLocaleString()}</span>
          </div>

          <div className="space-y-1">
            <input
              type="text"
              placeholder="Enter 12-digit Transaction ID"
              value={txnId}
              onChange={handleTxnChange}
              className="w-full p-5 bg-white/5 border border-white/10 rounded-2xl focus:border-[#A4F000]/50 focus:ring-0 outline-none text-sm font-bold text-white placeholder:text-white/20 transition-all italic"
            />
            {txnError && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest ml-2">{txnError}</p>}
          </div>

          <button
            disabled={!txnId || txnError !== "" || placing}
            onClick={handleConfirm}
            className="w-full py-5 bg-[#A4F000] text-[#003F3A] rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-30 shadow-xl shadow-[#A4F000]/10"
          >
            {placing ? "VERIFYING PROTOCOL..." : "CONFIRM TRANSACTION"}
          </button>

          {!placing && <button onClick={onClose} className="w-full text-white/20 hover:text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mt-4 transition-colors">Abort Payment</button>}
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
    if (!address.fullName.trim()) newErrors.fullName = "Name Required";
    if (!address.phone || !/^\d{10}$/.test(address.phone)) newErrors.phone = "Invalid 10-digit Phone";
    if (!address.addressLine.trim()) newErrors.addressLine = "Street Address Required";
    if (!address.city.trim()) newErrors.city = "City Required";
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) newErrors.pincode = "Invalid Pincode";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "phone" || name === "pincode") {
      const onlyNums = value.replace(/\D/g, "");
      setAddress({ ...address, [name]: onlyNums });
    } else {
      setAddress({ ...address, [name]: value });
    }
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
        body: JSON.stringify({
          shippingAddress: { fullName: address.fullName, phone: address.phone, address: address.addressLine, city: address.city, pincode: address.pincode },
          paymentMethod, transactionId, paymentStatus: paymentMethod === "ONLINE" ? "Paid" : "Pending"
        }),
      });
      if (res.ok) {
        setCart([]);
        window.dispatchEvent(new Event("cartUpdated"));
        router.push("/my-orders?success=true");
      }
    } catch (err) { alert("Order failed"); } finally { setPlacing(false); setShowModal(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#003F3A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/10 border-t-[#A4F000] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#003F3A] text-white pt-24 pb-20 px-4 md:px-6 font-sans selection:bg-[#A4F000] selection:text-[#003F3A]">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 md:gap-16">

        {/* LEFT: SHIPPING & PAYMENT */}
        <div className="lg:col-span-7 space-y-12">
          <section id="shipping-section">
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4 italic tracking-tighter uppercase">
              <span className="w-10 h-10 bg-[#A4F000] text-[#003F3A] rounded-2xl flex items-center justify-center text-sm not-italic shadow-lg shadow-[#A4F000]/20">01</span>
              <span>Deployment <span className="text-[#A4F000]">Node</span></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-1">
                <input
                  name="fullName" placeholder="Full Name"
                  className={`p-5 bg-white/5 border rounded-[1.5rem] w-full outline-none focus:border-[#A4F000] transition-all text-white italic font-bold placeholder:text-white/20 ${errors.fullName ? 'border-rose-500 bg-rose-500/5' : 'border-white/10'}`}
                  value={address.fullName} onChange={handleInputChange}
                />
                {errors.fullName && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mt-2 ml-2 italic">{errors.fullName}</p>}
              </div>

              <div className="md:col-span-1">
                <input
                  name="phone" placeholder="Phone Number"
                  className={`p-5 bg-white/5 border rounded-[1.5rem] w-full outline-none focus:border-[#A4F000] transition-all text-white italic font-bold placeholder:text-white/20 ${errors.phone ? 'border-rose-500 bg-rose-500/5' : 'border-white/10'}`}
                  value={address.phone} onChange={handleInputChange} maxLength={10}
                />
                {errors.phone && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mt-2 ml-2 italic">{errors.phone}</p>}
              </div>

              <div className="md:col-span-2">
                <input
                  name="addressLine" placeholder="Full Street Address / House No."
                  className={`p-5 bg-white/5 border rounded-[1.5rem] w-full outline-none focus:border-[#A4F000] transition-all text-white italic font-bold placeholder:text-white/20 ${errors.addressLine ? 'border-rose-500 bg-rose-500/5' : 'border-white/10'}`}
                  value={address.addressLine} onChange={handleInputChange}
                />
                {errors.addressLine && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mt-2 ml-2 italic">{errors.addressLine}</p>}
              </div>

              <div>
                <input
                  name="city" placeholder="City"
                  className={`p-5 bg-white/5 border rounded-[1.5rem] w-full outline-none focus:border-[#A4F000] transition-all text-white italic font-bold placeholder:text-white/20 ${errors.city ? 'border-rose-500 bg-rose-500/5' : 'border-white/10'}`}
                  value={address.city} onChange={handleInputChange}
                />
                {errors.city && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mt-2 ml-2 italic">{errors.city}</p>}
              </div>

              <div>
                <input
                  name="pincode" placeholder="Pincode"
                  className={`p-5 bg-white/5 border rounded-[1.5rem] w-full outline-none focus:border-[#A4F000] transition-all text-white italic font-bold placeholder:text-white/20 ${errors.pincode ? 'border-rose-500 bg-rose-500/5' : 'border-white/10'}`}
                  value={address.pincode} onChange={handleInputChange} maxLength={6}
                />
                {errors.pincode && <p className="text-rose-400 text-[10px] font-black uppercase tracking-widest mt-2 ml-2 italic">{errors.pincode}</p>}
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-black mb-10 flex items-center gap-4 italic tracking-tighter uppercase">
              <span className="w-10 h-10 bg-[#A4F000] text-[#003F3A] rounded-2xl flex items-center justify-center text-sm not-italic shadow-lg shadow-[#A4F000]/20">02</span>
              <span>Credit <span className="text-[#A4F000]">Protocol</span></span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("COD")}
                className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col gap-3 text-left relative overflow-hidden group ${paymentMethod === 'COD' ? 'border-[#A4F000] bg-[#A4F000]/5' : 'border-white/5 bg-white/[0.02]'}`}
              >
                <FiTruck size={28} className={paymentMethod === 'COD' ? 'text-[#A4F000]' : 'text-white/20'} />
                <div>
                  <span className={`block font-black text-xs uppercase tracking-widest ${paymentMethod === 'COD' ? 'text-[#A4F000]' : 'text-white/40'}`}>Standard</span>
                  <span className="font-bold text-white italic">Cash on Delivery</span>
                </div>
                {paymentMethod === 'COD' && <motion.div layoutId="activePay" className="absolute top-4 right-4 text-[#A4F000]"><FiCheckCircle /></motion.div>}
              </button>

              <button
                onClick={() => setPaymentMethod("ONLINE")}
                className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col gap-3 text-left relative overflow-hidden group ${paymentMethod === 'ONLINE' ? 'border-[#A4F000] bg-[#A4F000]/5' : 'border-white/5 bg-white/[0.02]'}`}
              >
                <FiCreditCard size={28} className={paymentMethod === 'ONLINE' ? 'text-[#A4F000]' : 'text-white/20'} />
                <div>
                  <span className={`block font-black text-xs uppercase tracking-widest ${paymentMethod === 'ONLINE' ? 'text-[#A4F000]' : 'text-white/40'}`}>Encrypted</span>
                  <span className="font-bold text-white italic">Online / QR Scan</span>
                </div>
                {paymentMethod === 'ONLINE' && <motion.div layoutId="activePay" className="absolute top-4 right-4 text-[#A4F000]"><FiCheckCircle /></motion.div>}
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT: SUMMARY */}
        <div className="lg:col-span-5">
          <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl sticky top-28 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#A4F000]/20" />
            <h3 className="font-black mb-10 tracking-[0.2em] text-white/40 text-[10px] uppercase">Manifest Summary</h3>
            
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-white/60 font-bold italic text-sm">
                <span>Items Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-white/60 font-bold italic text-sm">
                <span>Logistics Fee</span>
                <span className={shipping === 0 ? 'text-[#A4F000]' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between items-end pt-8 border-t border-white/5 text-3xl font-black text-white italic">
                <span>Total</span>
                <span className="text-[#A4F000]">₹{total.toLocaleString()}</span>
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
              className="w-full py-6 bg-[#A4F000] text-[#003F3A] rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl shadow-[#A4F000]/10 flex items-center justify-center gap-3 disabled:opacity-30 group"
            >
              {placing ? "TRANSMITTING..." : (
                <>
                  {paymentMethod === "ONLINE" ? "INITIALIZE PAYMENT" : "FINALIZE ORDER"}
                  <FiZap className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
            
            <p className="text-center text-[9px] text-white/20 font-black uppercase tracking-[0.2em] mt-8 flex items-center justify-center gap-2">
              <FiLock /> End-to-End Encrypted Checkout
            </p>
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