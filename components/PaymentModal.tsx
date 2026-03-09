"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiLoader, FiAlertCircle } from "react-icons/fi";

// TypeScript interface for props
interface PaymentModalProps {
  total: number;               // total amount to be paid
  onConfirm: () => void;       // function to call after successful payment
  onClose: () => void;         // function to close the modal
}

export default function PaymentModal({ total, onConfirm, onClose }: PaymentModalProps) {
  const [isVerifying, setIsVerifying] = useState(false);

  // ✅ Strong validation: total must be a positive finite number
  const isValidTotal = typeof total === 'number' && total > 0 && isFinite(total) && !isNaN(total);

  const handleFakeVerify = () => {
    if (!isValidTotal) return; // extra safety
    setIsVerifying(true);
    setTimeout(() => {
      onConfirm();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl relative overflow-hidden text-center"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
        
        <h2 className="text-2xl font-black text-slate-900 mb-2 italic">DESKIFY <span className="text-emerald-500">PAY</span></h2>
        
        {/* Show error if total is invalid */}
        {!isValidTotal && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-600 p-3 rounded-xl flex items-center gap-2 text-sm font-medium">
            <FiAlertCircle size={18} />
            <span>Invalid amount. Please refresh and try again.</span>
          </div>
        )}

        {!isVerifying ? (
          <>
            <p className="text-slate-500 text-sm mb-6 font-medium px-4">Scan the QR code below using any UPI app (GPay, PhonePe, Paytm).</p>

            {/* QR Area */}
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-6 flex flex-col items-center mb-6">
              <div className="size-48 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                {isValidTotal ? (
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=deskify@upi&pn=DeskifyStore&am=${total}&cu=INR`} 
                    alt="QR" 
                    className="size-40" 
                  />
                ) : (
                  <div className="text-slate-300 text-xs text-center">Invalid amount</div>
                )}
              </div>
              <div className="bg-white px-4 py-1.5 rounded-full border border-slate-200 flex items-center gap-2">
                <span className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase">UPI: deskify@store</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center bg-slate-900 p-5 rounded-2xl">
                <span className="text-sm font-bold text-slate-400">Payable Amount</span>
                <span className="text-xl font-black text-white">
                  ₹{isValidTotal ? total.toLocaleString() : '—'}
                </span>
              </div>
              
              <button 
                onClick={handleFakeVerify}
                disabled={!isValidTotal}
                className={`w-full py-5 rounded-2xl font-black transition-all flex items-center justify-center gap-2 ${
                  isValidTotal
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                I HAVE PAID SUCCESSFULLY
              </button>
              
              <button 
                onClick={onClose} 
                className="text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-rose-500 transition-colors"
              >
                Cancel & Go Back
              </button>
            </div>
          </>
        ) : (
          /* Verifying State UI */
          <div className="py-12 flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="text-emerald-500 mb-6"
            >
              <FiLoader size={60} />
            </motion.div>
            <h3 className="text-xl font-black text-slate-900 mb-2 uppercase">Verifying Payment</h3>
            <p className="text-slate-500 text-sm font-medium">Please wait, we are confirming your transaction with the bank...</p>
          </div>
        )}

        {/* Security Badge */}
        <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">
          <FiCheckCircle /> SSL Secured Payment Gateway
        </div>
      </motion.div>
    </div>
  );
}