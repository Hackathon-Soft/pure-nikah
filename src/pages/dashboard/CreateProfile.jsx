import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { FiUser, FiHeart, FiBook, FiBriefcase, FiUsers, FiCamera, FiCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

import BasicInfoStep from "@/components/profile/BasicInfoStep";
import ReligiousInfoStep from "@/components/profile/ReligiousInfoStep";
import LifestyleStep from "@/components/profile/LifestyleStep";
import FamilyBackgroundStep from "@/components/profile/FamilyBackgroundStep";
import MarriagePreferencesStep from "@/components/profile/MarriagePreferencesStep";
import PhotoUploadStep from "@/components/profile/PhotoUploadStep";

const basicInfoSchema = yup.object({
  firstName: yup.string().min(2, "First name is required").required("First name is required"),
  lastName: yup.string().min(2, "Last name is required").required("Last name is required"),
  dateOfBirth: yup.string().min(1, "Date of birth is required").required("Date of birth is required"),
  gender: yup.string().oneOf(["male", "female"], "Gender is required").required("Gender is required"),
  height: yup.string().min(1, "Height is required").required("Height is required"),
  city: yup.string().min(2, "City is required").required("City is required"),
  country: yup.string().min(2, "Country is required").required("Country is required"),
  maritalStatus: yup.string().oneOf(["never_married", "divorced", "widowed"], "Marital status is required").required("Marital status is required"),
  bio: yup.string().max(500, "Bio must be 500 characters or less").optional(),
});

const religiousInfoSchema = yup.object({
  sect: yup.string().min(1).required("Sect is required"),
  prayerLevel: yup.string().min(1).required("Prayer level is required"),
  hijabBeard: yup.string().optional(),
  islamicValues: yup.string().min(1).required("Islamic values is required"),
  religiousPractice: yup.string().min(1).required("Religious practice is required"),
  quranRecitation: yup.string().optional(),
});

const lifestyleSchema = yup.object({
  education: yup.string().min(1).required("Education is required"),
  profession: yup.string().min(1).required("Profession is required"),
  incomeRange: yup.string().optional(),
  languages: yup.array().of(yup.string().required()).min(1, "Select at least one language").required(),
  smoking: yup.string().optional(),
  dietary: yup.string().optional(),
});

const familyBackgroundSchema = yup.object({
  caste: yup.string().optional(),
  familyType: yup.string().min(1).required("Family type is required"),
  familyValues: yup.string().optional(),
  livingWith: yup.string().min(1).required("Living situation is required"),
  siblings: yup.string().optional(),
  fatherOccupation: yup.string().optional(),
  motherOccupation: yup.string().optional(),
});

const marriagePreferencesSchema = yup.object({
  preferredAgeMin: yup.number().min(18).required(),
  preferredAgeMax: yup.number().max(70).required(),
  preferredLocation: yup.string().optional(),
  preferredCaste: yup.string().optional(),
  preferredEducation: yup.string().optional(),
  religiousExpectations: yup.string().min(1).required("Religious expectations required"),
  willingToRelocate: yup.boolean().optional(),
  acceptDivorced: yup.boolean().optional(),
  acceptWithChildren: yup.boolean().optional(),
});

const photoUploadSchema = yup.object({
  profilePhoto: yup.string().optional(),
  additionalPhotos: yup.array().of(yup.string().required()).optional(),
  photoPrivacy: yup.string().oneOf(["public", "blur_until_accepted", "private"]).required("Photo privacy is required"),
});

const fullProfileSchema = basicInfoSchema.concat(religiousInfoSchema).concat(lifestyleSchema).concat(familyBackgroundSchema).concat(marriagePreferencesSchema).concat(photoUploadSchema);

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
  const { user, profile, fetchProfile } = useAuth();
  const navigate = useNavigate();

  const methods = useForm({
    resolver: yupResolver(fullProfileSchema),
    defaultValues: {
      firstName: profile?.first_name || "",
      lastName: profile?.last_name || "",
      dateOfBirth: profile?.date_of_birth || "",
      gender: profile?.gender || undefined,
      height: profile?.height || "",
      city: profile?.city || "",
      country: profile?.country || "Pakistan",
      maritalStatus: profile?.marital_status || undefined,
      bio: profile?.bio || "",
      sect: profile?.sect || "",
      prayerLevel: profile?.prayer_level || "",
      hijabBeard: profile?.hijab_beard || "",
      islamicValues: profile?.islamic_values || "",
      religiousPractice: profile?.religious_practice || "",
      quranRecitation: profile?.quran_recitation || "",
      education: profile?.education || "",
      profession: profile?.profession || "",
      incomeRange: profile?.income_range || "",
      languages: profile?.languages || [],
      smoking: profile?.smoking || "",
      dietary: profile?.dietary || "",
      caste: profile?.caste || "",
      familyType: profile?.family_type || "",
      familyValues: profile?.family_values || "",
      livingWith: profile?.living_with || "",
      siblings: profile?.siblings || "",
      fatherOccupation: profile?.father_occupation || "",
      motherOccupation: profile?.mother_occupation || "",
      preferredAgeMin: profile?.preferred_age_min || 18,
      preferredAgeMax: profile?.preferred_age_max || 40,
      preferredLocation: profile?.preferred_location || "",
      preferredCaste: profile?.preferred_caste || "",
      preferredEducation: profile?.preferred_education || "",
      religiousExpectations: profile?.religious_expectations || "",
      willingToRelocate: profile?.willing_to_relocate || false,
      acceptDivorced: profile?.accept_divorced || false,
      acceptWithChildren: profile?.accept_with_children || false,
      profilePhoto: "",
      additionalPhotos: [],
      photoPrivacy: profile?.photo_privacy || "blur_until_accepted",
    },
    mode: "onChange",
  });

  const progress = (currentStep / steps.length) * 100;

  const validateCurrentStep = async () => {
    const schemas = { 1: basicInfoSchema, 2: religiousInfoSchema, 3: lifestyleSchema, 4: familyBackgroundSchema, 5: marriagePreferencesSchema, 6: photoUploadSchema };
    const currentSchema = schemas[currentStep];
    const values = methods.getValues();
    try {
      await currentSchema.validate(values, { abortEarly: false });
      return true;
    } catch (err) {
      if (err.inner) { err.inner.forEach((e) => { if (e.path) { methods.setError(e.path, { message: e.message }); } }); }
      return false;
    }
  };

  const handleNext = async () => { const isValid = await validateCurrentStep(); if (isValid && currentStep < steps.length) setCurrentStep(currentStep + 1); };
  const handlePrevious = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
          date_of_birth: data.dateOfBirth,
          gender: data.gender,
          height: data.height,
          city: data.city,
          country: data.country,
          marital_status: data.maritalStatus,
          bio: data.bio,
          sect: data.sect,
          prayer_level: data.prayerLevel,
          hijab_beard: data.hijabBeard,
          islamic_values: data.islamicValues,
          religious_practice: data.religiousPractice,
          quran_recitation: data.quranRecitation,
          education: data.education,
          profession: data.profession,
          income_range: data.incomeRange,
          languages: data.languages,
          smoking: data.smoking,
          dietary: data.dietary,
          caste: data.caste,
          family_type: data.familyType,
          family_values: data.familyValues,
          living_with: data.livingWith,
          siblings: data.siblings,
          father_occupation: data.fatherOccupation,
          mother_occupation: data.motherOccupation,
          preferred_age_min: data.preferredAgeMin,
          preferred_age_max: data.preferredAgeMax,
          preferred_location: data.preferredLocation,
          preferred_caste: data.preferredCaste,
          preferred_education: data.preferredEducation,
          religious_expectations: data.religiousExpectations,
          willing_to_relocate: data.willingToRelocate,
          accept_divorced: data.acceptDivorced,
          accept_with_children: data.acceptWithChildren,
          photo_privacy: data.photoPrivacy,
          profile_completed: true,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      await fetchProfile(user.id);
      toast.success("Profile saved successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to save profile: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <BasicInfoStep />;
      case 2: return <ReligiousInfoStep />;
      case 3: return <LifestyleStep />;
      case 4: return <FamilyBackgroundStep />;
      case 5: return <MarriagePreferencesStep />;
      case 6: return <PhotoUploadStep />;
      default: return null;
    }
  };

  return (
    <div className="p-token-4 md:p-token-8 max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-token-2xl md:text-token-3xl font-display font-bold text-foreground">
          {profile?.profile_completed ? "Edit Your Profile" : "Create Your Profile"}
        </h1>
        <p className="text-muted-foreground mt-1">Complete your profile to find your perfect match</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center justify-between mb-2"><span className="text-token-sm text-muted-foreground">Step {currentStep} of {steps.length}</span><span className="text-token-sm font-medium text-primary">{Math.round(progress)}% Complete</span></div>
        <Progress value={progress} className="h-2" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="hidden md:flex justify-between">
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;
          return (
            <button key={step.id} onClick={() => isCompleted && setCurrentStep(step.id)} disabled={!isCompleted && !isActive}
              className={`flex flex-col items-center gap-1 transition-all ${isActive ? "text-primary" : isCompleted ? "text-primary/70 cursor-pointer hover:text-primary" : "text-muted-foreground/50"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isActive ? "bg-primary text-primary-foreground" : isCompleted ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}>
                {isCompleted ? <FiCheck /> : <StepIcon />}
              </div>
              <span className="text-token-xs font-medium">{step.title}</span>
            </button>
          );
        })}
      </motion.div>
      <div className="md:hidden">
        <Card><CardContent className="p-token-4 flex items-center gap-token-3">
          {(() => { const CurrentIcon = steps[currentStep - 1].icon; return (<><div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center"><CurrentIcon /></div><div><p className="font-medium text-foreground">{steps[currentStep - 1].title}</p><p className="text-token-xs text-muted-foreground">{steps[currentStep - 1].description}</p></div></>); })()}
        </CardContent></Card>
      </div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Card><CardContent className="p-token-6">
            <AnimatePresence mode="wait">
              <motion.div key={currentStep} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>{renderStep()}</motion.div>
            </AnimatePresence>
          </CardContent></Card>
          <div className="flex justify-between mt-6">
            <Button type="button" variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="gap-2"><FiChevronLeft /> Previous</Button>
            {currentStep < steps.length ? (
              <Button type="button" onClick={handleNext} className="gap-2">Next <FiChevronRight /></Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} className="gap-2">{isSubmitting ? "Saving..." : "Complete Profile"} <FiCheck /></Button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default CreateProfile;
