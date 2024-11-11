import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  
  const steps = [
    {
      title: 'Welcome to NutriSwap',
      description: 'Your personal nutrition assistant for healthier food choices.',
    },
    {
      title: 'Track Your Meals',
      description: 'Log your meals easily and get instant nutritional insights.',
    },
    {
      title: 'Smart Recommendations',
      description: 'Receive personalized meal suggestions based on your goals.',
    },
    {
      title: 'Join the Community',
      description: 'Connect with others on their health journey.',
    },
  ];

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      navigate('/home');
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="card">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            {steps[step - 1].title}
          </h1>
          <p className="text-gray-600 text-lg">
            {steps[step - 1].description}
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index + 1 === step ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="btn btn-primary w-full"
        >
          {step === steps.length ? 'Get Started' : 'Next'}
        </button>
      </div>
    </div>
  );
}

export default Onboarding; 