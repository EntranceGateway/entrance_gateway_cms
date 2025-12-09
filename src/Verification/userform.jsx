import React, { useState } from "react";

const defaultForm = {
  fullname: "",
  email: "",
  contact: "",
  dob: "",
  latestQualification: "",
  interested: "",
  role: "",
  address: "",
  password: "",
};

const steps = ["Personal Info", "Education & Interest", "Address & Security"];

const MultiStepForm = ({onSubmit}) => {
  const [form, setForm] = useState(defaultForm);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const validateStep = () => {
    const newErrors = {};
    const requiredFields = {
      1: ["fullname", "email", "contact", "dob"],
      2: ["latestQualification", "interested", "role"],
      3: ["address", "password"],
    };

    requiredFields[step].forEach((field) => {
      if (!form[field].trim()) newErrors[field] = "This field is required";
    });

    // Email validation
    if (step === 1 && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }

    // Password validation
    if (step === 3 && form.password && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    if (validateStep()) {
      console.log("Form submitted:", form);
      setSubmitted(true);
    }
  };

  const inputClass = (field) =>
    `mt-1 block w-full rounded-md border px-3 py-2 shadow-sm transition focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 ring-red-500"
        : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
    }`;

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-100 via-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Side Image */}
        <div className="md:w-2/5 bg-linear-to-br from-indigo-600 to-purple-700 p-8 flex flex-col justify-center items-center text-white">
          <div className="text-center">
            <div className="mb-6">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Join Us Today</h2>
            <p className="text-indigo-100 mb-6">
              Complete the registration process in just 3 simple steps
            </p>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <span className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">✓</span>
                <span>Quick and easy process</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">✓</span>
                <span>Secure data handling</span>
              </div>
              <div className="flex items-center">
                <span className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">✓</span>
                <span>Get started instantly</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-3/5 p-8 md:p-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Multi-Step Registration</h1>
          <p className="text-gray-600 mb-8">Step {step} of {steps.length}</p>

          {/* Progress Bar */}
          <div className="mb-8 flex items-center justify-between">
            {steps.map((label, index) => (
              <React.Fragment key={index}>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition ${
                      index + 1 <= step
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 hidden sm:block">{label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition ${
                      index + 1 < step ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
              <p className="text-gray-600 mb-6">Your registration has been submitted successfully.</p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setStep(1);
                  setForm(defaultForm);
                }}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Submit Another Form
              </button>
            </div>
          ) : (
            <div>
              {/* Step 1 */}
              {step === 1 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullname"
                      value={form.fullname}
                      onChange={handleChange}
                      className={inputClass("fullname")}
                      placeholder="Enter your full name"
                    />
                    {errors.fullname && (
                      <p className="mt-1 text-sm text-red-500">{errors.fullname}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className={inputClass("email")}
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contact"
                      value={form.contact}
                      onChange={handleChange}
                      className={inputClass("contact")}
                      placeholder="Enter your phone number"
                    />
                    {errors.contact && (
                      <p className="mt-1 text-sm text-red-500">{errors.contact}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                      className={inputClass("dob")}
                    />
                    {errors.dob && (
                      <p className="mt-1 text-sm text-red-500">{errors.dob}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Latest Qualification <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="latestQualification"
                      value={form.latestQualification}
                      onChange={handleChange}
                      className={inputClass("latestQualification")}
                    >
                      <option value="">Select qualification</option>
                      <option value="highschool">High School</option>
                      <option value="bachelor">Bachelor's Degree</option>
                      <option value="master">Master's Degree</option>
                      <option value="phd">PhD</option>
                    </select>
                    {errors.latestQualification && (
                      <p className="mt-1 text-sm text-red-500">{errors.latestQualification}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Interested Field <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="interested"
                      value={form.interested}
                      onChange={handleChange}
                      className={inputClass("interested")}
                      placeholder="e.g., Web Development, Data Science"
                    />
                    {errors.interested && (
                      <p className="mt-1 text-sm text-red-500">{errors.interested}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="role"
                      value={form.role}
                      onChange={handleChange}
                      className={inputClass("role")}
                    >
                      <option value="">Select role</option>
                      <option value="student">Student</option>
                      <option value="professional">Professional</option>
                      <option value="freelancer">Freelancer</option>
                      <option value="entrepreneur">Entrepreneur</option>
                    </select>
                    {errors.role && (
                      <p className="mt-1 text-sm text-red-500">{errors.role}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3 */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      rows={4}
                      className={inputClass("address")}
                      placeholder="Enter your full address"
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-500">{errors.address}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className={inputClass("password")}
                      placeholder="Create a secure password"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between gap-4">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                  >
                    Back
                  </button>
                )}
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                  >
                    Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MultiStepForm;