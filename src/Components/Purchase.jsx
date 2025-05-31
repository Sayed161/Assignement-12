import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Providers/AuthProviders';
import Swal from 'sweetalert2';
import axios from 'axios';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const Purchase = () => {
  const { Quser } = useContext(AuthContext);
  const email = Quser?.email;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const coinPackages = [
    { coins: 10, price: 1, label: "Starter Pack" },
    { coins: 150, price: 10, label: "Bronze Pack" },
    { coins: 500, price: 20, label: "Silver Pack" },
    { coins: 1000, price: 35, label: "Gold Pack" }
  ];

  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!email) return;
        
        const response = await axios.get(`http://localhost:5000/users?email=${email}`);
        setUser(response.data);
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

  const handlePurchase = (pkg) => {
    setSelectedPackage(pkg);
    setShowModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!stripe || !elements) {
      console.log('Stripe.js has not loaded yet');
      return;
    }

    setProcessing(true);
    
    try {
      const cardElement = elements.getElement(CardElement);
      
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
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
        paymentMethodId: paymentMethod.id,
        price: selectedPackage.price,
        coins: selectedPackage.coins,
        currency: 'usd',
        email: Quser.email,
        userId: user._id,
      });
      const responseData = await axios.post('http://localhost:5000/checkout', {
        paymentMethodId: paymentMethod.id,
        price: selectedPackage.price,
        coins: selectedPackage.coins,
        currency: 'usd',
        email: Quser.email,
        userId: user._id,
        createdat: new Date(),
      });

      if (response.data) {
        await axios.patch(`http://localhost:5000/users?email=${email}`, {
          balance: selectedPackage.coins + user.balance
        });
        Swal.fire({
                title: 'Payment Successful!',
                text: `${selectedPackage.coins} coins have been added to your account`,
                icon: 'success'
                });
      }
     
 }
    } catch (error) {
      console.error('Payment error:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'Payment processing failed',
        icon: 'error'
      });
    } finally {
      setProcessing(false);
      setShowModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">Purchase Coins</h1>
        
        {user && (
          <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-8">
            <p className="font-bold">Your Current Balance</p>
            <p>{user.balance || 0} coins</p>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coinPackages.map((pkg, index) => (
            <div 
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{pkg.label}</h2>
                <p className="text-2xl font-bold text-blue-600 mb-1">{pkg.coins} coins</p>
                <p className="text-gray-600">= ${pkg.price}</p>
                <div className="mt-4">
                  <button 
                    onClick={() => handlePurchase(pkg)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
              <h2 className="text-2xl font-bold text-white">Confirm Purchase</h2>
              <p className="text-blue-100 mt-1">
                {selectedPackage?.coins} coins for ${selectedPackage?.price}
              </p>
            </div>
            
            <div className="p-6">
              <div className="mb-6 border border-gray-200 rounded-lg p-3 hover:border-blue-400 transition-colors">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#1f2937',
                        fontFamily: 'Inter, sans-serif',
                        '::placeholder': {
                          color: '#9ca3af',
                          fontWeight: '400',
                        },
                      },
                      invalid: {
                        color: '#ef4444',
                      },
                    },
                    hidePostalCode: true,
                  }}
                />
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Package</span>
                  <span className="font-medium">{selectedPackage?.label}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Coins</span>
                  <span className="font-medium">{selectedPackage?.coins}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Total</span>
                  <span className="text-lg font-bold text-blue-600">
                    ${selectedPackage?.price}
                  </span>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmPurchase}
                  disabled={!stripe || processing}
                  className="px-5 py-2.5 text-sm font-medium rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Confirm Payment'
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-center space-x-2">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z"/>
              </svg>
              <span className="text-xs text-gray-500">Payments are secure and encrypted</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchase;