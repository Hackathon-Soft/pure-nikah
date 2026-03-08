import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  FiUser,
  FiHeart,
  FiBook,
  FiBriefcase,
  FiUsers,
  FiCamera,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

import BasicInfoStep from "@/components/profile/BasicInfoStep";
import ReligiousInfoStep from "@/components/profile/ReligiousInfoStep";
import LifestyleStep from "@/components/profile/LifestyleStep";
import FamilyBackgroundStep from "@/components/profile/FamilyBackgroundStep";
import MarriagePreferencesStep from "@/components/profile/MarriagePreferencesStep";
import PhotoUploadStep from "@/components/profile/PhotoUploadStep";

// Validation schemas for each step
const basicInfoSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["male", "female"], { required_error: "Gender is required" }),
  height: z.string().min(1, "Height is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  maritalStatus: z.enum(["never_married", "divorced", "widowed"], {
    required_error: "Marital status is required",
  }),
  bio: z.string().max(500, "Bio must be 500 characters or less").optional(),
});

const religiousInfoSchema = z.object({
  sect: z.string().min(1, "Sect is required"),
  prayerLevel: z.string().min(1, "Prayer level is required"),
  hijabBeard: z.string().optional(),
  islamicValues: z.string().min(1, "Islamic values level is required"),
  religiousPractice: z.string().min(1, "Religious practice level is required"),
  quranRecitation: z.string().optional(),
});

const lifestyleSchema = z.object({
  education: z.string().min(1, "Education is required"),
  profession: z.string().min(1, "Profession is required"),
  incomeRange: z.string().optional(),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  smoking: z.string().optional(),
  dietary: z.string().optional(),
});

const familyBackgroundSchema = z.object({
  caste: z.string().optional(),
  familyType: z.string().min(1, "Family type is required"),
  familyValues: z.string().optional(),
  livingWith: z.string().min(1, "Living situation is required"),
  siblings: z.string().optional(),
  fatherOccupation: z.string().optional(),
  motherOccupation: z.string().optional(),
});

const marriagePreferencesSchema = z.object({
  preferredAgeMin: z.number().min(18, "Minimum age is 18"),
  preferredAgeMax: z.number().max(70, "Maximum age is 70"),
  preferredLocation: z.string().optional(),
  preferredCaste: z.string().optional(),
  preferredEducation: z.string().optional(),
  religiousExpectations: z.string().min(1, "Religious expectations required"),
  willingToRelocate: z.boolean().optional(),
  acceptDivorced: z.boolean().optional(),
  acceptWithChildren: z.boolean().optional(),
});

const photoUploadSchema = z.object({
  profilePhoto: z.string().optional(),
  additionalPhotos: z.array(z.string()).optional(),
  photoPrivacy: z.enum(["public", "blur_until_accepted", "private"]),
});

// Combined schema
const fullProfileSchema = z.object({
  ...basicInfoSchema.shape,
  ...religiousInfoSchema.shape,
  ...lifestyleSchema.shape,
  ...familyBackgroundSchema.shape,
  ...marriagePreferencesSchema.shape,
  ...photoUploadSchema.shape,
});

export type ProfileFormData = z.infer<typeof fullProfileSchema>;

const steps = [
  { id: 1, title: "Basic Info", icon: FiUser, description: "Personal details" },
  { id: 2, title: "Religious", icon: FiBook, description: "Faith & practice" },
  { id: 3, title: "Lifestyle", icon: FiBriefcase, description: "Education & work" },
  { id: 4, title: "Family", icon: FiUsers, description: "Background" },
  { id: 5, title: "Preferences", icon: FiHeart, description: "Partner criteria" },
  { id: 6, title: "Photos", icon: FiCamera, description: "Upload photos" },
];

const CreateProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(fullProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: undefined,
      height: "",
      city: "",
      country: "",
      maritalStatus: undefined,
      bio: "",
      sect: "",
      prayerLevel: "",
      hijabBeard: "",
      islamicValues: "",
      religiousPractice: "",
      quranRecitation: "",
      education: "",
      profession: "",
      incomeRange: "",
      languages: [],
      smoking: "",
      dietary: "",
      caste: "",
      familyType: "",
      familyValues: "",
      livingWith: "",
      siblings: "",
      fatherOccupation: "",
      motherOccupation: "",
      preferredAgeMin: 18,
      preferredAgeMax: 40,
      preferredLocation: "",
      preferredCaste: "",
      preferredEducation: "",
      religiousExpectations: "",
      willingToRelocate: false,
      acceptDivorced: false,
      acceptWithChildren: false,
      profilePhoto: "",
      additionalPhotos: [],
      photoPrivacy: "blur_until_accepted",
    },
    mode: "onChange",
  });

  const progress = (currentStep / steps.length) * 100;

  const validateCurrentStep = async (): Promise<boolean> => {
    const schemas: Record<number, z.ZodSchema> = {
      1: basicInfoSchema,
      2: religiousInfoSchema,
      3: lifestyleSchema,
      4: familyBackgroundSchema,
      5: marriagePreferencesSchema,
      6: photoUploadSchema,
    };

    const currentSchema = schemas[currentStep];
    const values = methods.getValues();
    const result = currentSchema.safeParse(values);

    if (!result.success) {
      result.error.errors.forEach((err) => {
        methods.setError(err.path.join(".") as keyof ProfileFormData, {
          message: err.message,
        });
      });
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      console.log("Profile data:", data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Profile created successfully!");
    } catch (error) {
      toast.error("Failed to create profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <BasicInfoStep />;
      case 2:
        return <ReligiousInfoStep />;
      case 3:
        return <LifestyleStep />;
      case 4:
        return <FamilyBackgroundStep />;
      case 5:
        return <MarriagePreferencesStep />;
      case 6:
        return <PhotoUploadStep />;
      default:
        return null;
    }
  };

  return (
    <div className="p-token-4 md:p-token-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-token-2xl md:text-token-3xl font-display font-bold text-foreground">
          Create Your Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Complete your profile to find your perfect match
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-token-sm text-muted-foreground">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-token-sm font-medium text-primary">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </motion.div>

      {/* Step Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="hidden md:flex justify-between"
      >
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <button
              key={step.id}
              onClick={() => isCompleted && setCurrentStep(step.id)}
              disabled={!isCompleted && !isActive}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive
                  ? "text-primary"
                  : isCompleted
                  ? "text-primary/70 cursor-pointer hover:text-primary"
                  : "text-muted-foreground/50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : isCompleted
                    ? "bg-primary/20 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <FiCheck /> : <StepIcon />}
              </div>
              <span className="text-token-xs font-medium">{step.title}</span>
            </button>
          );
        })}
      </motion.div>

      {/* Mobile Step Indicator */}
      <div className="md:hidden">
        <Card>
          <CardContent className="p-token-4 flex items-center gap-token-3">
            {(() => {
              const CurrentIcon = steps[currentStep - 1].icon;
              return (
                <>
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <CurrentIcon />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {steps[currentStep - 1].title}
                    </p>
                    <p className="text-token-xs text-muted-foreground">
                      {steps[currentStep - 1].description}
                    </p>
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Form */}
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Card>
            <CardContent className="p-token-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderStep()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="gap-2"
            >
              <FiChevronLeft /> Previous
            </Button>

            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNext} className="gap-2">
                Next <FiChevronRight />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting ? "Saving..." : "Complete Profile"} <FiCheck />
              </Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateProfile;
