import React, { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { AuthContext } from "../Providers/AuthProviders";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import Swal from "sweetalert2";

const WithDrawls = () => {
  const { Quser } = useContext(AuthContext);
  const email = Quser?.email;
  const [totalCoins, setTotalCoins] = useState(0);
  const [withdrawalData, setWithdrawalData] = useState({
    coinToWithdraw: 0,
    withdrawAmount: 0,
    paymentSystem: "Stripe", // Changed default to Stripe
    accountNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
const [user, setUser] = useState(null);
  // Fetch user's total coins

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!email) return;
        
        const response = await axios.get(`http://localhost:5000/users?email=${email}`);
        setUser(response.data);
        setTotalCoins(response.data.balance);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to load user data',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      }
    };
    fetchUser();
    
  }, [email]);

  const handleCoinChange = (e) => {
    const coins = parseInt(e.target.value) || 0;
    const dollars = coins / 20;

    setWithdrawalData({
      ...withdrawalData,
      coinToWithdraw: coins,
      withdrawAmount: dollars,
    });
  };
     console.log('response',withdrawalData);
const handleWithdrawalSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    if (withdrawalData.coinToWithdraw > totalCoins) {
      toast.error("You cannot withdraw more coins than you have");
      return;
    }

    if (withdrawalData.coinToWithdraw < 200) {
      toast.error("Minimum withdrawal amount is 200 coins ($10)");
      return;
    }
    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
   if (error) {
        console.log('Payment error:', error);
        Swal.fire({
          title: 'Payment Failed',
          text: error.message,
          icon: 'error'
        });
        return;
      }
      else{
        console.log("paymentMethod",paymentMethod);
      const response = await axios.post('http://localhost:5000/create-payment-intent', {
        price: withdrawalData.withdrawAmount,
        email: Quser.email,
        userId: user._id,
      });
     
      if (response.data) {
        await axios.patch(`http://localhost:5000/users?email=${email}`, {
          balance: user.balance-withdrawalData.coinToWithdraw 
        });
        Swal.fire({
                title: 'Payment Successful!',
                text: `${withdrawalData.coinToWithdraw} coins have been added to your account`,
                icon: 'success'
                });
      }
     
 }

   
      // if (paymentIntent.status === "succeeded") {
      //   const withdrawalResponse = await fetch(
      //     "http://localhost:5000/withdrawals",
      //     {
      //       method: "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //         Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      //       },
      //       body: JSON.stringify({
      //         worker_email: Quser.email,
      //         worker_name: Quser.displayName,
      //         withdrawal_coin: withdrawalData.coinToWithdraw,
      //         withdrawal_amount: withdrawalData.withdrawAmount,
      //         payment_system: "Stripe", // Now using Stripe
      //         account_number: paymentIntent.id, // Using payment intent ID as reference
      //         withdraw_date: new Date().toISOString(),
      //         status: "completed", // Mark as completed since payment succeeded
      //         payment_intent_id: paymentIntent.id,
      //       }),
      //     }
      //   );

      //   const result = await withdrawalResponse.json();
      //   if (result.success) {
      //     toast.success("Withdrawal processed successfully!");
      //     setTotalCoins(totalCoins - withdrawalData.coinToWithdraw);
      //     setWithdrawalData({
      //       coinToWithdraw: 0,
      //       withdrawAmount: 0,
      //       paymentSystem: "Stripe",
      //       accountNumber: "",
      //     });
      //   } else {
      //     toast.error(result.message || "Withdrawal record creation failed");
      //   }
      
     
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-gray-300 min-h-screen p-12">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[url(https://grainy-gradients.vercel.app/noise.svg)] opacity-20"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/10 max-w-2xl mx-auto"
        >
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] mb-6 text-center">
            Withdraw Earnings
          </h1>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00E1F9]"></div>
            </div>
          ) : (
            <>
              <div className="bg-white/5 p-6 rounded-lg mb-8">
                <h2 className="text-xl font-semibold mb-4 text-[#00E1F9]">
                  Your Balance
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Total Coins</p>
                    <p className="text-2xl font-bold">{totalCoins}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Withdrawable Amount</p>
                    <p className="text-2xl font-bold">
                      ${(totalCoins / 20).toFixed(2)}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Minimum withdrawal: 200 coins ($10)
                </p>
              </div>

              <form onSubmit={handleWithdrawalSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="coinToWithdraw"
                    className="block text-sm font-medium mb-2"
                  >
                    Coins to Withdraw
                  </label>
                  <input
                    type="number"
                    id="coinToWithdraw"
                    min="0"
                    max={totalCoins}
                    value={withdrawalData.coinToWithdraw}
                    onChange={handleCoinChange}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00E1F9]"
                    placeholder="Enter coins to withdraw"
                  />
                </div>

                <div>
                  <label
                    htmlFor="withdrawAmount"
                    className="block text-sm font-medium mb-2"
                  >
                    Withdraw Amount ($)
                  </label>
                  <input
                    type="number"
                    id="withdrawAmount"
                    value={withdrawalData.withdrawAmount.toFixed(2)}
                    readOnly
                    className="w-full bg-white/10 border border-white/10 rounded-lg px-4 py-2 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-400 mt-1">20 coins = $1</p>
                </div>

                <div>
                  <label
                    htmlFor="paymentSystem"
                    className="block text-sm font-medium mb-2"
                  >
                    Payment System
                  </label>
                  <div className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus-within:outline-none focus-within:ring-2 focus-within:ring-[#00E1F9]">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "16px",
                            color: "#ffffff", // Changed to white text
                            fontFamily: "Inter, sans-serif",
                            "::placeholder": {
                              color: "#9ca3af",
                              fontWeight: "400",
                            },
                            backgroundColor: "transparent", // Make background transparent
                          },
                          invalid: {
                            color: "#ef4444",
                          },
                        },
                        hidePostalCode: true,
                        classes: {
                          focus: "ring-2 ring-[#00E1F9]", // Add focus ring to match your theme
                        },
                      }}
                    />
                  </div>
                </div>

                {totalCoins >= 200 ? (
                  <button
                    type="submit"
                    className={`w-full px-6 py-3 rounded-lg bg-gradient-to-r from-[#00E1F9] to-[#6A1B70] text-white font-medium hover:opacity-90 ${
                      withdrawalData.coinToWithdraw < 200
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    disabled={withdrawalData.coinToWithdraw < 200}
                  >
                    Request Withdrawal
                  </button>
                ) : (
                  <div className="text-center py-4 bg-red-900/20 rounded-lg text-red-300">
                    Insufficient coins (Minimum 200 coins required)
                  </div>
                )}
              </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0,
          }}
          animate={{
            x: [null, Math.random() * 100 - 50],
            y: [null, Math.random() * 100 - 50],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute w-1 h-1 rounded-full bg-[#00E1F9]"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

export default WithDrawls
